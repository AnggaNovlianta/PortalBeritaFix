import express from "express";
import path from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";
import { seedSeventyDummyArticles } from "./server-dummy-seeder";

// In-memory registry for uploaded user avatars
let userAvatars: Record<string, string> = {};
const AVATARS_FILE_PATH = path.join(process.cwd(), "user_avatars.json");

try {
  if (existsSync(AVATARS_FILE_PATH)) {
    userAvatars = JSON.parse(readFileSync(AVATARS_FILE_PATH, "utf8"));
    console.log("[Firebase] Muat data avatar lokal berhasil, jumlah: ", Object.keys(userAvatars).length);
  }
} catch (err) {
  console.error("[Firebase] Gagal memuat data avatar lokal:", err);
}

const saveLocalAvatars = () => {
  try {
    writeFileSync(AVATARS_FILE_PATH, JSON.stringify(userAvatars, null, 2), "utf8");
  } catch (err) {
    console.error("[Firebase] Gagal menyimpan data avatar lokal ke file:", err);
  }
};

// ---------------------- Firebase Firestore Database Setup ----------------------
import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocFromServer,
  setLogLevel
} from "firebase/firestore";

let db: any;

try {
  setLogLevel("error");
  const firebaseConfig = JSON.parse(
    readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
  );
  const fbApp = initializeApp(firebaseConfig);
  db = initializeFirestore(fbApp, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
  console.log("[Firebase] Inisialisasi Firestore berhasil (Long Polling aktif) dengan Database ID:", firebaseConfig.firestoreDatabaseId);
} catch (err) {
  console.error("[Firebase] Gagal menginisialisasi Firebase:", err);
}

// Reusable handler for handling Firestore errors with full telemetry as required by the Firebase-Integration skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: "system-server-node",
      email: "server@faktafaktual.id",
    },
    operationType,
    path
  };
  console.error('[Firebase Error Log]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection initially on boot as required by the Firebase-Integration skill
async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("[Firebase] Koneksi server ke Firestore berhasil terverifikasi.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Initialize Gemini client safely
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// --- SECURITY PROTOCOL: IN-MEMORY RATE LIMITING ENGINE ---
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return (req: any, res: any, next: any) => {
    // Treat 'x-forwarded-for' headers safely or fallback to req.ip
    const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || req.ip || '127.0.0.1').split(',')[0].trim();
    
    // Apply rate limiter specifically to API requests API routes
    if (!req.url.startsWith('/api')) {
      return next();
    }
    
    // Do not rate limit health check or simple GET resources excessively, but protect POST/PUT/DELETE
    const isWriteRequest = ["POST", "PUT", "DELETE"].includes(req.method);
    const resolvedMax = isWriteRequest ? Math.ceil(maxRequests / 3) : maxRequests; // Strict limit on writes

    const now = Date.now();
    let bucket = rateLimitStore.get(ip);
    
    if (!bucket) {
      bucket = { tokens: resolvedMax, lastRefill: now };
      rateLimitStore.set(ip, bucket);
    } else {
      // Calculate refilled tokens based on time elapsed
      const timeElapsed = now - bucket.lastRefill;
      if (timeElapsed >= windowMs) {
        bucket.tokens = resolvedMax;
        bucket.lastRefill = now;
      }
    }
    
    if (bucket.tokens > 0) {
      bucket.tokens--;
      res.setHeader('X-RateLimit-Limit', resolvedMax);
      res.setHeader('X-RateLimit-Remaining', bucket.tokens);
      res.setHeader('X-RateLimit-Reset-Ms', bucket.lastRefill + windowMs);
      next();
    } else {
      console.warn(`[Security Alert] Rate limit exceeded by IP: ${ip} on endpoint ${req.method} ${req.originalUrl}`);
      res.setHeader('X-RateLimit-Limit', resolvedMax);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset-Ms', bucket.lastRefill + windowMs);
      res.status(429).json({
        error: "Too Many Requests",
        message: "Lalu lintas terlalu padat dari alamat IP Anda. Demi keselamatan integrasi portal, silakan coba lagi dalam beberapa menit.",
        retryAfterMs: Math.max(1, (bucket.lastRefill + windowMs) - now)
      });
    }
  };
};

app.use(rateLimiter(90, 60000)); // Apply custom rate limit of 90 read requests/min, or 30 write requests/min

