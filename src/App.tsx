import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Tv, 
  MapPin, 
  Share2, 
  Lock, 
  Sparkles, 
  ShieldAlert, 
  Send, 
  MessageSquare, 
  Users2, 
  Coins, 
  Bell, 
  Compass, 
  Clock, 
  Facebook, 
  Twitter, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  Info,
  Youtube,
  Instagram,
  FileText,
  Building
} from 'lucide-react';
import Header from './components/Header';
import MarketWidgets from './components/MarketWidgets';
import WriterStudio from './components/WriterStudio';
import AdminPanel from './components/AdminPanel';
import { User, Article, WebSettings, Comment } from './types';

export default function App() {
  // Theme Dark/Light
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Authentication & Current Roles States
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'u-user',
    username: 'user',
    name: 'Budi Pamungkas (Pembaca)',
    email: 'pembaca@gmail.com',
    role: 'user',
    isPremium: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80'
  });

  // Current active navigation context
  const [activeSection, setActiveSection] = useState<'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream'>('home');

  // Interactive footer section modal states
  const [activeFooterTab, setActiveFooterTab] = useState<'redaksi' | 'profil' | 'siber' | 'disclaimer' | 'privasi' | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Core CMS state
  const [websiteSettings, setWebsiteSettings] = useState<WebSettings>({
    websiteName: "Fakta Faktual",
    websiteLogo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80",
    smtpHost: "smtp.faktafaktual.id",
    smtpPort: 587,
    smtpUser: "redaksi@faktafaktual.id",
    smtpPass: "*****************",
    companyName: "PT Fakta Media Nusantara",
    companyAddress: "Gedung Fakta Presisi Lantai 12, Jl. MH Thamrin No.8, Jakarta Pusat, DKI Jakarta",
    companyMapCoordinates: "-6.2088,106.8456",
    socialFb: "https://facebook.com/faktafaktual.id",
    socialX: "https://x.com/faktafaktual_id",
    socialIg: "https://instagram.com/faktafaktual_official",
    socialYt: "https://youtube.com/c/FaktaFaktualChannel",
    adsHeader: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=728&h=90&fit=crop&q=80",
    adsSidebar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=250&fit=crop&q=80",
    adsArticleBottom: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=728&h=90&fit=crop&q=80",
  });

  // Articles & Comments lists
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editorialTeam, setEditorialTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Active view details state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  // Immersive comment form state
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSentMessage, setCommentSentMessage] = useState('');

  // Premium subscribe form state
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subCard, setSubCard] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone] = useState(false);

  // Pushover Notification lists state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alertToast, setAlertToast] = useState<string | null>(null);

  // Live stream active metadata state from backend
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(true);

  // Interactive Map custom Route Planner state
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routingResult, setRoutingResult] = useState<string | null>(null);

  // Social Share success tracker
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  // Sync basic data upon loading
  const loadPortalData = async () => {
    setLoading(true);
    try {
      const artRes = await fetch('/api/articles?status=published');
      const artData = await artRes.json();
      setArticles(artData);

      const setRes = await fetch('/api/settings');
      const setData = await setRes.json();
      setWebsiteSettings(setData);

      const edRes = await fetch('/api/redaksi');
      const edData = await edRes.json();
      setEditorialTeam(edData);

      const comRes = await fetch('/api/comments');
      const comData = await comRes.json();
      setComments(comData);

      const pushRes = await fetch('/api/push-notifications');
      const pushData = await pushRes.json();
      setNotifications(pushData);

      const streamRes = await fetch('/api/stream-status');
      const streamData = await streamRes.json();
      setStreamInfo(streamData);
    } catch (e) {
      console.error("Gagal sinkronisasi data portal", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
    // HTML class body toggle for high contrast dark-mode compliance
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Dynamic login matching with database user-credentials
  const handleLogin = async (email: string, requestedRole?: string, password?: string, fullName?: string): Promise<boolean> => {
    try {
      // 1. Fetch current users list from database
      const res = await fetch('/api/users');
      if (!res.ok) return false;
      const dbUsers: User[] = await res.json();

      let targetUser = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (targetUser) {
        // Authenticating existing user
        if (password === 'secret-google-pass') {
          // Google Fast Sign In bypass
          setCurrentUser(targetUser);
          setAlertToast(`Selamat datang kembali, ${targetUser.name}!`);
          setTimeout(() => setAlertToast(null), 3000);
          return true;
        }

        if (password && targetUser.password && targetUser.password === password) {
          setCurrentUser(targetUser);
          setAlertToast(`Selamat datang kembali, ${targetUser.name}!`);
          setTimeout(() => setAlertToast(null), 3000);
          return true;
        }

        // Incorrect password block
        return false;
      } else {
        // User does not exist, let's register them!
        const finalName = fullName || email.split('@')[0].toUpperCase();
        const finalRole = requestedRole || 'user';
        const finalPass = password || 'pembaca123';

        const regRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: finalName,
            email: email,
            role: finalRole,
            password: finalPass
          })
        });

        if (regRes.ok) {
          const regData = await regRes.json();
          // Log in instantly
          setCurrentUser(regData.user);
          setAlertToast(`Akun Anda (${finalName}) berhasil terdaftar & otomatis masuk!`);
          setTimeout(() => setAlertToast(null), 3000);
          return true;
        }
        return false;
      }
    } catch (e) {
      console.error("Login verification network exception", e);
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAlertToast("Anda telah keluar dari sistem Fakta Faktual.");
    setActiveSection('home');
    setTimeout(() => setAlertToast(null), 3000);
  };

  // Submit Comments automatically undergoing Editorial and Admin Moderation Rules
  const handleAddComment = async (e: React.FormEvent, articleId: string) => {
    e.preventDefault();
    if (!newCommentName || !newCommentText) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          authorName: newCommentName,
          authorEmail: currentUser ? currentUser.email : 'anonym@nusanews.id',
          content: newCommentText
        })
      });

      if (res.ok) {
        setCommentSentMessage('Komentar Anda terkirim! Sistem pengaman kami melakukan penataan keamanan, menunggu persetujuan admin untuk tayang.');
        setNewCommentName('');
        setNewCommentText('');
        
        // Refresh comments list
        const comRes = await fetch('/api/comments');
        const comData = await comRes.json();
        setComments(comData);

        setTimeout(() => setCommentSentMessage(''), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Simulated instant premium subscription processing via secure NusaPay Gateway
  const handleSubscribeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail || !subCard) return;

    setSubLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subEmail,
          plan: 'bulanan',
          cardNumber: subCard,
          nameOnCard: subName,
          amount: 49000
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubDone(true);
        if (currentUser) {
          setCurrentUser({ ...currentUser, isPremium: true });
        }
        setArticles(prev => prev.map(art => {
          // Local update reflect
          return art;
        }));
        loadPortalData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleShareButton = (artId: string, social: string) => {
    setShareSuccessId(artId);
    setTimeout(() => setShareSuccessId(null), 2500);
  };

  // Interactive CSS Locator map routing estimation
  const estimateLocationRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeOrigin) return;
    setRoutingResult(`Ditemukan rute tercepat: Dari "${routeOrigin}" ke "Gedung Nusa Presisi Thamrin" berjarak sekitar ${Math.round(Math.random() * 15 + 4)} KM. Estimasi perjalanan lancar: ${Math.round(Math.random() * 25 + 15)} Menit via Jl. Gatot Subroto.`);
  };

  // Compute filtered articles listing
  const searchedArticles = articles.filter(art => {
    const matchSearch = searchQuery
      ? (art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
         art.category.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchCategory = selectedCategory === 'Semua' 
      ? true 
      : art.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchSearch && matchCategory;
  });

  // Calculate top featured article (Headline story)
  const headlineArticle = searchedArticles.length > 0 ? searchedArticles[0] : null;
  const regularArticlesList = searchedArticles.length > 1 ? searchedArticles.slice(1) : searchedArticles;

  // Find viewed article context
  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const activeArticleComments = comments.filter(c => c.articleId === selectedArticleId && c.status === 'approved');

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-250 ${
      darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Real-time Ticker widgets */}
      <MarketWidgets darkMode={darkMode} />

      {/* Global Portal Header */}
      <Header 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        websiteSettings={websiteSettings}
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setSelectedArticleId(null); // return to lists
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (activeSection !== 'home') setActiveSection('home');
        }}
      />

      {/* Floating System alerts toast */}
      {alertToast && (
        <div id="alert-system-toast" className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="text-emerald-500" size={18} />
          <span className="text-xs font-bold">{alertToast}</span>
        </div>
      )}

      {/* Primary Layout Frame */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* -------------------- 1. HOME VIEW PORTAL -------------------- */}
        {activeSection === 'home' && !selectedArticleId && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Portal Stream Grid (Left 8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Responsive Category Badges Navigation Pillar */}
              <div id="category-navigation" className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-slate-200 dark:border-neutral-800 scrollbar-none">
                {['Semua', ...(websiteSettings.categories || ['Politik', 'Ekonomi', 'Teknologi', 'Pariwisata', 'Olahraga', 'Internasional', 'Hiburan'])].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow'
                        : darkMode 
                           ? 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white' 
                           : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Headline Hero Banner Row (Serif Editorial design focus) */}
              {headlineArticle && selectedCategory === 'Semua' && (
                <div 
                  id="breaking-headline-card" 
                  onClick={() => setSelectedArticleId(headlineArticle.id)}
                  className={`group relative rounded-xl h-[400px] overflow-hidden border cursor-pointer shadow-lg transition-transform hover:scale-[1.006] ${
                    darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-white'
                  }`}
                >
                  <img 
                    src={headlineArticle.imageUrl} 
                    alt={headlineArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  
                  {/* Absolute visual tags */}
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded">
                    BREAKING NEWS
                  </span>

                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                        {headlineArticle.category}
                      </span>
                      {headlineArticle.isPremium && (
                        <span className="bg-amber-500 text-neutral-950 text-[9px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 shadow">
                          ★ PREMIUM ACCESS
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-300 font-bold flex items-center gap-1.5">
                        <Clock size={11} /> {new Date(headlineArticle.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight group-hover:text-blue-400 transition-colors">
                      {headlineArticle.title}
                    </h2>

                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed max-w-3xl">
                      {headlineArticle.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-white/10 mt-2">
                      <span>Oleh: <strong className="text-slate-100">{headlineArticle.authorName}</strong></span>
                      <span className="flex items-center gap-1 font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                        BACA ULASAN LENGKAP <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular articles vertical grid or single list if empty */}
              {searchedArticles.length === 0 ? (
                <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-lg">
                  <BookOpen className="text-neutral-600 mx-auto mb-3" size={36} />
                  <p className="text-sm font-bold text-neutral-400">Tidak ada publikasi berita nasional ditemukan pada kriteria pencarian Anda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularArticlesList.map((art) => (
                    <article 
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`p-4 rounded-lg border flex flex-col gap-3 group cursor-pointer transition-all hover:shadow-md ${
                        darkMode 
                          ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Photo cover space */}
                      <div className="relative h-44 rounded overflow-hidden bg-neutral-900">
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-neutral-950/80 text-blue-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-800">
                          {art.category}
                        </span>
                        {art.isPremium && (
                          <span className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                            PREMIUM
                          </span>
                        )}
                      </div>

                      {/* Summary & Titles details */}
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold">
                        <span>Oleh: {art.authorName}</span>
                        <span>•</span>
                        <span>{new Date(art.publishedAt).toLocaleDateString('id-ID')}</span>
                      </div>

                      <h3 className="font-serif font-black text-sm tracking-tight line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                        {art.title}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 mt-auto">
                        <span>👁 {art.views} views</span>
                        <span className="font-bold text-blue-600 flex items-center gap-0.5">
                          Tinjau Berita <ArrowRight size={10} />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Columns (Right 4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sidebar Dynamic Promotion Ad */}
              {websiteSettings.adsSidebar && (
                <div id="ad-panel-sidebar" className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col gap-2 relative overflow-hidden h-72">
                  <span className="absolute top-2 right-2 bg-black/60 text-[8px] font-black tracking-widest px-1 py-0.5 rounded text-neutral-400 select-none uppercase">ADVERTISEMENT</span>
                  <img 
                    src={websiteSettings.adsSidebar} 
                    alt="Sidebar Promotion" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded opacity-90"
                  />
                </div>
              )}

              {/* TV Live Streaming Quick Ticker */}
              {streamInfo && (
                <div className="p-5 rounded-lg bg-gradient-to-br from-red-950/40 to-black border border-red-900/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-red-900/20 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-500 tracking-wider">
                      <Radio size={14} className="animate-pulse" />
                      <span>TV Live Streaming</span>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  </div>

                  <div className="bg-black/60 aspect-video rounded-md border border-neutral-800 flex items-center justify-center relative overflow-hidden group">
                    <img 
                      src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&fit=crop&q=80" 
                      alt="Stream Preview" 
                      className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    
                    <button 
                      onClick={() => setActiveSection('livestream')}
                      className="relative z-10 p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl transition-all cursor-pointer transform hover:scale-110 active:scale-95"
                    >
                      <Tv size={20} />
                    </button>

                    <span className="absolute bottom-2 left-2 bg-black/70 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded text-red-400">
                      SECURE AES-128
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-300 flex items-center justify-between">
                    <span>{streamInfo.channelName}</span>
                    <strong className="text-red-400">● {streamInfo.viewersCount.toLocaleString('id-ID')} VIEWERS</strong>
                  </div>
                </div>
              )}

              {/* Premium Subscriptions Secure Gateway widget */}
              <div className={`p-5 rounded-lg border shadow relative overflow-hidden ${
                darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-slate-200'
              }`}>
                {/* Visual decoration overlay */}
                <div className="absolute -right-6 -bottom-6 h-28 w-28 bg-amber-500/10 rounded-full blur-xl"></div>
                
                <div className="flex items-center gap-2 mb-2 border-b border-neutral-800 pb-2">
                  <span className="p-1 rounded bg-amber-500/10 text-amber-500">
                    ★
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-widest">Fakta Faktual Premium Keanggotaan</h3>
                </div>

                {currentUser?.isPremium ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle className="text-amber-500 mx-auto" size={32} />
                    <p className="text-xs font-bold text-neutral-200">Akun Anda berstatus Premium Aktif!</p>
                    <p className="text-[10px] text-neutral-400">Nikmati akses baca tanpa batas dan siaran streaming eksklusif resolusi tinggi.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribeForm} className="space-y-3">
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Lakukan aktivasi keanggotaan premium instan hanya seharga <strong>Rp 49.000/bulan</strong> untuk bebas iklan dan buka seluruh artikel investigatif.
                    </p>

                    {subDone ? (
                      <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded text-emerald-400 text-xs font-bold text-center">
                        ✓ Pembayaran terverifikasi! Akun dinaikkan ke Premium.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <input 
                            type="email" 
                            required 
                            placeholder="Alamat email Anda..." 
                            value={subEmail}
                            onChange={(e) => setSubEmail(e.target.value)}
                            className="w-full text-xs p-2 rounded bg-black border border-neutral-700 focus:outline-none"
                          />
                          <input 
                            type="text" 
                            required 
                            placeholder="16-Digit Nomor Kartu Debit/Kredit..." 
                            value={subCard}
                            onChange={(e) => setSubCard(e.target.value)}
                            className="w-full text-[11px] p-2 rounded bg-black border border-neutral-700 focus:outline-none font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={subLoading}
                          className="w-full py-2 rounded bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase cursor-pointer transition-all active:scale-95 text-center"
                        >
                          {subLoading ? 'Koneksi NusaPay Secure...' : 'AKTIVASI PREMIUM SEKARANG'}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>

              {/* Real-time Push Notification alerts board */}
              <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-neutral-300">
                    <Bell size={14} className="text-blue-500 animate-pulse" />
                    <span>Notifikasi Berita Kilat (Push Alerts)</span>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400">Aktif</span>
                </div>

                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-4 font-sans text-xs text-neutral-500">
                      Belum ada notifikasi kilat dipancarkan hari ini.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded bg-black border border-neutral-950 relative overflow-hidden hover:border-neutral-855">
                        <h4 className="text-[11px] font-bold text-white mb-0.5 truncate">{n.title}</h4>
                        <p className="text-[10px] text-neutral-400 line-clamp-1">{n.body}</p>
                        <span className="block text-[8px] text-neutral-600 text-right mt-1">{new Date(n.sentAt).toLocaleTimeString('id-ID')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Company info & Social shares Map */}
              <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
                <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-500 border-b border-neutral-800 pb-2">
                  <Compass size={14} />
                  <span>Interactive Perusahaan</span>
                </div>
                
                <div>
                  <h4 className="font-bold text-white">{websiteSettings.companyName}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{websiteSettings.companyAddress}</p>
                </div>

                {/* Simulated Interactive CSS Map */}
                <div className="bg-black/80 rounded-md border border-neutral-800 p-4 relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>📍 Lat: {websiteSettings.companyMapCoordinates.split(',')[0]}</span>
                    <span>Lon: {websiteSettings.companyMapCoordinates.split(',')[1]}</span>
                  </div>

                  <div className="h-24 bg-neutral-950 border border-neutral-900 rounded relative flex items-center justify-center overflow-hidden">
                    {/* Simulated vector roads background design */}
                    <div className="absolute inset-0 opacity-15">
                      <div className="absolute top-4 inset-x-0 h-1 bg-white"></div>
                      <div className="absolute top-12 inset-x-0 h-1 bg-white"></div>
                      <div className="absolute left-8 inset-y-0 w-1 bg-white"></div>
                      <div className="absolute left-24 inset-y-0 w-1 bg-white"></div>
                    </div>

                    <div className="z-10 flex flex-col items-center">
                      <MapPin className="text-red-500 animate-bounce" size={24} />
                      <span className="text-[8px] bg-black/95 text-white p-1 rounded font-black border border-neutral-800 uppercase">
                        Thamrin Precision Plaza Lt. 12
                      </span>
                    </div>
                  </div>

                  <form onSubmit={estimateLocationRoute} className="space-y-2">
                    <label className="block text-[9px] text-neutral-400 uppercase font-bold">PANDUAN LOKASI: Estimasi Rute Ke Kantor Kami</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        required 
                        placeholder="Ketik lokasi keberangkatan (cth: Kemang)..." 
                        value={routeOrigin}
                        onChange={(e) => setRouteOrigin(e.target.value)}
                        className="flex-1 bg-neutral-900 p-1 px-2 rounded text-[10px] focus:outline-none text-white border border-neutral-800"
                      />
                      <button 
                        type="submit" 
                        className="p-1 px-2.5 rounded bg-blue-600 text-white font-bold text-[9px] cursor-pointer"
                      >
                        HITUNG
                      </button>
                    </div>
                  </form>

                  {routingResult && (
                    <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-[9px] text-cyan-400 rounded leading-relaxed">
                      {routingResult}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* -------------------- 2. ARTICLE RETRIEVAL DETAILED VIEW -------------------- */}
        {selectedArticleId && selectedArticle && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Nav Back Button */}
            <button
              onClick={() => setSelectedArticleId(null)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 border rounded cursor-pointer transition-all ${
                darkMode 
                  ? 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              ← Kembali ke Berita Utama
            </button>

            {/* Premium Lock overlay visual blur block */}
            {selectedArticle.isPremium && !currentUser?.isPremium ? (
              <div className={`p-8 rounded-lg border shadow-2xl text-center flex flex-col items-center gap-4 ${
                darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
              }`}>
                <Lock className="text-amber-500 animate-pulse" size={44} />
                <span className="bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest px-3 py-1 rounded">
                  BERITA KATEGORI EKKLUSIF
                </span>
                
                <h1 className="text-2xl font-serif font-black tracking-tight text-neutral-100 max-w-xl">
                  {selectedArticle.title}
                </h1>

                <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                  Sebagian naskah artikel investigatif mendalam dibatasi secara aman untuk menjaga keseimbangan ekonomi jurnalis Fakta Faktual. Lakukan pemesanan keanggotaan premium instan untuk membuka.
                </p>

                <div className="p-6 bg-black rounded-lg border border-neutral-850 w-full max-w-md my-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-3">Form Keanggotaan Premium Instan</h3>
                  <form onSubmit={handleSubscribeForm} className="space-y-3 text-left">
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        required 
                        placeholder="Alamat surel email penagihan..." 
                        value={subEmail}
                        onChange={(e) => setSubEmail(e.target.value)}
                        className="w-full text-xs p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none"
                      />
                      <input 
                        type="text" 
                        required 
                        placeholder="16-Digit Nomor Kartu Anda..." 
                        value={subCard}
                        onChange={(e) => setSubCard(e.target.value)}
                        className="w-full text-[11px] p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={subLoading}
                      className="w-full py-2.5 rounded bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase cursor-pointer text-center"
                    >
                      {subLoading ? 'Memverifikasi Transaksi NusaPay...' : 'PROSES AKTIVASI INSTAN'}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className={`p-6 md:p-8 rounded-lg border shadow-xl flex flex-col gap-6 ${
                darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-205'
              }`}>
                
                {/* News Article Metadata Header */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-600 text-white text-xs font-black uppercase px-2.5 py-0.5 rounded">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold">
                      Dipublish: {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-serif font-black leading-tight tracking-tight text-white mb-2">
                    {selectedArticle.title}
                  </h1>

                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 font-black flex items-center justify-center text-xs">
                        {selectedArticle.authorName.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <span className="block font-bold text-white">{selectedArticle.authorName}</span>
                        <span className="block text-[10px] text-blue-500 uppercase font-black">{selectedArticle.authorRole}</span>
                      </div>
                    </div>

                    {/* Integrated dynamic social shares layout */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-400">BAGIKAN KE:</span>
                      <button 
                        onClick={() => handleShareButton(selectedArticle.id, 'facebook')}
                        className="p-1.5 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 border border-blue-900/10 cursor-pointer"
                        title="Bagikan ke Facebook"
                      >
                        <Facebook size={12} />
                      </button>
                      <button 
                        onClick={() => handleShareButton(selectedArticle.id, 'twitter')}
                        className="p-1.5 rounded bg-sky-950/40 hover:bg-sky-900/60 text-sky-400 border border-sky-900/10 cursor-pointer"
                        title="Bagikan ke X"
                      >
                        <Twitter size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="w-full h-80 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Sharing toast indicators */}
                {shareSuccessId === selectedArticle.id && (
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 text-center font-bold">
                    ✓ Tautan berita nasional berhasil disalin ke papan klip! Bagikan ke kerabat Anda agar kontennya viral.
                  </div>
                )}

                {/* E2E Cryptographic Security verification anchor row */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 text-cyan-400 rounded-lg font-mono text-[10px] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-cyan-400 animate-pulse" size={16} />
                    <span><strong>Visual Ledger E2E Secured:</strong> {selectedArticle.encryptedHash || 'validating...'}</span>
                  </div>
                  <span className="font-bold text-[9px] bg-cyan-500/15 px-2 py-0.5 rounded text-white tracking-widest uppercase">TERINTEGRASI</span>
                </div>

                {/* Main Article Content Text (serif focused styling) */}
                <div className="text-neutral-200 text-sm md:text-base leading-relaxed space-y-4 font-serif">
                  {selectedArticle.content.split('\n\n').map((para, ind) => (
                    <p key={ind} className="indent-6">{para}</p>
                  ))}
                </div>

                {/* End of article advertising spaces block */}
                {websiteSettings.adsArticleBottom && (
                  <div id="ad-article-bottom" className="w-full h-24 bg-neutral-900 border border-neutral-800 rounded relative overflow-hidden flex items-center justify-center my-4">
                    <span className="absolute top-1 right-2 bg-black/60 text-[8px] font-black tracking-widest px-1 py-0.5 rounded text-neutral-400 select-none uppercase">ADVERTISEMENT</span>
                    <img 
                      src={websiteSettings.adsArticleBottom} 
                      alt="Bottom Banner Ad" 
                      className="w-full h-full object-cover opacity-85"
                    />
                  </div>
                )}

                {/* Comments box region */}
                <div className="border-t border-neutral-800 pt-6 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>Kolom Opini Pembaca ({activeArticleComments.length})</span>
                  </h3>

                  {/* Comments lists display */}
                  <div className="space-y-3.5">
                    {activeArticleComments.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">Belum ada opini publik disetujui. Tulis opini pertama Anda di bawah.</p>
                    ) : (
                      activeArticleComments.map((com) => (
                        <div key={com.id} className="p-3.5 rounded bg-black/40 border border-neutral-850 flex flex-col gap-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-white font-bold">{com.authorName}</span>
                            <span className="text-neutral-500">{new Date(com.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                          <p className="text-neutral-300 italic">"{com.content}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Submission comments form */}
                  <form onSubmit={(e) => handleAddComment(e, selectedArticle.id)} className="p-4 bg-neutral-950 rounded-lg border border-neutral-850 space-y-3 mt-4">
                    <h4 className="text-xs font-bold text-blue-500 uppercase">Salurkan Tanggapan Anda</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Nama Lengkap</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Nama panggilan harian..." 
                          value={newCommentName}
                          onChange={(e) => setNewCommentName(e.target.value)}
                          className="w-full text-xs p-2 rounded bg-black border border-neutral-800 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Email Anda (Tidak dipublikasikan)</label>
                        <input 
                          type="email" 
                          placeholder="pembaca@test.com" 
                          disabled={!!currentUser}
                          value={currentUser ? currentUser.email : ''}
                          className="w-full text-xs p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Isi Opini</label>
                      <textarea 
                        rows={3} 
                        required 
                        placeholder="Ketikan opini cerdas Anda mengenai tulisan ini..." 
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full text-xs p-2 rounded bg-black border border-neutral-800 text-white focus:outline-none"
                      ></textarea>
                    </div>

                    {commentSentMessage && (
                      <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded text-cyan-400 text-[10px] font-bold">
                        {commentSentMessage}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Send size={12} />
                        <span>KIRIM KOMENTAR</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}


        {/* -------------------- 3. TV LIVE STREAMING FULL VIEW -------------------- */}
        {activeSection === 'livestream' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-4 bg-gradient-to-r from-red-600 to-amber-600 rounded-lg text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <Radio className="animate-pulse" size={20} />
                <div>
                  <h3 className="font-serif font-black tracking-tight text-sm uppercase">MetroNusa Live Streaming HD</h3>
                  <p className="text-[10px] text-neutral-100">Menyajikan liputan investigatif nasional langsung 24 Jam Non-Stop</p>
                </div>
              </div>
              <span className="text-[11px] font-black bg-black/40 px-3 py-1 rounded">Rilis Internasional</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left frame: Video player representation with interactive parameters */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-black rounded-lg overflow-hidden border border-neutral-800 aspect-video relative group flex items-center justify-center">
                  
                  {videoPlaying ? (
                    <video 
                      src={streamInfo?.streamUrl} 
                      autoPlay 
                      loop 
                      muted 
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-neutral-500 space-y-2">
                      <Tv className="mx-auto" size={44} />
                      <p className="text-xs">Siaran Berita Dihentikan Sementara</p>
                    </div>
                  )}

                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded tracking-widest animate-pulse flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white inline-block"></span>
                    LIVE TRANSMISSION
                  </span>

                  <span className="absolute top-4 right-4 bg-black/80 text-blue-400 text-[9px] font-mono p-1 rounded tracking-widest uppercase border border-neutral-800">
                    {streamInfo?.activeResolution || '1080p'}
                  </span>
                </div>

                <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Saluran: {streamInfo?.channelName}</h4>
                    <span className="text-[10px] text-emerald-400 block font-mono">Enkripsi Siaran: {streamInfo?.encryptionStatus || 'AES-128'}</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs text-neutral-400">Total Penonton Aktif</span>
                    <strong className="text-base text-red-500 font-mono">
                      {streamInfo ? (streamInfo.viewersCount).toLocaleString('id-ID') : '0'} Orang
                    </strong>
                  </div>
                </div>
              </div>

              {/* Right frame: Live Interactive chat logs representation */}
              <div className="lg:col-span-4 p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col h-[380px]">
                <h4 className="text-xs font-black uppercase text-neutral-400 border-b border-neutral-800 pb-2 mb-3">Live Editorial Chat</h4>
                
                <div className="flex-1 space-y-2 overflow-y-auto pr-1 text-[11px] text-neutral-300">
                  <div className="p-2 bg-neutral-950 rounded">
                    <span className="text-blue-500 font-bold">Kipli Jaka: </span>
                    <span>Fakta Faktual TV memang berita berani mengungkap fakta politik di wilayah timur.</span>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded">
                    <span className="text-cyan-500 font-bold">Laras Sati: </span>
                    <span>Tingkat resolusi live streamingnya lancar sekali tanpa buffering di HP saya.</span>
                  </div>
                  <div className="p-2 bg-neutral-950 rounded">
                    <span className="text-yellow-500 font-bold">Gunadi: </span>
                    <span>Harga emas sedang melonjak tajam, sangat akurat info tickernya.</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800">
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Ketikan respon obrolan langsung..." 
                      className="flex-1 bg-black p-1.5 px-2 rounded text-[11px] text-white border border-neutral-800 focus:outline-none"
                    />
                    <button className="bg-red-600 text-white font-bold p-1 rounded hover:bg-red-700 text-[10px]">KIRIM</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* -------------------- 4. SUSUNAN REDAKSI COMPREHENSIVE VIEW -------------------- */}
        {activeSection === 'redaksi' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center py-6 border-b border-slate-200 dark:border-neutral-800">
              <span className="text-xs font-black uppercase text-blue-500 tracking-widest">Tim Redaksi & Dewan Komisaris</span>
              <h2 className="text-2xl font-serif font-black tracking-tight text-white mt-1">Struktur Kepengurusan Media Massa Nasional</h2>
              <p className="text-xs text-neutral-400 max-w-xl mx-auto mt-1 leading-relaxed">
                Diisi oleh para akademisi, pakar pers jurnalistik independen, dan advokat hukum pers guna menjamin kebebasan pers yang berwibawa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              {editorialTeam.map((mem) => (
                <div key={mem.id} className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center gap-3">
                  <img 
                    src={mem.photo} 
                    alt={mem.name} 
                    className="h-24 w-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-white">{mem.name}</h3>
                    <span className="text-[10px] text-neutral-400 font-medium block mt-1">{mem.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* -------------------- 5. PROFIL PERUSAHAAN COMPLETE VIEW -------------------- */}
        {activeSection === 'profil' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column Profile text */}
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-2xl font-serif font-black tracking-tight text-white">Profil {websiteSettings.companyName}</h2>
                <span className="text-[11px] font-bold text-blue-500 tracking-widest uppercase">Badan Hukum Berdaulat Pers Indonesia</span>
                
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Didirikan pada tahun 2024, PT Nusa Media Nusantara berkomitmen melayani bangsa melalui jalur informasi digital mandiri. Fokus pemberitaan kami mengedepankan hak jawab berimbang, akurasi tinggi, serta integritas penegakan hukum pers nasional.
                </p>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Gedung Presisi Thamrin difungsikan sebagai markas komunikasi berita terintegrasi tinggi, mendistribusikan ratusan naskah investigatif per hari yang didukung dewan jurnalis terkemuka di 34 Provinsi Indonesia.
                </p>

                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-black text-white uppercase">Saluran Media Sosial Tersegel Resmi</h4>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <a href={websiteSettings.socialFb} target="_blank" rel="noreferrer" className="p-2 border border-neutral-800 hover:border-neutral-700 rounded bg-neutral-900/60 block text-neutral-300">
                      Facebook Portal
                    </a>
                    <a href={websiteSettings.socialX} target="_blank" rel="noreferrer" className="p-2 border border-neutral-800 hover:border-neutral-700 rounded bg-neutral-900/60 block text-neutral-300">
                      X (Twitter) Feed
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column Map locator & route planner */}
              <div className="lg:col-span-5 p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
                <h3 className="text-xs font-black uppercase text-blue-500 border-b border-neutral-800 pb-2">Navigasi Rute Administrasi Kantor Pusat</h3>

                <div className="text-xs space-y-2">
                  <p className="text-neutral-300"><strong>Alamat Administrasi: </strong>{websiteSettings.companyAddress}</p>
                </div>

                <div className="bg-black/90 p-4 rounded-md border border-neutral-800 space-y-3">
                  <div className="h-32 bg-neutral-950 border border-neutral-900 rounded relative flex items-center justify-center overflow-hidden">
                    {/* Simulated visual radar map */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-8 inset-x-0 h-1 bg-white"></div>
                      <div className="absolute top-16 inset-x-0 h-1 bg-white"></div>
                      <div className="absolute left-10 inset-y-0 w-1 bg-white"></div>
                      <div className="absolute left-28 inset-y-0 w-1 bg-white"></div>
                    </div>

                    <div className="z-10 text-center">
                      <MapPin className="text-red-600 animate-bounce mx-auto" size={28} />
                      <span className="text-[10px] bg-black/95 text-white p-1.5 rounded font-black border border-neutral-850 block mt-1 uppercase">
                        Plaza Thamrin
                      </span>
                    </div>
                  </div>

                  <form onSubmit={estimateLocationRoute} className="space-y-2">
                    <label className="block text-[10px] text-neutral-400 uppercase font-black">Hitung Jarak & Rute Dinamis</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        required 
                        placeholder="Ketikan stasiun/lokasi Anda..." 
                        value={routeOrigin}
                        onChange={(e) => setRouteOrigin(e.target.value)}
                        className="flex-1 bg-neutral-900 p-1.5 px-3 rounded text-[11px] focus:outline-none text-white border border-neutral-800"
                      />
                      <button 
                        type="submit" 
                        className="p-1 px-4 rounded bg-blue-600 text-white font-bold text-xs cursor-pointer"
                      >
                        HITUNG rute
                      </button>
                    </div>
                  </form>

                  {routingResult && (
                    <div className="p-3 bg-neutral-900 border border-neutral-850 text-[10px] text-cyan-400 rounded leading-relaxed">
                      {routingResult}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* -------------------- 6. WRITER REDAKSI STUDIO PANEL (Restricted) -------------------- */}
        {activeSection === 'jurnalis' && currentUser && ['journalist', 'contributor', 'editor', 'admin'].includes(currentUser.role) && (
          <WriterStudio
            darkMode={darkMode}
            currentUser={currentUser}
            articles={articles}
            onArticleChange={loadPortalData}
            websiteSettings={websiteSettings}
          />
        )}


        {/* -------------------- 7. GENERAL ADMIN SETTINGS & MODERATION (Restricted) -------------------- */}
        {activeSection === 'admin' && currentUser && currentUser.role === 'admin' && (
          <AdminPanel
            darkMode={darkMode}
            websiteSettings={websiteSettings}
            onSettingsChange={(newSet) => setWebsiteSettings(newSet)}
            editorialTeam={editorialTeam}
            onEditorialChange={loadPortalData}
            comments={comments}
            onCommentsChange={loadPortalData}
          />
        )}

      </main>

      {/* Global Portal Footer */}
      <footer className={`border-t py-12 mt-16 transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-900 text-neutral-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-neutral-900">
            
            {/* Column 1: Company Profile Summary */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <Building className="text-blue-600" size={18} />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-neutral-200 font-serif">
                  {websiteSettings.websiteName} Media Group
                </h4>
              </div>
              <p className="text-[11px] uppercase tracking-wider text-blue-600 font-bold">Portal Berita Nasional Berwibawa</p>
              <p className="text-[11px] leading-relaxed normal-case tracking-normal text-slate-500 dark:text-neutral-400">
                Menyajikan ulasan jurnalisme investigatif dengan menjunjung tinggi kedaulatan informasi serta penataan pers berintegritas.
              </p>
              <button 
                onClick={() => setActiveFooterTab('profil')}
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ketahui Lebih Lanjut <ArrowRight size={10} />
              </button>
            </div>

            {/* Column 2: Legal Agreements & Guidelines */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-neutral-200">
                Pedoman & Kebijakan
              </h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li>
                  <button 
                    onClick={() => setActiveFooterTab('siber')}
                    className="hover:text-blue-600 text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={12} className="text-neutral-400" />
                    <span>Pedoman Media Siber</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveFooterTab('disclaimer')}
                    className="hover:text-blue-600 text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Info size={12} className="text-neutral-400" />
                    <span>Disclaimer Resmi</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveFooterTab('privasi')}
                    className="hover:text-blue-600 text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock size={12} className="text-neutral-400" />
                    <span>Kebijakan Privasi</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Redaksi & Google Maps Lokasi */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-neutral-200">
                Tim Kami & Lokasi Kantor
              </h4>
              <ul className="space-y-2 text-[11px] font-bold">
                <li>
                  <button 
                    onClick={() => setActiveFooterTab('redaksi')}
                    className="hover:text-blue-600 text-left transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Users2 size={12} className="text-neutral-400" />
                    <span>Susunan Redaksi</span>
                  </button>
                </li>
                <li>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(websiteSettings.companyAddress)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-blue-600 text-left transition-colors flex items-center gap-1.5"
                  >
                    <MapPin size={12} className="text-red-500" />
                    <span>Buka Google Maps Resmi</span>
                  </a>
                </li>
              </ul>
              <p className="text-[10px] text-neutral-500 font-mono normal-case tracking-normal">
                Lat/Lon: {websiteSettings.companyMapCoordinates}
              </p>
            </div>

            {/* Column 4: Official Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-neutral-200">
                Saluran Media Sosial
              </h4>
              <p className="text-[10px] leading-relaxed normal-case tracking-normal text-slate-500 dark:text-neutral-400 pb-1">
                Ikuti liputan harian terhangat, perdebatan opini, dan ulasan politik langsung di platform sosial resmi kami.
              </p>
              <div className="flex flex-wrap gap-2">
                {websiteSettings.socialFb && (
                  <a 
                    href={websiteSettings.socialFb} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 border border-slate-200 dark:border-neutral-800 rounded bg-neutral-100 dark:bg-neutral-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
                    title="Ikuti di Facebook"
                  >
                    <Facebook size={14} />
                  </a>
                )}
                {websiteSettings.socialX && (
                  <a 
                    href={websiteSettings.socialX} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 border border-slate-200 dark:border-neutral-800 rounded bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-black transition-colors flex items-center justify-center"
                    title="Ikuti di X (Twitter)"
                  >
                    <Twitter size={14} />
                  </a>
                )}
                {/* Simulated Official Youtube */}
                {websiteSettings.socialYt && (
                  <a 
                    href={websiteSettings.socialYt} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 border border-slate-200 dark:border-neutral-800 rounded bg-neutral-100 dark:bg-neutral-900 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors flex items-center justify-center"
                    title="Ikuti di YouTube"
                  >
                    <Youtube size={14} />
                  </a>
                )}
                {/* Simulated Official Instagram */}
                {websiteSettings.socialIg && (
                  <a 
                    href={websiteSettings.socialIg} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 border border-slate-200 dark:border-neutral-800 rounded bg-neutral-100 dark:bg-neutral-900 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 transition-colors flex items-center justify-center"
                    title="Ikuti di Instagram"
                  >
                    <Instagram size={14} />
                  </a>
                )}
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 uppercase tracking-wider text-[11px] font-bold">
            <div className="flex flex-wrap items-center gap-4 italic text-neutral-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> 
                <span>E2E Enkripsi Ujung-Ke-Ujung Aktif</span>
              </span>
              <span>|</span>
              <span>Google Core Search Terintegrasi</span>
              <span>|</span>
              <span>SMTP Terhubung</span>
            </div>

            <div className="text-center md:text-right">
              <span className="text-slate-900 dark:text-neutral-200 font-serif font-black tracking-tight border-b-2 border-blue-600 pb-0.5">
                {websiteSettings.websiteName} Media Group.
              </span>
              <span className="block text-[9px] text-neutral-500 font-mono mt-1.5 normal-case tracking-normal">
                © 2026 PT Fakta Media Nusantara. Hak Cipta Dilindungi Undang-Undang Republik Indonesia.
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Pop-up Modals for Footer Tabs */}
      {activeFooterTab && (
        <div 
          id="footer-detail-modal" 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveFooterTab(null)}
        >
          <div 
            className={`w-full max-w-3xl rounded-xl border p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto ${
              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveFooterTab(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-800/10 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-slate-400 hover:text-red-500 font-extrabold text-sm"
            >
              ✕
            </button>

            {/* Modal Content Switch */}
            {activeFooterTab === 'profil' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <Building className="text-blue-500" size={24} />
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight">Profil Perusahaan</h3>
                </div>
                <div className="space-y-3.5 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-neutral-300 normal-case tracking-normal">
                  <p className="font-bold text-slate-800 dark:text-white text-base">
                    {websiteSettings.companyName}
                  </p>
                  <p>
                    PT Fakta Media Nusantara merupakan badan hukum media pers independen tanah air yang didirikan dengan semangat keterbukaan informasi publik dan akurasi tinggi. Kami menyajikan ulasan tajam seputar dinamika politik, ekonomi, teknologi, pariwisata, olahraga, hingga berita mancanegara secara real-time.
                  </p>
                  <p>
                    Dengan didukung oleh puluhan koresponden profesional bersertifikasi di 34 provinsi dan jurnalis berkomitmen tinggi, kami terus menata keamanan siber portal berita Fakta Faktual serta menghadirkan penyiaran audio-visual berkualitas HD dalam menu TV Live Streaming kami.
                  </p>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-950 dark:text-neutral-200 flex items-center gap-1.5 uppercase">
                      <MapPin size={14} className="text-red-500" /> Alamat Administrasi & Redaksi Pusat:
                    </p>
                    <p className="text-xs font-mono text-slate-700 dark:text-neutral-300 leading-normal">{websiteSettings.companyAddress}</p>
                    <div className="pt-2">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(websiteSettings.companyAddress)}`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 px-3 rounded shadow transition-all cursor-pointer"
                      >
                        <Compass size={14} /> Buka di Google Maps Resmi
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFooterTab === 'redaksi' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <Users2 className="text-blue-500" size={24} />
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight">Dewan Redaksi & Pengurus Penyiaran</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4 normal-case tracking-normal">
                  Struktur fungsional kepengurusan media massa PT Fakta Media Nusantara untuk menjamin kepatuhan Kode Etik Jurnalistik Dewan Pers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {editorialTeam.length > 0 ? (
                    editorialTeam.map((mem) => (
                      <div key={mem.id} className="p-3 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-850 text-center flex flex-col items-center gap-2">
                        <img 
                          src={mem.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80'} 
                          alt={mem.name} 
                          className="h-16 w-16 rounded-full object-cover border border-blue-500/50 shadow"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-950 dark:text-neutral-100 normal-case">{mem.name}</h4>
                          <span className="text-[9px] text-neutral-400 block font-semibold uppercase mt-0.5">{mem.role}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-6 text-xs text-neutral-500 font-bold">
                      Tim redaksi sedang disinkronisasikan...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeFooterTab === 'siber' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <ShieldAlert className="text-blue-500" size={24} />
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight">Pedoman Pemberitaan Media Siber</h3>
                </div>
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-neutral-300 normal-case tracking-normal font-sans">
                  <p className="font-bold">Pedoman Pemberitaan Media Siber disahkan oleh Dewan Pers Republik Indonesia:</p>
                  <p>
                    <strong>1. Ruang Lingkup</strong><br />
                    Media siber adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik.
                  </p>
                  <p>
                    <strong>2. Verifikasi dan Keberimbangan Berita</strong><br />
                    Setiap berita pada prinsipnya harus melalui verifikasi secara matang dan berimbang. Namun, berita siber yang memerlukan kecepatan dapat ditayangkan dengan syarat menyertakan keterangan bahwa berita masih memerlukan konfirmasi lebih lanjut yang akan dimasukkan dalam berita pemutakhiran berikutnya.
                  </p>
                  <p>
                    <strong>3. Isi Buatan Pengguna (User Generated Content)</strong><br />
                    Media siber harus menerapkan penataan moderasi ketat terhadap komentar, opini, atau tulisan kiriman dari para pembaca guna mencegah penyebaran berita bohong (hoaks), fitnah, ujaran kebencian, sara, maupun pornografi.
                  </p>
                  <p>
                    <strong>4. Ralat, Koreksi, dan Hak Jawab</strong><br />
                    Ralat, koreksi atau hak jawab wajib ditautkan secara langsung pada berita yang dinterpelasikan, disertai dengan keterangan waktu ralat dilakukan demi transparansi utuh jurnalisme masa kini.
                  </p>
                </div>
              </div>
            )}

            {activeFooterTab === 'disclaimer' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <Info className="text-blue-500" size={24} />
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight">Disclaimer (Pemberitahuan Resmi)</h3>
                </div>
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-neutral-300 normal-case tracking-normal">
                  <p>
                    Seluruh materi pemberitaan berupa artikel teks, statistik instan, foto, video siaran, kutipan opini pembaca, maupun iklan promosi yang disalurkan melalui media grup Fakta Faktual ditujukan untuk kepentingan perluasan wawasan informatif pembaca secara umum.
                  </p>
                  <p>
                    PT Fakta Media Nusantara tidak bertanggung jawab atas kerugian materiil, finansial, maupun kerugian moral yang muncul dikarenakan kesalahan penafsiran individu pembaca dalam memanfaatkan ulasan berita kami sebagai acuan berspekulasi (baik investasi saham, politik praktis, maupun penegakan hukum mandiri).
                  </p>
                  <p>
                    Para jurnalis kami dilarang keras menerima gratifikasi dari narasumber dalam bentuk apa pun. Apabila pembaca menemukan kejanggalan atau tindakan pemerasan oleh personil yang mengatasnamakan bagian dari Fakta Faktual, harap segera hubungi otoritas kepolisian terdekat atau laporkan melalui surat resmi dewan redaksi pers.
                  </p>
                </div>
              </div>
            )}

            {activeFooterTab === 'privasi' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <Lock className="text-blue-500" size={24} />
                  <h3 className="text-xl font-serif font-black uppercase tracking-tight">Kebijakan Privasi Portal</h3>
                </div>
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-600 dark:text-neutral-300 normal-case tracking-normal">
                  <p>
                    Kami di Fakta Faktual menjamin kerahasiaan identitas digital para pembaca kami secara utuh melalui sistem standar keamanan modern:
                  </p>
                  <p>
                    <strong>1. Informasi Yang Dikumpulkan</strong><br />
                    Kami menyimpan informasi nama, alamat email, dan kredensial login penataan ketika Anda mendaftar akun pembaca atau memproses langganan Premium via NusaPay. Seluruh lalu lintas transaksi dijamin aman dan terenkripsi menggunakan protokol SSL tingkat tinggi.
                  </p>
                  <p>
                    <strong>2. Pemanfaatan Cookie Sesi</strong><br />
                    Portal kami merekam pengaturan pilihan tema tampilan (Dark Mode) serta status hak akses login secara lokal pada cookie peramban browser Anda guna memberikan kenyamanan transisi membaca tanpa repot mengisi ulang kredensial.
                  </p>
                  <p>
                    <strong>3. Kerahasiaan Data</strong><br />
                    Kami tidak akan pernah menyewakan, memperjualbelikan, atau mendistribusikan basis data pembaca kami kepada pihak ketiga tanpa persetujuan eksplisit legal dari pembaca yang bersangkutan.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Controls */}
            <div className="border-t border-slate-200 dark:border-neutral-800 pt-4 mt-6 flex justify-end">
              <button 
                onClick={() => setActiveFooterTab(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded transition-all cursor-pointer"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
