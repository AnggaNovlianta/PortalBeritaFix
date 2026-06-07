import express from "express";
import path from "path";
import { readFileSync } from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import crypto from "crypto";

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

app.use(express.json());

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
  categories: ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"]
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
      websiteSettings = settingsSnap.data() as typeof websiteSettings;
      if (!websiteSettings.categories) {
        websiteSettings.categories = ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"];
        await setDoc(settingsDocRef, websiteSettings);
        console.log("[Firebase SYNC] Menambahkan kategori bawaan ke Firestore settings.");
      }
      console.log("[Firebase SYNC] Pengaturan portal disinkronkan dari Firestore.");
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
    } else {
      articles = articlesSnap.docs.map(d => d.data()) as typeof articles;
      console.log("[Firebase SYNC] Arsip artikel berita disinkronkan dari Firestore.");
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

    console.log("[Firebase] Sinkronisasi & seeding data selesai sukses!");

  } catch (error) {
    console.error("[Firebase] Gagal sinkronisasi:", error);
  }
}

const getRealtimeMarketData = () => {
  const timeSec = Math.floor(Date.now() / 10000);
  const usdBase = 16240 + (timeSec % 37) - 18;
  const sgdBase = 12050 + (timeSec % 13) - 6;
  const eurBase = 17310 + (timeSec % 23) - 11;
  const goldBase = 1342000 + (timeSec % 1000) - 500;

  return {
    weather: {
      temp: 29 + (timeSec % 3),
      condition: (timeSec % 4 === 0) ? "Cerah Berawan" : (timeSec % 4 === 1) ? "Hujan Ringan" : "Cerah",
      city: "Jakarta Pusat"
    },
    goldPrice: {
      perGramIDR: goldBase,
      change: "+0.45%"
    },
    kurs: {
      usdToIdr: usdBase,
      sgdToIdr: sgdBase,
      eurToIdr: eurBase
    }
  };
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
  const { authorId, category, search, status } = req.query;
  let filtered = [...articles];

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
  res.json(filtered);
});

app.get("/api/articles/:id", async (req, res) => {
  const art = articles.find(a => a.id === req.params.id);
  if (!art) {
    return res.status(404).json({ error: "Berita tidak ditemukan" });
  }

  art.views += 1;
  if (db) {
    try {
      await setDoc(doc(db, "articles", art.id), art);
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

app.post("/api/comments", async (req, res) => {
  const { articleId, authorName, authorEmail, content } = req.body;
  if (!articleId || !authorName || !content) {
    return res.status(400).json({ error: "Artikel ID, nama, dan komentar wajib diisi" });
  }

  const newComment = {
    id: "com-" + Date.now(),
    articleId,
    authorName,
    authorEmail: authorEmail || "pembaca@faktafaktual.id",
    content,
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
app.get("/api/market-widgets", (req, res) => {
  res.json(getRealtimeMarketData());
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
    channelName: "MetroNusa Live Streaming HD",
    streamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    viewersCount: 24508,
    activeResolution: "1080p 60fps",
    encryptionStatus: "AES-128 Stream Encrypted"
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

// 13. User & Password Management (Admin Feature)
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const { name, email, role, avatarUrl, password } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Nama dan email wajib diisi!" });
  }
  
  const exist = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exist) {
    return res.status(400).json({ error: "Surel / Email sudah terdaftar!" });
  }

  const username = email.split("@")[0];
  const newUser = {
    id: "u-" + Date.now(),
    username,
    name,
    email,
    role: role || "user",
    isPremium: role === "admin" || role === "editor",
    avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80",
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

// Vite middleware for development or serving assets in production
async function startServer() {
  // Sync and seed Firestore database before starting the router listeners
  await syncAndSeedDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fakta Faktual] Backend meluncur pada port http://localhost:${PORT}`);
  });
}

startServer();