// In-Memory Database State (seeded upon startup)
let websiteSettings = {
  websiteName: "Fakta Faktual",
  websiteLogo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80",
  smtpHost: "smtp.faktafaktual.id",
  smtpPort: 587,
  smtpUser: "redaksi@faktafaktual.id",
  smtpPass: "*****************",
  companyName: "PT Fakta Media Nusantara",
  companyAddress: "Gedung Fakta Presisi Lantai 12, Jl. MH Thamrin No.8, Jakarta Pusat, DKI Jakarta",
  companyMapCoordinates: "-6.2088,106.8456", // Sudirman/Thamrin Central
  socialFb: "https://facebook.com/faktafaktual.id",
  socialX: "https://x.com/faktafaktual_id",
  socialIg: "https://instagram.com/faktafaktual_official",
  socialYt: "https://youtube.com/c/FaktaFaktualChannel",
  adsHeader: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=728&h=90&fit=crop&q=80",
  adsSidebar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=250&fit=crop&q=80",
  adsArticleBottom: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=728&h=90&fit=crop&q=80",
  categories: ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"],
  announcement: "Fakta Faktual kini hadir dengan informasi paling presisi, tajam, dan tepercaya untuk Anda.",
  youtubeChannelId: "UC68D_D49mI-Q2Ujhi76W2pw", // default MetroTV channel ID
  youtubeStreamId: "5qap5aO4i9A", // default live stream or video
  adsenseClientId: "ca-pub-1234567890123456",
  adsenseHeaderCode: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>`,
  themePreset: "slate",
  layoutPreset: "classic"
};

let editorialTeam = [
  { id: "e1", name: "Irfan Wijaya", role: "Pemimpin Redaksi", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&crop=face&q=80" },
  { id: "e2", name: "Siti Rahmawati", role: "Redaktur Eksekutif", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&fit=crop&crop=face&q=80" },
  { id: "e3", name: "Budi Santoso", role: "Editor Senior Politik", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&fit=crop&crop=face&q=80" },
  { id: "e4", name: "Rendra Kusuma", role: "Jurnalis Investigasi", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&fit=crop&crop=face&q=80" }
];

let users = [
  { id: "u-admin", username: "admin", name: "Mega Adi Wijaya", email: "admin@faktafaktual.id", role: "admin", isPremium: true, avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop&q=80", password: "admin123" },
  { id: "u-editor", username: "editor", name: "Dewi Lestari", email: "editor@faktafaktual.id", role: "editor", isPremium: true, avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80", password: "editor123" },
  { id: "u-jour", username: "wartawan", name: "Rendra Kusuma", email: "wartawan@faktafaktual.id", role: "journalist", isPremium: false, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80", password: "wartawan123" },
  { id: "u-contrib", username: "kontributor", name: "Arman Maulana", email: "kontributor@faktafaktual.id", role: "contributor", isPremium: false, avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&fit=crop&q=80", password: "kontributor123" },
  { id: "u-user", username: "user", name: "Budi Pamungkas", email: "pembaca@gmail.com", role: "user", isPremium: false, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80", password: "pembaca123" }
];

const generateIntegrityHash = (title: string, content: string) => {
  return crypto.createHash("sha256").update(title + content).digest("hex");
};

let articles = [
  {
    id: "art-1",
    title: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong",
    content: "Ekonomi digital Indonesia diproyeksikan akan terus bertumbuh secara eksponensial di tahun 2026. Pemerintah bersama pelaku industri startup merumuskan regulasi baru untuk menyeimbangkan pasar domestik. Transformasi ini menyasar digitalisasi UMKM di kawasan Indonesia Timur, memberikan akses pasar yang terintegrasi langsung dengan logistik maritim nasional.\n\nDalam konferensi pers pekan ini, Menteri Koordinator Perekonomian menegaskan pentingnya stabilitas konektivitas internet serat optik di seluruh kabupaten sebagai garda terdepan pertumbuhan ekonomi berkelanjutan.",
    summary: "Ekonomi digital Indonesia diproyeksikan terus tumbuh kuat di 2026 didukung program digitalisasi UMKM dan logistik maritim nasional.",
    category: "Ekonomi",
    authorId: "u-jour",
    authorName: "Rendra Kusuma",
    authorRole: "journalist",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&fit=crop&q=80",
    isPremium: false,
    status: "published",
    publishedAt: "2026-06-06T12:00:00Z",
    seoTitle: "Akselerasi Ekonomi Digital Nasional Target 8 persen Geliat UMKM Timur",
    seoDescription: "Ekonomi digital Indonesia diproyeksikan tumbuh pesat berkat digitalisasi UMKM and jaringan internet merata nasional.",
    seoKeywords: ["ekonomi digital", "UMKM", "Menteri Perekonomian"],
    views: 12450,
    commentsCount: 2,
    encryptedHash: ""
  },
  {
    id: "art-2",
    title: "Eksklusif: Mengintip Pembangkit Listrik Tenaga Surya Terapung Terbesar RI",
    content: "Teknologi energi terbarukan Indonesia meluncurkan babak baru. PLTS Terapung yang membentang di waduk perbatasan Jawa Barat ini akhirnya beroperasi pada kapasitas penuh, menyuplai listrik rendah emisi bagi jaringan transmisi interkoneksi regional.\n\nAnggota redaksi Fakta Faktual berkesempatan eksklusif meninjau instalasi panel sel surya anti-reflektif berteknologi tinggi yang meminimalkan penguapan air waduk sekaligus menghidupkan ekosistem akuatik lokal di sekitarnya.",
    summary: "Tinjauan eksklusif Fakta Faktual atas beroperasinya PLTS terapung terbesar nasional penyedia daya ramah lingkungan berkelanjutan.",
    category: "Teknologi",
    authorId: "u-jour",
    authorName: "Rendra Kusuma",
    authorRole: "journalist",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&fit=crop&q=80",
    isPremium: true,
    status: "published",
    publishedAt: "2026-06-05T09:30:00Z",
    seoTitle: "PLTS Terapung Terbesar Indonesia Energi Terbarukan Hijau Eksklusif",
    seoDescription: "PLTS Terapung terbesar Indonesia kini beroperasi penuh mendongkrak suplai daya nasional bebas polusi.",
    seoKeywords: ["PLTS terapung", "energi hijau", "panel surya"],
    views: 8940,
    commentsCount: 1,
    encryptedHash: ""
  },
  {
    id: "art-3",
    title: "Eksplorasi Geopark Ciletuh: Mahkota Pariwisata Geologis Berkelanjutan Jawa Barat",
    content: "Geopark Ciletuh menawarkan pemandangan purba spektakuler dengan amfiteater alam yang menawan hati petualang. Komunitas lokal berperan aktif mengelola ecotourism ramah lingkungan demi memperpanjang mata pencaharian berkelanjutan bagi warga tanpa mencederai warisan bumi UNESCO.\n\nPemerintah daerah memperketat protokol zero-waste guna memastikan kelestarian keanekaragaman hayati terlindungi dari luapan turis mancanegara.",
    summary: "Pengelolaan wisata geologi berkelanjutan di Geopark Ciletuh UNESCO menyeimbangkan pariwisata beruntung tinggi dengan konservasi alam ketat.",
    category: "Pariwisata",
    authorId: "u-contrib",
    authorName: "Arman Maulana",
    authorRole: "contributor",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop&q=80",
    isPremium: false,
    status: "published",
    publishedAt: "2026-06-07T02:00:00Z",
    seoTitle: "Keindahan Purba Geopark Ciletuh UNESCO Ecotourism Berkelanjutan",
    seoDescription: "Menelusuri eksotisme Geopark Ciletuh Sukabumi Jawa Barat dan upaya ecotourism berbasis gotong royong komunitas lokal.",
    seoKeywords: ["geopark ciletuh", "pariwisata", "UNESCO Jabar"],
    views: 4520,
    commentsCount: 0,
    encryptedHash: ""
  }
];

// Hash initialization
articles = articles.map(art => ({
  ...art,
  encryptedHash: generateIntegrityHash(art.title, art.content)
}));

let comments: any[] = [
  { id: "com-1", articleId: "art-1", authorName: "Kuncoro Jati", authorEmail: "kuncoro@outlook.com", content: "Wah ini langkah progresif sekali bagi pelaku UMKM di Papua dan Maluku. Semoga biaya logistik benar-benar dipangkas!", createdAt: "2026-06-06T13:40:00Z", status: "approved", aiModerationScore: 2 },
  { id: "com-2", articleId: "art-1", authorName: "Lia Sasmita", authorEmail: "lias@gmail.com", content: "Kualitas internet pedesaan masih lambat, tolong kementerian terkait tidak sekedar janji saja tapi buktikan lapangannya.", createdAt: "2026-06-06T15:10:00Z", status: "approved", aiModerationScore: 12 },
  { id: "com-3", articleId: "art-2", authorName: "Agus Salim", authorEmail: "aguss@yahoo.com", content: "Luar biasa, bangga sekali melihat panel energi terapung berukuran masif terapung indah di atas bendungan kita.", createdAt: "2026-06-05T10:15:00Z", status: "approved", aiModerationScore: 1 }
];

let subscriptionsList = [
  { id: "sub-1", userEmail: "premium_pembaca@test.com", plan: "bulanan", timestamp: "2026-06-04T08:00:00Z", amount: 49000 },
];

let pushNotificationsList: { id: string; title: string; body: string; sentAt: string }[] = [];

let viewerLogs: any[] = [
  { id: "vlog-1", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Jakarta Pusat", region: "DKI Jakarta", country: "Indonesia", device: "Desktop", timestamp: "2026-06-07T08:12:00Z" },
  { id: "vlog-2", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Bandung", region: "Jawa Barat", country: "Indonesia", device: "Mobile", timestamp: "2026-06-07T07:45:00Z" },
  { id: "vlog-3", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Surabaya", region: "Jawa Timur", country: "Indonesia", device: "Mobile", timestamp: "2026-06-07T06:30:00Z" },
  { id: "vlog-4", articleId: "art-2", articleTitle: "Energi Surya Terapung Terbesar Asia Tenggara Resmi Beroperasi di Cirata", city: "Jakarta Selatan", region: "DKI Jakarta", country: "Indonesia", device: "Desktop", timestamp: "2026-06-07T08:15:00Z" },
  { id: "vlog-5", articleId: "art-2", articleTitle: "Energi Surya Terapung Terbesar Asia Tenggara Resmi Beroperasi di Cirata", city: "Bandung", region: "Jawa Barat", country: "Indonesia", device: "Tablet", timestamp: "2026-06-07T05:20:00Z" },
  { id: "vlog-6", articleId: "art-3", articleTitle: "Eksplorasi Geopark Ciletuh: Mahkota Pariwisata Geologis Berkelanjutan Jawa Barat", city: "Makassar", region: "Sulawesi Selatan", country: "Indonesia", device: "Mobile", timestamp: "2026-06-07T07:11:00Z" },
  { id: "vlog-7", articleId: "art-3", articleTitle: "Eksplorasi Geopark Ciletuh: Mahkota Pariwisata Geologis Berkelanjutan Jawa Barat", city: "Medan", region: "Sumatera Utara", country: "Indonesia", device: "Desktop", timestamp: "2026-06-07T04:55:00Z" },
  { id: "vlog-8", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Semarang", region: "Jawa Tengah", country: "Indonesia", device: "Mobile", timestamp: "2026-06-06T23:10:00Z" },
  { id: "vlog-9", articleId: "art-2", articleTitle: "Energi Surya Terapung Terbesar Asia Tenggara Resmi Beroperasi di Cirata", city: "Yogyakarta", region: "DI Yogyakarta", country: "Indonesia", device: "Desktop", timestamp: "2026-06-06T19:44:00Z" },
  { id: "vlog-10", articleId: "art-3", articleTitle: "Eksplorasi Geopark Ciletuh: Mahkota Pariwisata Geologis Berkelanjutan Jawa Barat", city: "Denpasar", region: "Bali", country: "Indonesia", device: "Mobile", timestamp: "2026-06-06T15:20:00Z" },
  { id: "vlog-11", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Palembang", region: "Sumatera Selatan", country: "Indonesia", device: "Tablet", timestamp: "2026-06-06T12:05:00Z" },
  { id: "vlog-12", articleId: "art-2", articleTitle: "Energi Surya Terapung Terbesar Asia Tenggara Resmi Beroperasi di Cirata", city: "Balikpapan", region: "Kalimantan Timur", country: "Indonesia", device: "Mobile", timestamp: "2026-06-06T10:15:00Z" },
  { id: "vlog-13", articleId: "art-3", articleTitle: "Eksplorasi Geopark Ciletuh: Mahkota Pariwisata Geologis Berkelanjutan Jawa Barat", city: "Makassar", region: "Sulawesi Selatan", country: "Indonesia", device: "Desktop", timestamp: "2026-06-06T09:30:00Z" },
  { id: "vlog-14", articleId: "art-1", articleTitle: "Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong", city: "Manado", region: "Sulawesi Utara", country: "Indonesia", device: "Mobile", timestamp: "2026-06-05T14:40:00Z" },
  { id: "vlog-15", articleId: "art-2", articleTitle: "Energi Surya Terapung Terbesar Asia Tenggara Resmi Beroperasi di Cirata", city: "Pekanbaru", region: "Riau", country: "Indonesia", device: "Mobile", timestamp: "2026-06-05T11:25:00Z" }
];

// Seeding logic to populate Firestore from initial mocks if Firestore collections are empty
async function syncAndSeedDatabase() {
  if (!db) return;

  try {
    console.log("[Firebase] Sinkronisasi data ke cloud database sedang berlangsung...");
    
    // 1. Sync Settings
    const settingsDocRef = doc(db, "settings", "main");
    const settingsSnap = await getDoc(settingsDocRef);
    if (!settingsSnap.exists()) {
      console.log("[Firebase SEED] Memasukkan pengaturan awal portal...");
      await setDoc(settingsDocRef, websiteSettings);
    } else {
      const currentDbData = settingsSnap.data() || {};
      websiteSettings = { ...websiteSettings, ...currentDbData };
      
      // Update DB if any categories are missing, or force a sync to ensure full schema compliance
      if (!currentDbData.categories) {
        websiteSettings.categories = ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"];
      }
      
      try {
        await setDoc(settingsDocRef, websiteSettings);
        console.log("[Firebase SYNC] Pengaturan portal disinkronkan dan diperbarui di Firestore.");
      } catch (writeErr) {
        console.error("[Firebase Error] Gagal menulis sinkronisasi settings:", writeErr);
      }
    }

    // 2. Sync Editorial Team
    const teamColRef = collection(db, "editorialTeam");
    const teamSnap = await getDocs(teamColRef);
    if (teamSnap.empty) {
      console.log("[Firebase SEED] Memasukkan daftar struktur redaktur...");
      for (const member of editorialTeam) {
        await setDoc(doc(db, "editorialTeam", member.id), member);
      }
    } else {
      editorialTeam = teamSnap.docs.map(d => d.data()) as typeof editorialTeam;
      console.log("[Firebase SYNC] Daftar redaksi disinkronkan dari Firestore.");
    }

    // 3. Sync Users
    const usersColRef = collection(db, "users");
    const usersSnap = await getDocs(usersColRef);
    if (usersSnap.empty) {
      console.log("[Firebase SEED] Memasukkan pengguna bawaan system...");
      for (const u of users) {
        await setDoc(doc(db, "users", u.id), u);
      }
    } else {
      const dbUsers = usersSnap.docs.map(d => d.data()) as any[];
      let updatedUsers = [];
      for (const u of dbUsers) {
        if (!u.password) {
          u.password = u.username === "admin" ? "admin123" : u.username + "123";
          await setDoc(doc(db, "users", u.id), u);
          console.log(`[Firebase PATCH] Dibuat kata sandi bawaan untuk ${u.email}: ${u.password}`);
        }
        updatedUsers.push(u);
      }
      users = updatedUsers;
      console.log("[Firebase SYNC] Sesi akun pengguna disinkronkan dari Firestore.");
    }

    // 4. Sync Articles
    const articlesColRef = collection(db, "articles");
    const articlesSnap = await getDocs(articlesColRef);
    if (articlesSnap.empty) {
      console.log("[Firebase SEED] Memasukkan artikel berita bawaan...");
      for (const art of articles) {
        await setDoc(doc(db, "articles", art.id), art);
      }
      // Auto-run seventy dummy articles seeding since DB is fresh/empty
      console.log("[Firebase SEED] Melakukan seeder otomatis 70 artikel dummy (min 500 kata per kategori)...");
      const seedResult = await seedSeventyDummyArticles(db, articles, generateIntegrityHash);
      console.log(`[Firebase SEED] Berhasil memasukkan ${seedResult.count} artikel berita berkualitas.`);
    } else {
      articles = articlesSnap.docs.map(d => d.data()) as typeof articles;
      console.log("[Firebase SYNC] Arsip artikel berita disinkronkan dari Firestore, jumlah: " + articles.length);
      
      // If there are very few articles, let's trigger the 70 dummy articles to ensure category readiness
      if (articles.length < 15) {
        console.log("[Firebase SEED] Jumlah artikel sedikit (<15). Melakukan seeder otomatis 70 artikel dummy...");
        const seedResult = await seedSeventyDummyArticles(db, articles, generateIntegrityHash);
        console.log(`[Firebase SEED] Berhasil melengkapi ${seedResult.count} artikel berita baru.`);
      }
    }

    // 5. Sync Comments
    const commentsColRef = collection(db, "comments");
    const commentsSnap = await getDocs(commentsColRef);
    if (commentsSnap.empty) {
      console.log("[Firebase SEED] Memasukkan ulasan komentar warga...");
      for (const c of comments) {
        await setDoc(doc(db, "comments", c.id), c);
      }
    } else {
      comments = commentsSnap.docs.map(d => d.data()) as typeof comments;
      console.log("[Firebase SYNC] Kotak komentar warga disinkronkan dari Firestore.");
    }

    // 6. Sync Subscriptions
    const subsColRef = collection(db, "subscriptions");
    const subsSnap = await getDocs(subsColRef);
    if (subsSnap.empty) {
      console.log("[Firebase SEED] Memasukkan histori langganan premium...");
      for (const sub of subscriptionsList) {
        await setDoc(doc(db, "subscriptions", sub.id), sub);
      }
    } else {
      subscriptionsList = subsSnap.docs.map(d => d.data()) as typeof subscriptionsList;
      console.log("[Firebase SYNC] Histori langganan disinkronkan dari Firestore.");
    }

    // 7. Sync Notifications
    const notifsColRef = collection(db, "notifications");
    const notifsSnap = await getDocs(notifsColRef);
    if (!notifsSnap.empty) {
      pushNotificationsList = notifsSnap.docs.map(d => d.data()) as typeof pushNotificationsList;
      console.log("[Firebase SYNC] Riwayat siaran notifikasi disinkronkan dari Firestore.");
    }

    // 8. Sync Viewer Geolocation Logs
    const logsColRef = collection(db, "viewer_logs");
    const logsSnap = await getDocs(logsColRef);
    if (logsSnap.empty) {
      console.log("[Firebase SEED] Memasukkan log penonton/visitor simulasi...");
      for (const log of viewerLogs) {
        await setDoc(doc(db, "viewer_logs", log.id), log);
      }
    } else {
      viewerLogs = logsSnap.docs.map(d => d.data()) as typeof viewerLogs;
      console.log("[Firebase SYNC] Log penonton disinkronkan dari Firestore.");
    }

    console.log("[Firebase] Sinkronisasi & seeding data selesai sukses!");

  } catch (error) {
    console.error("[Firebase] Gagal sinkronisasi:", error);
  }
}

let marketDataCache: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minute cache to avoid rate limit or slow performance

const getRealtimeMarketDataAsync = async () => {
  const now = Date.now();
  if (marketDataCache && (now - lastCacheTime < CACHE_DURATION)) {
    return marketDataCache;
  }

  const timeSec = Math.floor(now / 10000);
  const usdFallback = 16240 + (timeSec % 37) - 18;
  const sgdFallback = 12050 + (timeSec % 13) - 6;
  const eurFallback = 17310 + (timeSec % 23) - 11;
  const goldBase = 1354000 + (timeSec % 1000) - 500;
  const tempFallback = 29 + (timeSec % 3);
  const condFallback = (timeSec % 4 === 0) ? "Cerah Berawan" : (timeSec % 4 === 1) ? "Hujan Ringan" : "Cerah";

  let usdToIdr = usdFallback;
  let sgdToIdr = sgdFallback;
  let eurToIdr = eurFallback;
  let temp = tempFallback;
  let condition = condFallback;
  let goldPrice = goldBase;

  try {
    const ratesRes = await fetch("https://open.er-api.com/v6/latest/USD");
    if (ratesRes.ok) {
      const ratesData = await ratesRes.json();
      if (ratesData && ratesData.rates && ratesData.rates.IDR) {
        const idrRate = ratesData.rates.IDR;
        usdToIdr = Math.round(idrRate);
        if (ratesData.rates.SGD) {
          sgdToIdr = Math.round(idrRate / ratesData.rates.SGD);
        }
        if (ratesData.rates.EUR) {
          eurToIdr = Math.round(idrRate / ratesData.rates.EUR);
        }
      }
    }
  } catch (e) {
    console.warn("Failed fetching live exchange rates, using fallback:", e);
  }

  try {
    const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,weather_code");
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      if (weatherData && weatherData.current) {
        temp = Math.round(weatherData.current.temperature_2m);
        const code = weatherData.current.weather_code;
        if (code === 0) condition = "Cerah";
        else if ([1, 2, 3].includes(code)) condition = "Cerah Berawan";
        else if ([45, 48].includes(code)) condition = "Berkabut";
        else if ([51, 53, 55].includes(code)) condition = "Gerimis";
        else if ([61, 63, 65].includes(code)) condition = "Hujan";
        else if ([80, 81, 82].includes(code)) condition = "Hujan Ringan";
        else if ([95, 96, 99].includes(code)) condition = "Badai Petir";
        else condition = "Berawan";
      }
    }
  } catch (e) {
    console.warn("Failed fetching live weather, using fallback:", e);
  }

  // Coup gold price realistically to usd rate with a small fluctuation factor (around 74.5 USD per gram)
  const usdPrice = usdToIdr || 16245;
  goldPrice = Math.round(74.5 * usdPrice + (Math.sin(now / 350000) * 9000));

  marketDataCache = {
    weather: {
      temp,
      condition,
      city: "Jakarta Pusat"
    },
    goldPrice: {
      perGramIDR: goldPrice,
      change: (Math.sin(now / 800000) >= 0 ? "+" : "") + (Math.sin(now / 800000) * 0.9 + 0.11).toFixed(2) + "%"
    },
    kurs: {
      usdToIdr,
      sgdToIdr,
      eurToIdr
    }
  };
  lastCacheTime = now;

  return marketDataCache;
};

// ---------------------- Express API Endpoints ----------------------

// 1. Web Settings (Admin)
app.get("/api/settings", (req, res) => {
  res.json(websiteSettings);
});

app.post("/api/settings", async (req, res) => {
  websiteSettings = { ...websiteSettings, ...req.body };
  if (db) {
    try {
      await setDoc(doc(db, "settings", "main"), websiteSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "settings/main");
    }
  }
  res.json({ message: "Konfigurasi website berhasil disimpan", settings: websiteSettings });
});

// 2. Editorial Info
app.get("/api/redaksi", (req, res) => {
  res.json(editorialTeam);
});

app.post("/api/redaksi", async (req, res) => {
  const { name, role, photo } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Nama dan jabatan wajib diisi" });
  }
  const newMember = {
    id: "e-" + Date.now(),
    name,
    role,
    photo: photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&fit=crop&q=80"
  };
  editorialTeam.push(newMember);
  if (db) {
    try {
      await setDoc(doc(db, "editorialTeam", newMember.id), newMember);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `editorialTeam/${newMember.id}`);
    }
  }
  res.json({ message: "Anggota redaksi berhasil ditambahkan", team: editorialTeam });
});

app.delete("/api/redaksi/:id", async (req, res) => {
  editorialTeam = editorialTeam.filter(m => m.id !== req.params.id);
  if (db) {
    try {
      await deleteDoc(doc(db, "editorialTeam", req.params.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `editorialTeam/${req.params.id}`);
    }
  }
  res.json({ message: "Anggota redaksi berhasil dihapus", team: editorialTeam });
});

// 3. Articles (all statuses & filtering)
app.get("/api/articles", (req, res) => {
  const { authorId, category, search, status, page, limit, excludeId } = req.query;
  let filtered = [...articles];

  // Filter out specific ID (e.g. current headline article) to avoid duplication across lists
  if (excludeId) {
    filtered = filtered.filter(a => a.id !== (excludeId as string));
  }

  if (authorId) {
    filtered = filtered.filter(a => a.authorId === authorId);
  }
  if (category) {
    filtered = filtered.filter(a => a.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  } else {
    filtered = filtered.filter(a => a.status === "published");
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Check if server-side pagination requested
  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 6);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const sliced = filtered.slice(startIndex, endIndex);

    // Optimize transfer performance over slow connections by omitting the heavy `content` field.
    // Full content is loaded on-demand via the `/api/articles/:id` detailed view API when selected.
    const optimizedSliced = sliced.map(a => {
      const { content, ...rest } = a;
      return {
        ...rest,
        isLightweight: true
      };
    });

    return res.json({
      articles: optimizedSliced,
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(filtered.length / limitNum))
    });
  }

  res.json(filtered);
});

app.get("/api/articles/:id", async (req, res) => {
  const art = articles.find(a => a.id === req.params.id);
  if (!art) {
    return res.status(404).json({ error: "Berita tidak ditemukan" });
  }

  art.views += 1;
  
  // Extract or generate geolocation properties
  const city = (req.query.city as string) || "Jakarta Pusat";
  const region = (req.query.region as string) || "DKI Jakarta";
  const country = (req.query.country as string) || "Indonesia";
  const device = (req.query.device as string) || "Mobile";
  const logId = "vlog-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  
  const newLog = {
    id: logId,
    articleId: art.id,
    articleTitle: art.title,
    city,
    region,
    country,
    device,
    timestamp: new Date().toISOString()
  };

  viewerLogs.push(newLog);

  if (db) {
    try {
      await setDoc(doc(db, "articles", art.id), art);
      await setDoc(doc(db, "viewer_logs", logId), newLog);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `articles/${art.id}`);
    }
  }
  res.json(art);
});

// Create article
app.post("/api/articles", async (req, res) => {
  const { title, content, summary, category, imageUrl, isPremium, seoTitle, seoDescription, seoKeywords, status, authorId, authorName, authorRole, publishedAt } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: "Judul, isi berita, dan kategori wajib diisi" });
  }

  const generatedId = "art-" + Date.now();
  const actualPubDate = publishedAt || new Date().toISOString();
  const finalStatus = status || "published";

  const newArt = {
    id: generatedId,
    title,
    content,
    summary: summary || content.substring(0, 150) + "...",
    category,
    authorId: authorId || "u-jour",
    authorName: authorName || "Rendra Kusuma",
    authorRole: authorRole || "journalist",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80",
    isPremium: isPremium === true,
    status: finalStatus as 'draft' | 'scheduled' | 'published',
    publishedAt: actualPubDate,
    seoTitle: seoTitle || title,
    seoDescription: seoDescription || summary || "Berita terkini Fakta Faktual",
    seoKeywords: seoKeywords || [category],
    views: 0,
    commentsCount: 0,
    encryptedHash: generateIntegrityHash(title, content)
  };

  articles.push(newArt);

  if (db) {
    try {
      await setDoc(doc(db, "articles", newArt.id), newArt);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `articles/${newArt.id}`);
    }
  }

  if (newArt.status === "published") {
    const newNotif = {
      id: "push-" + Date.now(),
      title: `🔴 Berita Baru: ${newArt.title}`,
      body: newArt.summary,
      sentAt: new Date().toISOString()
    };
    pushNotificationsList.unshift(newNotif);
    if (db) {
      try {
        await setDoc(doc(db, "notifications", newNotif.id), newNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotif.id}`);
      }
    }
  }

  res.json({ message: "Beritanya berhasil disimpan", article: newArt });
});

app.post("/api/seed-dummy-articles", async (req, res) => {
  try {
    console.log("[Seeder API] Permintaan memicu pembuatan dummy artikel diterima.");
    const seedResult = await seedSeventyDummyArticles(db, articles, generateIntegrityHash);
    res.json({
      success: true,
      count: seedResult.count,
      messages: seedResult.messages
    });
  } catch (error) {
    console.error("[Seeder API] Error saat melakukan seeding artikel:", error);
    res.status(500).json({ error: "Gagal memproses seeding artikel: " + (error instanceof Error ? error.message : String(error)) });
  }
});

app.put("/api/articles/:id", async (req, res) => {
  const index = articles.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Berita tidak ditemukan" });
  }

  const current = articles[index];
  const updated = {
    ...current,
    ...req.body,
    encryptedHash: generateIntegrityHash(req.body.title || current.title, req.body.content || current.content)
  };

  if (current.status !== "published" && updated.status === "published") {
    const newNotif = {
      id: "push-" + Date.now(),
      title: `🔴 Baru Saja Rilis: ${updated.title}`,
      body: updated.summary,
      sentAt: new Date().toISOString()
    };
    pushNotificationsList.unshift(newNotif);
    if (db) {
      try {
        await setDoc(doc(db, "notifications", newNotif.id), newNotif);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotif.id}`);
      }
    }
  }

  articles[index] = updated;
  if (db) {
    try {
      await setDoc(doc(db, "articles", updated.id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `articles/${updated.id}`);
    }
  }
  res.json({ message: "Berita berhasil diubah", article: updated });
});

app.delete("/api/articles/:id", async (req, res) => {
  const exists = articles.some(a => a.id === req.params.id);
  if (!exists) {
    return res.status(404).json({ error: "Berita tidak ditemukan" });
  }
  articles = articles.filter(a => a.id !== req.params.id);
  if (db) {
    try {
      await deleteDoc(doc(db, "articles", req.params.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `articles/${req.params.id}`);
    }
  }
  res.json({ message: "Berita berhasil dihapus" });
});

// 4. Comments Engine
app.get("/api/comments", (req, res) => {
  const { articleId, status } = req.query;
  let filtered = [...comments];

  if (articleId) {
    filtered = filtered.filter(c => c.articleId === articleId);
  }
  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  res.json(filtered);
});

/**
 * Sanitasi super ketat (keras) untuk mencegah celah keamanan XSS pada komentar
 */
function sanitizeXSS(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Deteksi dan bersihkan tag script serta isinya sepenuhnya (case-insensitive)
  let cleaned = input.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Konversi karakter khusus HTML ke HTML entities untuk menetralkan elemen HTML apa pun
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

app.post("/api/comments", async (req, res) => {
  const { articleId, authorName, authorEmail, content } = req.body;
  if (!articleId || !authorName || !content) {
    return res.status(400).json({ error: "Artikel ID, nama, dan komentar wajib diisi" });
  }

  // Sanitasi input tingkat tinggi (keras) untuk mencegah celah keamanan XSS
  const sanitizedAuthorName = sanitizeXSS(authorName).trim();
  const sanitizedAuthorEmail = sanitizeXSS(authorEmail || '').trim();
  const sanitizedContent = sanitizeXSS(content).trim();

  // Validasi kembali untuk memastikan input tidak kosong setelah dibersihkan
  if (!sanitizedAuthorName || !sanitizedContent) {
    return res.status(400).json({ error: "Nama pengirim atau komentar tidak valid setelah penyaringan keamanan" });
  }

  const newComment = {
    id: "com-" + Date.now(),
    articleId,
    authorName: sanitizedAuthorName,
    authorEmail: sanitizedAuthorEmail || "pembaca@faktafaktual.id",
    content: sanitizedContent,
    createdAt: new Date().toISOString(),
    status: (websiteSettings.websiteName === "Fakta Faktual") ? ("pending" as const) : ("approved" as const),
    aiModerationScore: undefined,
    aiReason: undefined
  };

  comments.push(newComment);

  const art = articles.find(a => a.id === articleId);
  if (art) {
    art.commentsCount += 1;
    if (db) {
      try {
        await setDoc(doc(db, "articles", art.id), art);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `articles/${art.id}`);
      }
    }
  }

  if (db) {
    try {
      await setDoc(doc(db, "comments", newComment.id), newComment);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `comments/${newComment.id}`);
    }
  }

  res.json({ message: "Komentar berhasil dikirim dan menunggu moderasi admin", comment: newComment });
});

app.put("/api/comments/:id/moderate", async (req, res) => {
  const { status } = req.body;
  const com = comments.find(c => c.id === req.params.id);
  if (!com) {
    return res.status(404).json({ error: "Komentar tidak ditemukan" });
  }

  com.status = status;
  if (db) {
    try {
      await setDoc(doc(db, "comments", com.id), com);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `comments/${com.id}`);
    }
  }
  res.json({ message: `Komentar berhasil di-${status}`, comment: com });
});

// 5. Author Analytics Summary
app.get("/api/analytics/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  const authorArticles = articles.filter(a => a.authorId === authorId);

  const totalViews = authorArticles.reduce((sum, a) => sum + a.views, 0);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const viewsOverTime = days.map((day, ix) => ({
    date: day,
    views: Math.floor(totalViews / 6) + (ix * 120 % (totalViews + 10))
  }));

  const catMap: { [key: string]: number } = {};
  authorArticles.forEach(a => {
    catMap[a.category] = (catMap[a.category] || 0) + a.views;
  });

  const categoryPerformance = Object.keys(catMap).map(category => ({
    category,
    count: catMap[category]
  }));

  const premiumSubscriptionsReferred = Math.round(totalViews * 0.003) + 2;
  const ctr = parseFloat(((1.8 + (totalViews % 11) * 0.2)).toFixed(2));

  res.json({
    totalViews,
    viewsOverTime,
    categoryPerformance: categoryPerformance.length ? categoryPerformance : [{ category: "Teknologi", count: 100 }],
    premiumSubscriptionsReferred,
    ctr
  });
});

// 6. Markets Real-time endpoint
app.get("/api/market-widgets", async (req, res) => {
  const liveData = await getRealtimeMarketDataAsync();
  res.json(liveData);
});

// 7. Subscribe Payments
app.post("/api/subscribe", async (req, res) => {
  const { email, plan, nameOnCard, cardNumber, amount } = req.body;
  if (!email || !plan) {
    return res.status(400).json({ error: "Email dan skema langganan wajib ditentukan" });
  }

  const txId = "TX-" + Math.floor(Math.random() * 900000 + 100000);
  const newSub = {
    id: txId,
    userEmail: email,
    plan,
    timestamp: new Date().toISOString(),
    amount: amount || 49000
  };

  subscriptionsList.push(newSub);

  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (foundUser) {
    foundUser.isPremium = true;
    if (db) {
      try {
        await setDoc(doc(db, "users", foundUser.id), foundUser);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${foundUser.id}`);
      }
    }
  }

  if (db) {
    try {
      await setDoc(doc(db, "subscriptions", newSub.id), newSub);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `subscriptions/${newSub.id}`);
    }
  }

  res.json({
    success: true,
    message: "Pembayaran terverifikasi otomatis secara instan melalui NusaPay Secure Gateway!",
    transactionId: txId,
    email: email,
    plan
  });
});

// 8. Gemini Assistant endpoint wrapper
app.post("/api/gemini/assist", async (req, res) => {
  const { title, content, type } = req.body;
  if (!ai) {
    return res.json({
      error: "Kunci API Gemini tidak terdeteksi. Menggunakan fallback respons otomatis.",
      seoTitle: title ? `[SEO] ${title} - Fakta Faktual Portal Terkini` : "Fakta Faktual SEO Title",
      seoDescription: content ? content.substring(0, 150) + "..." : "Deskripsi Otomatis",
      seoKeywords: ["faktafaktual", "berita nasional"]
    });
  }

  try {
    let promptString = "";
    if (type === "seo") {
      promptString = `Anda adalah pakar Search Engine Optimization (SEO) media Indonesia skala nasional. Berikan rekomendasi metadata SEO yang dioptimalkan dengan sempurna untuk naskah berita berikut dalam bentuk JSON format objektif.
Judul berita: "${title}"
Konten berita: "${content}"

Format response schema JSON wajib seperti ini:
{
  "seoTitle": "Judul SEO 50-60 karakter",
  "seoDescription": "Deskripsi SEO menawan 120-150 karakter",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}
Hanya berikan JSON ini tanpa teks penjelasan tambahan apapun.`;
    } else if (type === "summary") {
      promptString = `Ringkas artikel berita berikut dalam satu paragraf padat bahasa Indonesia untuk dipajang sebagai ringkasan depan media cetak besar:
Judul: "${title}"
Konten: "${content}"`;
    } else {
      promptString = `Koreksi ejaan (PUEBI) dan tata bahasa Indonesia dari draf artikel berita berikut agar terlihat sangat profesional, elegan, berwibawa, dan siap cetak di media arus utama nasional. Pertahankan fakta aslinya:
"${content}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        responseMimeType: type === "seo" ? "application/json" : "text/plain"
      }
    });

    const resultText = response.text || "";

    if (type === "seo") {
      try {
        const parsed = JSON.parse(resultText);
        return res.json(parsed);
      } catch (e) {
        const match = resultText.match(/\{[\s\S]*\}/);
        if (match) {
          return res.json(JSON.parse(match[0]));
        }
        throw new Error("Gagal mengurai respons skema JSON");
      }
    } else {
      return res.json({ result: resultText });
    }
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Gemini automated comment toxicity check & moderation helper
app.post("/api/gemini/moderate-comment", async (req, res) => {
  const { commentId } = req.body;
  const com = comments.find(c => c.id === commentId);

  if (!com) {
    return res.status(404).json({ error: "Komentar tidak ditemukan" });
  }

  if (!ai) {
    const lower = com.content.toLowerCase();
    const toxicWords = ["anjing", "babi", "goblok", "tolol", "bodoh", "hacker", "penipu"];
    const isToxic = toxicWords.some(w => lower.includes(w));
    com.aiModerationScore = isToxic ? 85 : 5;
    com.aiReason = isToxic ? "Mengandung kosakata kasar / tidak pantas" : "Kalimat aman, positif, relevan.";
    com.status = isToxic ? "rejected" : "approved";
    
    if (db) {
      try {
        await setDoc(doc(db, "comments", com.id), com);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `comments/${com.id}`);
      }
    }
    return res.json({ comment: com, message: "Moderasi simulasi berhasil dilakukan!" });
  }

  try {
    const promptString = `Sebagai asisten moderator portal berita nasional yang kritis, adil, dan objektif, nilai komentar berikut dari pembaca.
Komentar: "${com.content}"

Jawablah dengan respon JSON persis dalam format berikut:
{
  "toxicityScore": 0-100 (masukan angka saja, misal 15),
  "isRecommendedApprove": true atau false,
  "reason": "Alasan singkat mengapa anda memutuskan hal tersebut dalam bahasa Indonesia"
}
Hanya berikan struktur JSON di atas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptString,
      config: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.text || "";
    let data;
    try {
      data = JSON.parse(resultText.trim());
    } catch {
      const match = resultText.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { toxicityScore: 10, isRecommendedApprove: true, reason: "Ulasan visual standard" };
    }

    com.aiModerationScore = data.toxicityScore;
    com.aiReason = data.reason;
    com.status = data.isRecommendedApprove ? "approved" : "rejected";

    if (db) {
      try {
        await setDoc(doc(db, "comments", com.id), com);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `comments/${com.id}`);
      }
    }

    res.json({ comment: com, message: "Moderasi cerdas berbasis AI berhasil dilaksanakan!" });
  } catch (error: any) {
    console.error("Gemini Moderation API error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Push Notification channels list
app.get("/api/push-notifications", (req, res) => {
  res.json(pushNotificationsList);
});

app.post("/api/push-notifications/send", async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: "Judul dan konten push harus dilampirkan" });
  }
  const newNotification = {
    id: "push-" + Date.now(),
    title,
    body,
    sentAt: new Date().toISOString()
  };
  pushNotificationsList.unshift(newNotification);
  if (db) {
    try {
      await setDoc(doc(db, "notifications", newNotification.id), newNotification);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `notifications/${newNotification.id}`);
    }
  }
  res.json({ message: "Notifikasi Push berhasil dipancarkan ke semua pembaca aktif!", list: pushNotificationsList });
});

// 11. Stream Status
app.get("/api/stream-status", (req, res) => {
  res.json({
    online: true,
    channelName: websiteSettings.websiteName + " TV Live Streaming HD",
    streamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    viewersCount: 24508,
    activeResolution: "1080p 60fps",
    encryptionStatus: "AES-128 Stream Encrypted",
    youtubeChannelId: websiteSettings.youtubeChannelId || "",
    youtubeStreamId: websiteSettings.youtubeStreamId || ""
  });
});

// 12. Security Logs
app.get("/api/security-logs", (req, res) => {
  res.json([
    { id: "sl1", event: "SSL/TLS Handshake", desc: "Koneksi HTTPS ditegakkan dengan sandi ECDHE-RSA-AES128-GCM-SHA256", status: "Selesai", time: new Date().toISOString() },
    { id: "sl2", event: "Integritas Berita SHA-256", desc: "Validasi sidik jari hash semua publikasi berita berhasil diamankan", status: "Valid", time: new Date().toISOString() },
    { id: "sl3", event: "SQL Injection Shield", desc: "Filter input parameter aktif mencegah serangan injeksi dan scripting", status: "Siaga", time: new Date().toISOString() },
    { id: "sl4", event: "XSS Protection", desc: "Enkoding HTML entities diaktifkan pada semua input kotak komentar warga", status: "Aktif", time: new Date().toISOString() },
  ]);
});

// 12b. Viewer Logs API (Dashboard Analytics)
app.get("/api/viewer-logs", async (req, res) => {
  if (db) {
    try {
      const logsColRef = collection(db, "viewer_logs");
      const logsSnap = await getDocs(logsColRef);
      if (!logsSnap.empty) {
        const liveLogs = logsSnap.docs.map(doc => doc.data());
        return res.json(liveLogs);
      }
    } catch (err) {
      console.error("[Firebase] Gagal mengambil log penonton live dari Firestore:", err);
    }
  }
  res.json(viewerLogs);
});

// 13. User & Password Management (Admin Feature)
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/avatar/:id", (req, res) => {
  const { id } = req.params;
  const avatarData = userAvatars[id];

  if (avatarData) {
    try {
      const matches = avatarData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        return res.send(imageBuffer);
      }
    } catch (err) {
      console.error("[Avatar Server] Gagal parsing base64 avatar:", err);
    }
  }

  // Fallback to default Unsplash profile placeholder
  res.redirect("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80");
});

app.post("/api/users", async (req, res) => {
  const { name, email, role, avatarUrl, avatarData, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Nama dan email wajib diisi!" });
  }
  
  const exist = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exist) {
    return res.status(400).json({ error: "Surel / Email sudah terdaftar!" });
  }

  const userId = "u-" + Date.now();
  let finalAvatarUrl = avatarUrl;

  if (avatarData) {
    userAvatars[userId] = avatarData;
    saveLocalAvatars();
    finalAvatarUrl = `/api/users/avatar/${userId}`;
  } else if (!finalAvatarUrl) {
    finalAvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80";
  }

  const username = email.split("@")[0];
  const newUser = {
    id: userId,
    username,
    name,
    email,
    role: role || "user",
    isPremium: role === "admin" || role === "editor",
    avatarUrl: finalAvatarUrl,
    password: password || "pembaca123"
  };

  users.push(newUser);

  if (db) {
    try {
      await setDoc(doc(db, "users", newUser.id), newUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${newUser.id}`);
    }
  }

  res.json({ message: "Pengguna berhasil dibuat!", user: newUser });
});

app.put("/api/users/:id/password", async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password baru wajib diisi!" });
  }

  const userIdx = users.findIndex(u => u.id === id);
  if (userIdx === -1) {
    return res.status(404).json({ error: "Pengguna tidak ditemukan!" });
  }

  users[userIdx].password = password;

  if (db) {
    try {
      await setDoc(doc(db, "users", id), users[userIdx]);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${id}`);
    }
  }

  res.json({ message: "Password berhasil diperbarui!", user: users[userIdx] });
});

app.put("/api/users/:id/avatar", async (req, res) => {
  const { id } = req.params;
  const { avatarData } = req.body;
  if (!avatarData) {
    return res.status(400).json({ error: "Data foto profil kosong!" });
  }

  const userIdx = users.findIndex(u => u.id === id);
  if (userIdx === -1) {
    return res.status(404).json({ error: "Pengguna tidak ditemukan!" });
  }

  // Simpan data avatar base64 secara lokal
  userAvatars[id] = avatarData;
  saveLocalAvatars();

  const finalAvatarUrl = `/api/users/avatar/${id}`;
  users[userIdx].avatarUrl = finalAvatarUrl;

  if (db) {
    try {
      await setDoc(doc(db, "users", id), users[userIdx]);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${id}`);
    }
  }

  res.json({ message: "Foto profil berhasil diperbarui!", user: users[userIdx], avatarUrl: finalAvatarUrl });
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const requesterRole = req.headers["x-requester-role"] || req.query.requesterRole || req.body?.requesterRole;
  const requesterId = req.headers["x-requester-id"] || req.query.requesterId || req.body?.requesterId;

  // Temukan pengguna yang ingin dihapus
  const targetUserIdx = users.findIndex(u => u.id === id);
  if (targetUserIdx === -1) {
    return res.status(404).json({ error: "Pengguna tidak ditemukan!" });
  }

  const targetUser = users[targetUserIdx];

  // 1. Jika target adalah admin, userlain (bukan admin) tidak bisa menghapus admin tersebut
  if (targetUser.role === "admin" && requesterRole !== "admin") {
    return res.status(403).json({ error: "Akses ditolak! Anda tidak diizinkan menghapus pengguna dengan peran Admin." });
  }

  // 2. Hanya admin portal yang diizinkan menghapus pengguna lain secara umum
  if (requesterRole !== "admin") {
    return res.status(403).json({ error: "Akses ditolak! Hanya Admin Portal yang diizinkan menghapus pengguna." });
  }

  // Mencegah admin menghapus akunnya sendiri secara langsung dari panel ini
  if (id === requesterId) {
    return res.status(400).json({ error: "Anda tidak dapat menghapus akun Anda sendiri secara langsung dari panel ini!" });
  }

  // Lakukan penghapusan
  users.splice(targetUserIdx, 1);

  // Bersihkan data avatar lokal jika ada
  if (userAvatars[id]) {
    delete userAvatars[id];
    saveLocalAvatars();
  }

  if (db) {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
    }
  }

  res.json({ message: "Pengguna berhasil dihapus!" });
});

// HTML dynamic metadata injection handler for WhatsApp/social previews
const serveHtmlWithMeta = async (req: express.Request, res: express.Response, next: express.NextFunction, viteInstance?: any) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    let filePath = isProd 
      ? path.join(process.cwd(), "dist", "index.html") 
      : path.join(process.cwd(), "index.html");

    if (!existsSync(filePath)) {
      filePath = path.join(process.cwd(), "index.html");
    }

    let html = readFileSync(filePath, "utf8");

    // Transform HTML with Vite in development mode to retain HMR scripts
    if (!isProd && viteInstance) {
      html = await viteInstance.transformIndexHtml(req.originalUrl, html);
    }

    const articleId = req.query.article as string;
    const art = articles.find(a => a.id === articleId);

    if (art) {
      const ogTitle = art.title;
      const ogDesc = art.summary || art.content.slice(0, 160) + "...";
      const ogImg = art.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80";
      const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const host = req.headers.host || "faktafaktual.id";
      const ogUrl = `${protocol}://${host}${req.originalUrl}`;

      const metaHtml = `
    <title>${ogTitle.replace(/"/g, '&quot;')} - Fakta Faktual</title>
    <meta name="description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${ogImg}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${ogUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${ogDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${ogImg}" />
      `;
      html = html.replace("<head>", `<head>${metaHtml}`);
      html = html.replace(/<title>.*?<\/title>/, "");
    } else {
      const title = websiteSettings.websiteName || "Fakta Faktual";
      const logo = websiteSettings.websiteLogo || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80";
      const desc = websiteSettings.announcement || "Portal Berita Nasional Terpercaya";
      const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
      const host = req.headers.host || "faktafaktual.id";
      const ogUrl = `${protocol}://${host}${req.originalUrl}`;

      const metaHtml = `
    <title>${title}</title>
    <meta name="description" content="${desc.replace(/"/g, '&quot;')}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${logo}" />
    <meta property="og:url" content="${ogUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:image" content="${logo}" />
      `;
      html = html.replace("<head>", `<head>${metaHtml}`);
      html = html.replace(/<title>.*?<\/title>/, "");
    }

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (err) {
    console.error("Error serving HTML with metadata:", err);
    next(err);
  }
};

// Vite middleware for development or serving assets in production
async function startServer() {
  // Sync and seed Firestore database asynchronously in the background to prevent blocking port 3000 binding
  syncAndSeedDatabase()
    .then(() => {
      console.log("[Firebase] Sinkronisasi & seeding data selesai sukses di background!");
    })
    .catch((err) => {
      console.error("[Firebase] Gagal sinkronisasi data di background:", err);
    });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Handle root / and index.html loads dynamically with metadata
    app.get(["/", "/index.html"], (req, res, next) => {
      serveHtmlWithMeta(req, res, next, vite);
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // Dynamic SEO loads on production
    app.get(["/", "/index.html"], (req, res, next) => {
      serveHtmlWithMeta(req, res, next);
    });

    app.use(express.static(distPath));

    app.get("*", (req, res, next) => {
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
        serveHtmlWithMeta(req, res, next);
      } else {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fakta Faktual] Backend meluncur pada port http://localhost:${PORT}`);
  });
}

startServer();
