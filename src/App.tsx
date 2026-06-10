import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Building,
  Mail,
  Plus,
  ArrowLeft,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Flame,
  Search,
  ArrowUp,
  ArrowDown,
  Bookmark,
  MessageCircle,
  ThumbsUp,
  Frown,
  Heart,
  ListOrdered
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import MarketWidgets from './components/MarketWidgets';
import WriterStudio from './components/WriterStudio';
import AdminPanel from './components/AdminPanel';
import { AdSenseBanner } from './components/AdSenseBanner';
import { User, Article, WebSettings, Comment } from './types';
import { ImageWithBlurPlaceholder } from './components/ImageWithBlurPlaceholder';
import { CompanyMapWidget } from './components/CompanyMapWidget';

export default function App() {
  // Theme Dark/Light
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
    categories: ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan", "Kesehatan", "Gaya Hidup", "Edukasi", "Otomotif", "Opini", "Nasional", "Kriminal"],
    announcement: "Fakta Faktual kini hadir dengan informasi paling presisi, tajam, dan tepercaya untuk Anda.",
    youtubeChannelId: "UC68D_D49mI-Q2Ujhi76W2pw",
    youtubeStreamId: "5qap5aO4i9A",
  });

  const preset = websiteSettings.themePreset || 'slate';
  const themeAccent = {
    slate: {
      text: 'text-blue-500',
      textHover: 'hover:text-blue-400',
      bg: 'bg-blue-600',
      bgHover: 'hover:bg-blue-700',
      border: 'border-blue-600',
      borderMuted: 'border-blue-600/40',
      bgLight: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
      focusRing: 'focus:border-blue-600 focus:ring-blue-600',
      badgeGrad: 'from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
    },
    emerald: {
      text: 'text-emerald-500',
      textHover: 'hover:text-emerald-400',
      bg: 'bg-emerald-600',
      bgHover: 'hover:bg-emerald-700',
      border: 'border-emerald-600',
      borderMuted: 'border-emerald-600/40',
      bgLight: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
      focusRing: 'focus:border-emerald-600 focus:ring-emerald-600',
      badgeGrad: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-850',
    },
    amber: {
      text: 'text-amber-500',
      textHover: 'hover:text-amber-400',
      bg: 'bg-amber-600',
      bgHover: 'hover:bg-amber-700',
      border: 'border-amber-600',
      borderMuted: 'border-amber-600/40',
      bgLight: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
      focusRing: 'focus:border-amber-600 focus:ring-amber-600',
      badgeGrad: 'from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-850',
    },
    indigo: {
      text: 'text-indigo-500',
      textHover: 'hover:text-indigo-400',
      bg: 'bg-indigo-600',
      bgHover: 'hover:bg-indigo-700',
      border: 'border-indigo-600',
      borderMuted: 'border-indigo-600/40',
      bgLight: 'bg-indigo-600/10 text-indigo-600 border-indigo-600/20',
      focusRing: 'focus:border-indigo-600 focus:ring-indigo-600',
      badgeGrad: 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-855',
    },
    crimson: {
      text: 'text-rose-500',
      textHover: 'hover:text-rose-400',
      bg: 'bg-rose-600',
      bgHover: 'hover:bg-rose-700',
      border: 'border-rose-600',
      borderMuted: 'border-rose-600/40',
      bgLight: 'bg-rose-600/10 text-rose-600 border-rose-600/20',
      focusRing: 'focus:border-rose-600 focus:ring-rose-600',
      badgeGrad: 'from-rose-600 to-red-750 hover:from-rose-750 hover:to-red-850',
    }
  }[preset];

  const layoutPreset = websiteSettings.layoutPreset || 'classic';

  // Authentication & Current Roles States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fakta_faktual_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current active navigation context
  const [activeSection, setActiveSection] = useState<'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream'>('home');

  // Global Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'contributor' | 'journalist'>('user');
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // States for Gmail / Google Sign-in flow
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');
  const [googleCustomName, setGoogleCustomName] = useState('');
  const [showGoogleCustomForm, setShowGoogleCustomForm] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState('');

  // Interactive footer section modal states
  const [activeFooterTab, setActiveFooterTab] = useState<'redaksi' | 'profil' | 'siber' | 'disclaimer' | 'privasi' | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  const [headlineSearch, setHeadlineSearch] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastReadTrigger, setLastReadTrigger] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Smooth scroll helper functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-header-search-block') || document.getElementById('category-navigation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    setTimeout(scrollToCatalog, 50);
  };

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Articles & Comments lists
  const [articles, setArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editorialTeam, setEditorialTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view details state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Scroll Reading Progress state for detailed article view
  const [scrollProgress, setScrollProgress] = useState(0);

  // Table of Contents Collapse state
  const [tocCollapsed, setTocCollapsed] = useState(false);

  // Reader Reactions States per article
  const [reactions, setReactions] = useState<{ [articleId: string]: { [type: string]: number } }>(() => {
    try {
      const saved = localStorage.getItem('fakta_faktual_article_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [userReactions, setUserReactions] = useState<{ [articleId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('fakta_faktual_user_reactions_log');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [reactionPops, setReactionPops] = useState<{ id: string; type: string; angle: number; distance: number; size: number; delay: number }[]>([]);

  const triggerReactionPop = (type: string) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${type}-${Date.now()}-${i}-${Math.random()}`,
      type,
      angle: (i * 45) + (Math.random() * 20 - 10),
      distance: 40 + Math.random() * 30,
      size: 12 + Math.random() * 12,
      delay: Math.random() * 0.04,
    }));
    setReactionPops(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setReactionPops(prev => prev.filter(p => !newParticles.some(n => n.id === p.id)));
    }, 1000);
  };

  const handleReact = (articleId: string, type: string) => {
    const currentActiveReaction = userReactions[articleId];
    
    // Trigger heart-pop animation
    triggerReactionPop(type);
    
    setReactions((prev) => {
      const artReactions = prev[articleId] || {
        informatif: (articleId.charCodeAt(0) || 12) % 15 + 12,
        kaget: (articleId.charCodeAt(0) || 12) % 7 + 2,
        faktual: (articleId.charCodeAt(0) || 12) % 22 + 25,
        inspiratif: (articleId.charCodeAt(0) || 12) % 11 + 5,
        prihatin: (articleId.charCodeAt(0) || 12) % 5 + 1
      };
      const updatedArtReactions = { ...artReactions };
      
      if (currentActiveReaction === type) {
        // Toggle off the reaction
        updatedArtReactions[type] = Math.max(0, updatedArtReactions[type] - 1);
        const updatedUserReactions = { ...userReactions };
        delete updatedUserReactions[articleId];
        setUserReactions(updatedUserReactions);
        localStorage.setItem('fakta_faktual_user_reactions_log', JSON.stringify(updatedUserReactions));
      } else {
        // Switch or set reaction
        if (currentActiveReaction) {
          updatedArtReactions[currentActiveReaction] = Math.max(0, updatedArtReactions[currentActiveReaction] - 1);
        }
        updatedArtReactions[type] = (updatedArtReactions[type] || 0) + 1;
        
        const updatedUserReactions = { ...userReactions, [articleId]: type };
        setUserReactions(updatedUserReactions);
        localStorage.setItem('fakta_faktual_user_reactions_log', JSON.stringify(updatedUserReactions));
      }
      
      const newGlobalReactions = { ...prev, [articleId]: updatedArtReactions };
      localStorage.setItem('fakta_faktual_article_reactions', JSON.stringify(newGlobalReactions));
      return newGlobalReactions;
    });
  };

  const getArticleReactions = (articleId: string) => {
    const saved = reactions[articleId];
    if (saved) return saved;

    // Use deterministic mock counts based on article title/id
    const val = articleId.charCodeAt(0) || 12;
    return {
      informatif: val % 15 + 12,
      kaget: val % 7 + 2,
      faktual: val % 22 + 25,
      inspiratif: val % 11 + 5,
      prihatin: val % 5 + 1
    };
  };

  // Scroll progress listener when reading dynamic articles
  useEffect(() => {
    if (!selectedArticleId) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setScrollProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedArticleId]);

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
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState(true);
  const [trafficIntensity, setTrafficIntensity] = useState<'lancar' | 'padat' | 'macet'>('padat');

  // Social Share success tracker
  const [shareSuccessId, setShareSuccessId] = useState<string | null>(null);

  // User reading preferences (reading modes: default, sepia, dark, light)
  const [readingTheme, setReadingTheme] = useState<'default' | 'sepia' | 'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('faktafaktual_reading_theme');
      return (saved as any) || 'default';
    } catch {
      return 'default';
    }
  });

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(() => {
    try {
      const saved = localStorage.getItem('faktafaktual_reading_fontsize');
      return (saved as any) || 'md';
    } catch {
      return 'md';
    }
  });

  // Track article selected viewer hit
  useEffect(() => {
    if (selectedArticleId) {
      // Record user reading preference category views
      if (currentUser) {
        const viewedArt = articles.find(a => a.id === selectedArticleId);
        if (viewedArt) {
          try {
            const storageKey = `fakta_faktual_category_views_${currentUser.id}`;
            const currentViewsStr = localStorage.getItem(storageKey);
            const currentViews: Record<string, number> = currentViewsStr ? JSON.parse(currentViewsStr) : {};
            const cat = viewedArt.category;
            currentViews[cat] = (currentViews[cat] || 0) + 1;
            localStorage.setItem(storageKey, JSON.stringify(currentViews));
            setLastReadTrigger(prev => prev + 1);
          } catch (e) {
            console.error("Gagal mencatat riwayat pemuatan preferensi", e);
          }
        }
      }

      const triggerArticleView = async () => {
        try {
          const indonesians = [
            { city: 'Jakarta Pusat', region: 'DKI Jakarta' },
            { city: 'Bandung', region: 'Jawa Barat' },
            { city: 'Surabaya', region: 'Jawa Timur' },
            { city: 'Medan', region: 'Sumatera Utara' },
            { city: 'Makassar', region: 'Sulawesi Selatan' },
            { city: 'Denpasar', region: 'Bali' },
            { city: 'Palembang', region: 'Sumatera Selatan' },
            { city: 'Semarang', region: 'Jawa Tengah' },
            { city: 'Yogyakarta', region: 'DI Yogyakarta' },
            { city: 'Balikpapan', region: 'Kalimantan Timur' },
            { city: 'Banjarmasin', region: 'Kalimantan Selatan' },
            { city: 'Pekanbaru', region: 'Riau' },
            { city: 'Manado', region: 'Sulawesi Utara' },
            { city: 'Ambon', region: 'Maluku' },
            { city: 'Jayapura', region: 'Papua' }
          ];
          const randomIpLoc = indonesians[Math.floor(Math.random() * indonesians.length)];
          const devices = ['Mobile', 'Desktop', 'Tablet'];
          const randomDevice = devices[Math.floor(Math.random() * devices.length)];

          let city = randomIpLoc.city;
          let region = randomIpLoc.region;

          try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            if (geoResponse.ok && geoResponse.headers.get("content-type")?.includes("application/json")) {
              const geoData = await geoResponse.json();
              if (geoData.city && geoData.region) {
                city = geoData.city;
                region = geoData.region;
              }
            }
          } catch (e) {
            // Safe fallback to random Indo locale
          }

          const res = await fetch(`/api/articles/${selectedArticleId}?city=${encodeURIComponent(city)}&region=${encodeURIComponent(region)}&device=${encodeURIComponent(randomDevice)}`);
          if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
            const updatedArt = await res.json();
            setArticles(prev => prev.map(a => a.id === selectedArticleId ? updatedArt : a));
          }
        } catch (err) {
          console.error("Gagal mencatat hit pembaca", err);
        }
      };
      triggerArticleView();
    }
  }, [selectedArticleId]);

  useEffect(() => {
    try {
      localStorage.setItem('faktafaktual_reading_theme', readingTheme);
    } catch (e) {}
  }, [readingTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('faktafaktual_reading_fontsize', fontSize);
    } catch (e) {}
  }, [fontSize]);

  // Sync basic data upon loading
  const loadPortalData = async () => {
    setLoading(true);
    try {
      const fetchJsonResilient = async (url: string, fallbackValue: any) => {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`Resilient Fetch: ${url} returned status ${res.status}`);
            return fallbackValue;
          }
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.warn(`Resilient Fetch: ${url} returned non-JSON Content-Type: ${contentType}`);
            return fallbackValue;
          }
          return await res.json();
        } catch (err) {
          console.error(`Resilient Fetch Error for ${url}:`, err);
          return fallbackValue;
        }
      };

      const artData = await fetchJsonResilient('/api/articles?status=published', []);
      setArticles(artData);

      // Check if deep link article exists in URL parameters
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const articleParam = urlParams.get('article');
        if (articleParam) {
          const exists = artData.find((a: Article) => a.id === articleParam);
          if (exists) {
            setSelectedArticleId(articleParam);
          }
        }
      }

      const setData = await fetchJsonResilient('/api/settings', {
        websiteName: "Fakta Faktual",
        websiteLogo: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80",
        categories: ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan", "Kesehatan", "Gaya Hidup", "Edukasi", "Otomotif", "Opini", "Nasional", "Kriminal"],
        announcement: "Fakta Faktual kini hadir dengan informasi paling presisi, tajam, dan tepercaya untuk Anda.",
        themePreset: "slate",
        layoutPreset: "classic"
      });
      setWebsiteSettings(setData);

      const edData = await fetchJsonResilient('/api/redaksi', []);
      setEditorialTeam(edData);

      const comData = await fetchJsonResilient('/api/comments', []);
      setComments(comData);

      const pushData = await fetchJsonResilient('/api/push-notifications', []);
      setNotifications(pushData);

      const streamData = await fetchJsonResilient('/api/stream-status', {
        online: true,
        channelName: "Fakta Faktual TV Live Streaming HD",
        streamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
        viewersCount: 24508,
        activeResolution: "1080p 60fps",
        encryptionStatus: "AES-128 Stream Encrypted"
      });
      setStreamInfo(streamData);

      // Verify active user exists in system database
      try {
        const userRes = await fetch('/api/users');
        if (userRes.ok && userRes.headers.get("content-type")?.includes("application/json")) {
          const userData: User[] = await userRes.json();
          const activeUserStr = localStorage.getItem('fakta_faktual_current_user');
          if (activeUserStr) {
            const activeUser: User = JSON.parse(activeUserStr);
            const stillExists = userData.some(u => u.email.toLowerCase() === activeUser.email.toLowerCase());
            if (!stillExists) {
              setCurrentUser(null);
              localStorage.removeItem('fakta_faktual_current_user');
              setAlertToast("Akun Anda telah dihapus oleh administrator.");
              setTimeout(() => setAlertToast(null), 3000);
            }
          }
        }
      } catch (err) {
        console.error("Gagal melakukan pengecekan status kredensial pengguna", err);
      }
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

  // Dynamic Google AdSense Code Injector (ensuring proper script load inside head)
  useEffect(() => {
    if (websiteSettings?.adsenseHeaderCode) {
      const oldScript = document.getElementById('adsense-dynamic-header');
      if (oldScript) {
        oldScript.remove();
      }

      const cleanCode = websiteSettings.adsenseHeaderCode.trim();
      if (cleanCode) {
        const container = document.createElement('div');
        container.id = 'adsense-dynamic-header';
        container.innerHTML = cleanCode;
        
        const scripts = container.getElementsByTagName('script');
        Array.from(scripts).forEach((script) => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (script.innerHTML) {
            newScript.innerHTML = script.innerHTML;
          }
          document.head.appendChild(newScript);
        });
        console.log('[AdSense] Dynamic Header Script Injected Successfully');
      }
    }
  }, [websiteSettings?.adsenseHeaderCode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fakta_faktual_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fakta_faktual_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.googleFlow) {
        setIsGoogleFlow(true);
      } else {
        setIsGoogleFlow(false);
      }
      setShowGoogleCustomForm(false);
      setGoogleErrorMessage('');
      setShowAuthModal(true);
    };
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthErrorMessage('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        setAuthErrorMessage('Ukuran foto terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setAvatarBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage('');
    let success = false;
    if (isRegistering) {
      if (!emailInput || !regName || !passwordInput) {
        setAuthErrorMessage('Lengkapi semua bidang!');
        return;
      }
      success = await handleLogin(emailInput, regRole, passwordInput, regName, avatarBase64 || undefined);
      if (success) {
        setIsRegistering(false);
        setShowAuthModal(false);
        setEmailInput('');
        setPasswordInput('');
        setRegName('');
        setAvatarPreview(null);
        setAvatarBase64(null);
      } else {
        setAuthErrorMessage('Gagal mendaftar. Email mungkin sudah digunakan.');
      }
    } else {
      if (!emailInput) return;
      success = await handleLogin(emailInput, undefined, passwordInput);
      if (success) {
        setShowAuthModal(false);
        setEmailInput('');
        setPasswordInput('');
      } else {
        setAuthErrorMessage('Akses Ditolak: Email atau Kata Sandi salah!');
      }
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleFlow(true);
    setGoogleErrorMessage('');
    setShowGoogleCustomForm(false);
    setGoogleCustomEmail('');
    setGoogleCustomName('');
  };

  const handleSelectGoogleAccount = async (email: string, fullName: string) => {
    setGoogleErrorMessage('');
    try {
      const success = await handleLogin(email, 'user', 'secret-google-pass', fullName);
      if (success) {
        setShowAuthModal(false);
        setIsGoogleFlow(false);
        setGoogleCustomEmail('');
        setGoogleCustomName('');
      } else {
        setGoogleErrorMessage('Gagal menyinkronkan akun Google Anda dengan portal.');
      }
    } catch (err: any) {
      setGoogleErrorMessage(err.message || 'Terjadi kesalahan sistem Google SSO.');
    }
  };

  const handleCustomGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleErrorMessage('');
    
    const email = googleCustomEmail.trim().toLowerCase();
    const name = googleCustomName.trim();
    
    if (!email || !name) {
      setGoogleErrorMessage('Semua kolom wajib diisi!');
      return;
    }
    
    if (!email.endsWith('@gmail.com')) {
      setGoogleErrorMessage('Alamat surel harus menggunakan domain @gmail.com!');
      return;
    }
    
    try {
      const success = await handleLogin(email, 'user', 'secret-google-pass', name);
      if (success) {
        setShowAuthModal(false);
        setIsGoogleFlow(false);
        setGoogleCustomEmail('');
        setGoogleCustomName('');
      } else {
        setGoogleErrorMessage('Gagal mendaftarkan akun Gmail baru.');
      }
    } catch (err: any) {
      setGoogleErrorMessage(err.message || 'Terjadi gangguan koneksi server.');
    }
  };

  // Handle Dynamic login matching with database user-credentials
  const handleLogin = async (email: string, requestedRole?: string, password?: string, fullName?: string, avatarBase64?: string): Promise<boolean> => {
    try {
      // 1. Fetch current users list from database
      const res = await fetch('/api/users');
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
        console.warn("Failed fetching users: Response is not JSON or status not OK");
        return false;
      }
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
            password: finalPass,
            avatarData: avatarBase64
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

  // Sync bookmarks whenever the logged-in user changes
  useEffect(() => {
    if (currentUser) {
      try {
        const stored = localStorage.getItem(`fakta_faktual_bookmarks_${currentUser.id}`);
        setBookmarkedIds(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error("Gagal membaca data bookmark:", e);
        setBookmarkedIds([]);
      }
    } else {
      setBookmarkedIds([]);
    }
  }, [currentUser]);

  // Toggle bookmark function for items and feeds
  const toggleBookmark = (articleId: string) => {
    if (!currentUser) {
      setAlertToast("Silakan LOGIN AKSES terlebih dahulu untuk menyimpan artikel favorit Anda!");
      setTimeout(() => setAlertToast(null), 3000);
      return;
    }
    try {
      const storageKey = `fakta_faktual_bookmarks_${currentUser.id}`;
      let updated: string[];
      if (bookmarkedIds.includes(articleId)) {
        updated = bookmarkedIds.filter(id => id !== articleId);
        setAlertToast("Berhasil dihapus dari bookmark.");
      } else {
        updated = [...bookmarkedIds, articleId];
        setAlertToast("Berhasil ditambahkan ke bookmark.");
      }
      setBookmarkedIds(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setTimeout(() => setAlertToast(null), 2500);
    } catch (e) {
      console.error("Gagal mengolah data bookmark:", e);
    }
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
        if (comRes.ok && comRes.headers.get("content-type")?.includes("application/json")) {
          const comData = await comRes.json();
          setComments(comData);
        }
        
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
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleShareButton = (artId: string, social: string) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?article=${artId}`;
    
    if (social === 'link' || social === 'copy') {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setShareSuccessId(artId);
            setTimeout(() => setShareSuccessId(null), 2500);
          })
          .catch(err => {
            console.error("Gagal menyalin tautan", err);
          });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          setShareSuccessId(artId);
          setTimeout(() => setShareSuccessId(null), 2500);
        } catch (err) {
          console.error("Fallback copy failed", err);
        }
        document.body.removeChild(textArea);
      }
    } else {
      let url = '';
      if (social === 'facebook') {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      } else if (social === 'twitter') {
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Baca berita terbaru di Fakta Faktual')}`;
      } else if (social === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent('Baca Berita Fakta Faktual: ' + shareUrl)}`;
      }
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const getReadingClasses = () => {
    const effectiveTheme = readingTheme === 'default' ? (darkMode ? 'dark' : 'light') : readingTheme;

    switch (effectiveTheme) {
      case 'sepia':
        return {
          wrapper: 'bg-[#f4ecd8] border-[#dfd1b8] text-[#4a3525]',
          title: 'text-[#362214]',
          author: 'text-[#4a3525]',
          meta: 'text-[#705640]',
          paragraph: 'text-[#362214] font-serif',
          label: 'bg-[#ebdcb9] text-[#5c4a3b]',
          cardTitle: 'text-[#4a3525]',
          border: 'border-[#dfd1b8]',
          inputBg: 'bg-[#ebdcb9] border-[#d8c59f] text-[#362214] placeholder-[#8a725b]',
          commentBg: 'bg-[#ebdcb9]/50 border-[#d8c59f] text-[#362214]'
        };
      case 'dark':
        return {
          wrapper: 'bg-[#18181b] border-[#27272a] text-[#e4e4e7]',
          title: 'text-[#fafafa]',
          author: 'text-[#e4e4e7]',
          meta: 'text-[#a1a1aa]',
          paragraph: 'text-[#f4f4f5] font-serif',
          label: 'bg-zinc-800 text-zinc-300',
          cardTitle: 'text-white',
          border: 'border-zinc-800',
          inputBg: 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500',
          commentBg: 'bg-zinc-900/50 border-zinc-800 text-[#e4e4e7]'
        };
      case 'light':
        return {
          wrapper: 'bg-[#fdfdfd] border-slate-200 text-[#1e293b]',
          title: 'text-[#0f172a]',
          author: 'text-[#1e293b]',
          meta: 'text-[#64748b]',
          paragraph: 'text-[#1e293b] font-serif',
          label: 'bg-slate-100 text-slate-700',
          cardTitle: 'text-slate-900',
          border: 'border-slate-200',
          inputBg: 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400',
          commentBg: 'bg-slate-50 border-slate-200 text-[#334155]'
        };
      default: // default is based on site darkMode
        return darkMode ? { // default-dark
          wrapper: 'bg-neutral-900 border-neutral-800 text-neutral-200',
          title: 'text-white',
          author: 'text-neutral-200',
          meta: 'text-neutral-400',
          paragraph: 'text-neutral-200 font-serif',
          label: 'bg-blue-600/20 text-blue-400',
          cardTitle: 'text-white',
          border: 'border-neutral-850',
          inputBg: 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500',
          commentBg: 'bg-black/40 border-neutral-850 text-neutral-300'
        } : { // default-light
          wrapper: 'bg-white border-slate-200 text-slate-800',
          title: 'text-slate-900',
          author: 'text-slate-700',
          meta: 'text-slate-500',
          paragraph: 'text-slate-800 font-serif',
          label: 'bg-blue-100 text-blue-600',
          cardTitle: 'text-slate-900',
          border: 'border-slate-200',
          inputBg: 'bg-slate-50 border-slate-300 text-slate-850 placeholder-slate-400',
          commentBg: 'bg-slate-50 border-slate-200 text-slate-700'
        };
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xs md:text-sm leading-relaxed';
      case 'lg':
        return 'text-base md:text-lg leading-relaxed';
      case 'xl':
        return 'text-lg md:text-xl leading-loose tracking-wide';
      case 'md':
      default:
        return 'text-sm md:text-base leading-relaxed';
    }
  };

  // Interactive CSS Locator map routing estimation
  const estimateLocationRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeOrigin) return;
    setRoutingResult(`Ditemukan rute tercepat: Dari "${routeOrigin}" ke "Gedung Nusa Presisi Thamrin" berjarak sekitar ${Math.round(Math.random() * 15 + 4)} KM. Estimasi perjalanan lancar: ${Math.round(Math.random() * 25 + 15)} Menit via Jl. Gatot Subroto.`);
  };

  // Helper to get the most frequently read category for the logged-in user
  const mostFrequentCategory = useMemo(() => {
    if (!currentUser) return null;
    try {
      const storageKey = `fakta_faktual_category_views_${currentUser.id}`;
      const viewsStr = localStorage.getItem(storageKey);
      if (!viewsStr) return null;
      const views: Record<string, number> = JSON.parse(viewsStr);
      let maxViews = 0;
      let favoriteCat: string | null = null;
      Object.entries(views).forEach(([cat, count]) => {
        if (count > maxViews) {
          maxViews = count;
          favoriteCat = cat;
        }
      });
      return favoriteCat;
    } catch {
      return null;
    }
  }, [currentUser, lastReadTrigger]);

  const handleClearReadingHistory = () => {
    if (!currentUser) return;
    try {
      const storageKey = `fakta_faktual_category_views_${currentUser.id}`;
      localStorage.removeItem(storageKey);
      setLastReadTrigger(prev => prev + 1);
      setAlertToast("Riwayat kategori berita untuk Anda berhasil dihapus.");
      setTimeout(() => setAlertToast(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Filter articles by Category
  const categoryArticles = useMemo(() => {
    return articles.filter(art => {
      if (selectedCategory === 'Semua') {
        return true;
      }
      if (selectedCategory === 'Berita untuk Anda') {
        if (mostFrequentCategory) {
          return art.category.toLowerCase() === mostFrequentCategory.toLowerCase();
        }
        return true;
      }
      return art.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [articles, selectedCategory, mostFrequentCategory]);

  // 2. Headline Article (Berita Utama) calculation
  const headlineArticle = useMemo(() => {
    const searchTerms = headlineSearch || searchQuery;
    const filtered = categoryArticles.filter(art => {
      if (!searchTerms) return true;
      return (
        art.title.toLowerCase().includes(searchTerms.toLowerCase()) || 
        art.summary.toLowerCase().includes(searchTerms.toLowerCase()) ||
        art.category.toLowerCase().includes(searchTerms.toLowerCase())
      );
    });
    return filtered.length > 0 ? filtered[0] : null;
  }, [categoryArticles, headlineSearch, searchQuery]);

  // 3. Server-side Pagination & Catalog states
  const itemsPerPage = 6;
  const [paginatedArticles, setPaginatedArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegularCount, setTotalRegularCount] = useState(0);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const categoryParam = selectedCategory === 'Berita untuk Anda'
          ? (mostFrequentCategory || '')
          : (selectedCategory === 'Semua' ? '' : selectedCategory);
        
        const searchParam = catalogSearch || searchQuery || '';
        const excludeId = headlineArticle ? headlineArticle.id : '';
        
        const url = `/api/articles?status=published&page=${currentPage}&limit=${itemsPerPage}&category=${encodeURIComponent(categoryParam)}&search=${encodeURIComponent(searchParam)}&excludeId=${encodeURIComponent(excludeId)}`;
        
        const res = await fetch(url);
        if (res.ok && active) {
          const data = await res.json();
          setPaginatedArticles(data.articles || []);
          setTotalPages(data.totalPages || 1);
          setTotalRegularCount(data.total || 0);
        }
      } catch (err) {
        console.error("Gagal memuat katalog berita dari server", err);
      } finally {
        if (active) {
          setLoadingCatalog(false);
        }
      }
    };

    fetchCatalog();
    return () => {
      active = false;
    };
  }, [currentPage, selectedCategory, catalogSearch, searchQuery, headlineArticle?.id, mostFrequentCategory, articles]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, catalogSearch, headlineSearch, searchQuery]);

  // Clamp current page if total pages decreases below currentPage
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Dynamic trending topics based on the actual articles array
  const trendingTopics = useMemo(() => {
    const topicsMap: Record<string, { keyword: string; category: string; views: number; count: number }> = {};

    articles.forEach(art => {
      if (art.seoKeywords && Array.isArray(art.seoKeywords)) {
        art.seoKeywords.forEach(kw => {
          if (kw && typeof kw === 'string' && kw.length > 3 && kw !== 'fakta aktual' && kw !== 'berita' && kw !== art.category.toLowerCase()) {
            const formattedKw = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const hashTag = `#${formattedKw.replace(/\s+/g, '')}`;
            if (!topicsMap[hashTag]) {
              topicsMap[hashTag] = { keyword: hashTag, category: art.category, views: 0, count: 0 };
            }
            topicsMap[hashTag].views += art.views || 0;
            topicsMap[hashTag].count += 1;
          }
        });
      }
    });

    let result = Object.values(topicsMap)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Fallbacks if not enough keywords are extracted
    const defaultTrending = [
      { keyword: "#HilirisasiNikel", category: "Ekonomi", views: 24500, count: 12 },
      { keyword: "#PialaAsiaGaruda", category: "Olahraga", views: 31200, count: 15 },
      { keyword: "#6GInovasiIoT", category: "Teknologi", views: 22100, count: 9 },
      { keyword: "#EkowisataKomodo", category: "Pariwisata", views: 15400, count: 7 },
      { keyword: "#TransisiEnergiBersih", category: "Politik", views: 18900, count: 8 },
    ];

    if (result.length < 5) {
      const existingKeywords = new Set(result.map(r => r.keyword.toLowerCase()));
      for (const def of defaultTrending) {
        if (!existingKeywords.has(def.keyword.toLowerCase())) {
          result.push(def);
          if (result.length >= 5) break;
        }
      }
    }

    return result.sort((a, b) => b.views - a.views);
  }, [articles]);

  const handleTrendingTopicClick = (topicKeyword: string) => {
    const cleanKeyword = topicKeyword.startsWith('#') ? topicKeyword.slice(1) : topicKeyword;
    let searchQueryTerm = cleanKeyword;
    const splitCamelCase = cleanKeyword.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    if (splitCamelCase !== cleanKeyword) {
      searchQueryTerm = splitCamelCase;
    }

    setSelectedCategory('Semua');
    setSearchQuery(searchQueryTerm);

    const element = document.getElementById('category-navigation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Nest-rendered components for different layout presets
  const renderCategoriesSlider = () => (
    <div className="relative flex items-center w-full gap-2 py-1">
      <button
        type="button"
        onClick={() => scrollCategories('left')}
        className={`p-2 rounded-lg transition-all focus:outline-none hover:scale-105 active:scale-95 cursor-pointer shadow-sm border shrink-0 ${
          darkMode 
            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Geser Kiri"
      >
        <ChevronLeft size={16} />
      </button>

      <div 
        id="category-navigation" 
        ref={categoryScrollRef}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 border-b border-slate-200 dark:border-neutral-800 scrollbar-none scroll-smooth"
      >
        {['Semua', ...(currentUser ? ['Berita untuk Anda'] : []), ...(websiteSettings.categories || ['Politik', 'Ekonomi', 'Teknologi', 'Pariwisata', 'Olahraga', 'Internasional', 'Hiburan', 'Kesehatan', 'Gaya Hidup', 'Edukasi', 'Otomotif', 'Opini', 'Nasional', 'Kriminal'])].map((cat) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded cursor-pointer shrink-0 transition-all ${
              selectedCategory === cat
                ? `${themeAccent.bg} text-white shadow`
                : darkMode 
                   ? 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white' 
                   : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollCategories('right')}
        className={`p-2 rounded-lg transition-all focus:outline-none hover:scale-105 active:scale-95 cursor-pointer shadow-sm border shrink-0 ${
          darkMode 
            ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Geser Kanan"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );

  const renderHeadlineSearch = () => (
    <div id="headline-search-container" className="pt-1.5 pb-1">
      <div className={`relative rounded-lg overflow-hidden shadow-sm border transition-all duration-200 ${
        darkMode ? 'bg-neutral-900 border-neutral-800 focus-within:border-blue-500' : 'bg-white border-slate-200 focus-within:border-blue-500'
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-3.5 w-3.5 ${darkMode ? 'text-neutral-500' : 'text-slate-405'}`} />
        </div>
        <input
          type="text"
          id="headline-search-input"
          value={headlineSearch}
          onChange={(e) => setHeadlineSearch(e.target.value)}
          placeholder="Cari berita utama terhangat saat ini..."
          className={`block w-full pl-9 pr-12 py-2 text-[11.5px] font-medium focus:ring-0 outline-none leading-relaxed bg-transparent ${
            darkMode ? 'text-white placeholder-neutral-500' : 'text-slate-800 placeholder-slate-400'
          }`}
        />
        {headlineSearch && (
          <button
            onClick={() => setHeadlineSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-tighter"
          >
            Batal
          </button>
        )}
      </div>
    </div>
  );

  const renderHeadlineHero = () => {
    if (!headlineArticle || selectedCategory !== 'Semua') return null;
    return (
      <div 
        id="breaking-headline-card" 
        onClick={() => setSelectedArticleId(headlineArticle.id)}
        className={`group relative rounded-xl h-[320px] sm:h-[400px] overflow-hidden border cursor-pointer shadow-lg transition-transform hover:scale-[1.006] ${
          darkMode ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-white'
        }`}
      >
        <ImageWithBlurPlaceholder 
          src={headlineArticle.imageUrl} 
          alt={headlineArticle.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <span className="absolute top-4 left-4 bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded animate-pulse">
          BREAKING NEWS
        </span>

        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`${themeAccent.bg} text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded`}>
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

          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
            {headlineArticle.title}
          </h2>

          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed max-w-3xl">
            {headlineArticle.summary}
          </p>

          <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-white/10 mt-2">
            <span>Oleh: <strong className="text-slate-100">{headlineArticle.authorName}</strong></span>
            <span className={`flex items-center gap-1 font-bold ${themeAccent.text} group-hover:translate-x-1 transition-transform`}>
              BACA ULASAN LENGKAP <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCatalogHeader = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2 border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <BookOpen size={16} className={`${themeAccent.text} animate-pulse`} />
        <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Katalog Berita Nasional
        </h3>
      </div>
      <span className={`text-[10px] font-mono ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
        Menampilkan {totalRegularCount} artikel terverifikasi
      </span>
    </div>
  );

  const renderCatalogSearch = () => (
    <div className={`relative rounded-lg overflow-hidden shadow-sm border transition-all duration-200 ${
      darkMode ? 'bg-neutral-900 border-neutral-800 focus-within:border-blue-500' : 'bg-white border-slate-200 focus-within:border-blue-500'
    }`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`h-3.5 w-3.5 ${darkMode ? 'text-neutral-500' : 'text-slate-405'}`} />
      </div>
      <input
        type="text"
        id="catalog-search-input"
        value={catalogSearch}
        onChange={(e) => setCatalogSearch(e.target.value)}
        placeholder="Saring atau cari artikel di dalam katalog berita..."
        className={`block w-full pl-9 pr-12 py-2 text-[11.5px] font-medium focus:ring-0 outline-none leading-relaxed bg-transparent ${
          darkMode ? 'text-white placeholder-neutral-500' : 'text-slate-800 placeholder-slate-400'
        }`}
      />
      {catalogSearch && (
        <button
          onClick={() => setCatalogSearch('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-tighter"
        >
          Batal
        </button>
      )}
    </div>
  );  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border ${
        darkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
          Menampilkan <strong className={darkMode ? 'text-white' : 'text-slate-700'}>{(currentPage - 1) * itemsPerPage + 1}</strong> s/d <strong className={darkMode ? 'text-white' : 'text-slate-700'}>{Math.min(currentPage * itemsPerPage, totalRegularCount)}</strong> dari <strong className={darkMode ? 'text-white' : 'text-slate-700'}>{totalRegularCount}</strong> berita
        </div>

        <div className="flex flex-wrap items-center gap-1.5 justify-center">
          {/* Previous Button */}
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1.5 px-2.5 rounded cursor-pointer transition-all border text-xs font-bold flex items-center gap-1 ${
              currentPage === 1
                ? 'opacity-40 cursor-not-allowed border-neutral-800 text-neutral-500 bg-transparent'
                : darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft size={13} />
            <span>Sebelum</span>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span key={pageNum} className={`px-1.5 text-xs font-bold ${darkMode ? 'text-neutral-600' : 'text-slate-400'}`}>...</span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`h-7 w-7 rounded cursor-pointer font-bold text-xs flex items-center justify-center transition-all ${
                  currentPage === pageNum
                    ? `${themeAccent.bg} text-white shadow`
                    : darkMode
                      ? 'bg-neutral-950 border border-neutral-850 hover:border-neutral-750 text-neutral-400'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-1.5 px-2.5 rounded cursor-pointer transition-all border text-xs font-bold flex items-center gap-1 ${
              currentPage === totalPages
                ? 'opacity-40 cursor-not-allowed border-neutral-800 text-neutral-500 bg-transparent'
                : darkMode
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Lanjut</span>
            <ChevronRight size={13} />
          </button>

          {/* Quick viewport direct scroll controls within the pagination area */}
          <div className="flex items-center gap-1 border-l pl-2 border-neutral-300/20 dark:border-neutral-800 ml-1">
            <button
              onClick={scrollToTop}
              title="Kembali ke Atas"
              className={`p-1.5 rounded cursor-pointer transition-all border text-xs font-bold flex items-center justify-center ${
                darkMode
                  ? 'bg-neutral-955 border-neutral-850 text-neutral-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUp size={13} className="text-blue-500" />
            </button>
            <button
              onClick={scrollToBottom}
              title="Lompat ke Bawah"
              className={`p-1.5 rounded cursor-pointer transition-all border text-xs font-bold flex items-center justify-center ${
                darkMode
                  ? 'bg-neutral-955 border-neutral-850 text-neutral-400 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowDown size={13} className="text-blue-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderArticlesGrid = (mode: 'classic' | 'editorial' | 'bento') => {
    if (loadingCatalog) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`p-4 rounded-xl border space-y-4 shadow-sm ${
              darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-slate-50/50 border-slate-200'
            }`}>
              {/* Shimmer on image skeleton */}
              <div className="h-40 rounded-lg shimmer-loader w-full opacity-90" />
              {/* Shimmer on text titles */}
              <div className="h-5 rounded shimmer-loader w-11/12 opacity-90" />
              <div className="h-4 rounded shimmer-loader w-2/3 opacity-80" />
              <div className="flex items-center gap-2 pt-1">
                <div className="h-6 w-6 rounded-full shimmer-loader opacity-80" />
                <div className="h-3 w-1/4 rounded shimmer-loader opacity-70" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (paginatedArticles.length === 0) {
      return (
        <div className={`text-center py-20 rounded-lg border ${
          darkMode ? 'bg-neutral-900/10 border-neutral-850' : 'bg-white border-slate-200'
        }`}>
          <BookOpen className="text-neutral-500 mx-auto mb-3" size={36} />
          <p className={`text-xs font-bold ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>Tidak ada publikasi berita nasional ditemukan di katalog berita.</p>
        </div>
      );
    }

    if (mode === 'editorial') {
      return (
        <div className="space-y-6">
          <div className="space-y-6">
            {paginatedArticles.map((art) => (
              <article 
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className={`p-3.5 sm:p-5 rounded-xl border flex flex-col md:flex-row gap-4 sm:gap-5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.008] ${
                  darkMode 
                    ? 'bg-neutral-900/50 border-neutral-800/85 hover:border-blue-500/30 hover:bg-neutral-900' 
                    : 'bg-white border-slate-150 hover:bg-slate-50/30 hover:border-blue-600/20'
                }`}
              >
                <div className="relative h-44 md:h-36 md:w-56 shrink-0 rounded overflow-hidden bg-neutral-900">
                  <ImageWithBlurPlaceholder 
                    src={art.imageUrl} 
                    alt={art.title} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-2.5 left-2.5 bg-neutral-950/80 ${themeAccent.text} text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-800`}>
                    {art.category}
                  </span>
                  {art.isPremium && (
                    <span className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                      PREMIUM
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold">
                      <span>Oleh: {art.authorName}</span>
                      <span>•</span>
                      <span>{new Date(art.publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    <h3 className={`font-serif font-black text-base tracking-tight leading-snug ${themeAccent.textHover} transition-colors line-clamp-2`}>
                      {art.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-405 mt-2">
                    <span>👁 {art.views} views</span>
                    <span className={`font-bold ${themeAccent.text} flex items-center gap-0.5`}>
                      BACA INVESTIGASI <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {renderPagination()}
        </div>
      );
    }

    if (mode === 'bento') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {paginatedArticles.map((art, index) => {
              const isLarge = index % 3 === 0;
              return (
                <article 
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-3.5 sm:p-5 rounded-xl border flex flex-col gap-3.5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isLarge ? 'md:col-span-4' : 'md:col-span-2'
                  } ${
                    darkMode 
                      ? 'bg-neutral-900/50 border-neutral-800/80 hover:border-blue-500/30 hover:bg-neutral-900' 
                      : 'bg-white border-slate-150 hover:bg-slate-50/25 hover:border-blue-600/20'
                  } ${
                    isLarge ? (darkMode ? 'bg-gradient-to-br from-neutral-900/80 to-blue-950/20 shadow-[0_0_20px_rgba(37,99,235,0.04)]' : 'bg-gradient-to-br from-white to-blue-50/30') : ''
                  }`}
                >
                  <div className={`relative rounded overflow-hidden bg-neutral-900 ${isLarge ? 'h-52' : 'h-36'}`}>
                    <ImageWithBlurPlaceholder 
                      src={art.imageUrl} 
                      alt={art.title} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-2.5 left-2.5 bg-neutral-950/80 ${themeAccent.text} text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-800`}>
                      {art.category}
                    </span>
                    {art.isPremium && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold">
                    <span>Oleh: {art.authorName}</span>
                    <span>•</span>
                    <span>{new Date(art.publishedAt).toLocaleDateString('id-ID')}</span>
                  </div>

                  <h3 className={`font-serif font-black tracking-tight leading-snug line-clamp-2 ${themeAccent.textHover} transition-colors ${
                    isLarge ? 'text-[15px]' : 'text-[12.5px]'
                  }`}>
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 mt-auto">
                    <span>👁 {art.views} views</span>
                    <span className={`font-bold ${themeAccent.text} flex items-center gap-0.5`}>
                      Buka Bento Cell <ArrowRight size={10} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
          {renderPagination()}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedArticles.map((art) => (
            <article 
              key={art.id}
              onClick={() => setSelectedArticleId(art.id)}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col gap-3.5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                darkMode 
                  ? 'bg-neutral-900/50 border-neutral-800/80 hover:border-blue-500/30 hover:bg-neutral-900' 
                  : 'bg-white border-slate-150 hover:bg-slate-50/25 hover:border-blue-600/20'
              }`}
            >
              <div className="relative h-44 rounded overflow-hidden bg-neutral-900">
                <ImageWithBlurPlaceholder 
                  src={art.imageUrl} 
                  alt={art.title} 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2.5 left-2.5 bg-neutral-950/80 ${themeAccent.text} text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-800`}>
                  {art.category}
                </span>
                {art.isPremium && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded shadow">
                    PREMIUM
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold">
                <span>Oleh: {art.authorName}</span>
                <span>•</span>
                <span>{new Date(art.publishedAt).toLocaleDateString('id-ID')}</span>
              </div>

              <h3 className={`font-serif font-black text-sm tracking-tight line-clamp-2 leading-snug ${themeAccent.textHover} transition-colors`}>
                {art.title}
              </h3>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {art.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 mt-auto">
                <span>👁 {art.views} views</span>
                <span className={`font-bold ${themeAccent.text} flex items-center gap-0.5`}>
                  Tinjau Berita <ArrowRight size={10} />
                </span>
              </div>
            </article>
          ))}
        </div>
        {renderPagination()}
      </div>
    );
  };

  const renderSidebarAd = () => {
    if (websiteSettings.adsenseClientId) {
      return (
        <div className="w-full h-72">
          <AdSenseBanner 
            id="sidebar-adsense-banner"
            client={websiteSettings.adsenseClientId}
            slot="sidebar-ad-slot"
            heightClass="h-72"
            fallbackImgUrl={websiteSettings.adsSidebar}
          />
        </div>
      );
    }
    if (!websiteSettings.adsSidebar) return null;
    return (
      <div id="ad-panel-sidebar" className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col gap-2 relative overflow-hidden h-72">
        <span className="absolute top-2 right-2 bg-black/60 text-[8px] font-black tracking-widest px-1 py-0.5 rounded text-neutral-400 select-none uppercase">ADVERTISEMENT</span>
        <img 
          src={websiteSettings.adsSidebar} 
          alt="Sidebar Promotion" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded opacity-90"
        />
      </div>
    );
  };

  const renderLiveStreamWidget = () => {
    if (!streamInfo) return null;
    return (
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
          <span className="truncate">{streamInfo.channelName}</span>
          <strong className="text-red-400">● {streamInfo.viewersCount.toLocaleString('id-ID')} VIEWERS</strong>
        </div>
      </div>
    );
  };

  const renderRegisterWidget = () => {
    if (currentUser) return null;
    return (
      <div className={`p-5 rounded-lg border shadow relative overflow-hidden group space-y-4 ${
        darkMode ? 'bg-gradient-to-br from-neutral-900 to-indigo-950/25 border-neutral-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="absolute -right-10 -bottom-10 h-24 w-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all"></div>
        
        <div className="flex items-center gap-2 border-b border-neutral-800/20 dark:border-neutral-850 pb-2">
          <span className={`p-1 rounded ${themeAccent.bgLight}`}>
            <Mail size={14} />
          </span>
          <h3 className="text-xs font-black uppercase tracking-widest leading-none">Aktivasi Akun Pembaca</h3>
        </div>

        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Daftar instan alamat Gmail Anda secara aman menggunakan Google SSO untuk menulis komentar warga tepercaya dan berlangganan laporan harian.
        </p>

        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { googleFlow: true } }));
          }}
          className={`w-full flex items-center justify-center gap-2.5 py-2.5 rounded ${themeAccent.bg} ${themeAccent.bgHover} text-white font-bold text-xs tracking-wide cursor-pointer transition-all active:scale-95 shadow-md hover:shadow-lg text-center`}
        >
          <svg className="h-4.5 w-4.5 shrink-0 bg-white p-0.5 rounded-full shadow" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" />
          </svg>
          <span>Mulai Daftar via Akun Gmail</span>
        </button>
      </div>
    );
  };

  const renderPremiumWidget = () => (
    <div className={`p-5 rounded-lg border shadow relative overflow-hidden ${
      darkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-slate-200'
    }`}>
      <div className="absolute -right-6 -bottom-6 h-28 w-28 bg-amber-500/10 rounded-full blur-xl"></div>
      
      <div className="flex items-center gap-2 mb-2 border-b border-neutral-800 pb-2">
        <span className="p-1 rounded bg-amber-500/10 text-amber-500">
          ★
        </span>
        <h3 className="text-xs font-black uppercase tracking-widest leading-none">Fakta Faktual Premium</h3>
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
              <div className="space-y-2 border-b border-dashed border-neutral-800 pb-2 mb-2">
                <input 
                  type="email" 
                  required 
                  placeholder="Alamat email Anda..." 
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="w-full text-xs p-2 rounded bg-black border border-neutral-700 text-white focus:outline-none"
                />
                <input 
                  type="text" 
                  required 
                  placeholder="16-Digit Nomor Kartu Debit/Kredit..." 
                  value={subCard}
                  onChange={(e) => setSubCard(e.target.value)}
                  className="w-full text-[11px] p-2 rounded bg-black border border-neutral-700 text-white focus:outline-none font-mono"
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
  );

  const renderTrendingWidget = () => (
    <div id="trending-topics-widget" className={`p-5 rounded-lg border shadow space-y-4 ${
      darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex items-center justify-between border-b pb-2 ${darkMode ? 'border-neutral-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <Flame className="text-orange-550 animate-pulse" size={16} />
          <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Trending Topik Terpopuler</h3>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp size={12} className="text-emerald-500" />
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Live</span>
        </div>
      </div>

      <p className={`text-[10.5px] leading-normal ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>
        Kumpulan tagar & topik berita terhangat yang paling banyak diperbincangkan dianalisis realtime melalui database Fakta Faktual.
      </p>

      <div className={`divide-y md:max-h-72 overflow-y-auto ${darkMode ? 'divide-neutral-800/65' : 'divide-slate-100'}`}>
        {trendingTopics.map((topic, i) => {
          const rankColors = [
            "from-orange-600 to-red-600 text-white border-red-500/30", // #1
            "from-amber-500 to-orange-500 text-white border-amber-500/20", // #2
            "from-blue-600 to-cyan-600 text-white border-blue-500/20",     // #3
            darkMode ? "from-neutral-800 to-neutral-700 text-neutral-300 border-neutral-750" : "from-slate-200 to-slate-150 text-slate-700 border-slate-250", // #4
            darkMode ? "from-neutral-850 to-neutral-800 text-neutral-450 border-neutral-800" : "from-slate-150 to-slate-100 text-slate-600 border-slate-200"  // #5
          ];
          
          return (
            <div 
              key={topic.keyword}
              onClick={() => handleTrendingTopicClick(topic.keyword)}
              className={`py-2.5 flex items-center justify-between gap-3 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`h-6 w-6 rounded-md bg-gradient-to-br flex items-center justify-center text-[11px] font-black tracking-tighter shadow-sm border ${rankColors[i] || 'from-neutral-800 to-neutral-700'}`}>
                  {i + 1}
                </div>
                
                <div className="truncate">
                  <span className={`text-[12px] font-bold transition-colors block truncate ${darkMode ? 'text-white group-hover:text-amber-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                    {topic.keyword}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-extrabold uppercase ${darkMode ? 'text-neutral-500' : 'text-slate-405'}`}>
                      {topic.category}
                    </span>
                    <span className={`h-1 w-1 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-slate-200'}`}></span>
                    <span className={`text-[9px] font-mono flex items-center gap-0.5 ${darkMode ? 'text-neutral-450' : 'text-slate-500'}`}>
                      <TrendingUp size={8} className="text-emerald-500 inline" /> {((topic.views || 1000) / 1000).toFixed(1)}K pembaca
                    </span>
                  </div>
                </div>
              </div>

              <div className={`shrink-0 flex items-center px-1.5 py-0.5 rounded border opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-[8px] font-extrabold ${themeAccent.text} uppercase tracking-tighter`}>CARI</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`pt-2 text-center text-[9px] flex items-center justify-center gap-1 border-t ${
        darkMode ? 'text-neutral-500 border-neutral-850/45' : 'text-slate-500 border-slate-100'
      }`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        Diperbarui otomatis secara realtime 60 detik sekali.
      </div>
    </div>
  );

  const renderNotificationWidget = () => (
    <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-neutral-300">
          <Bell size={14} className={`${themeAccent.text} animate-pulse`} />
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
  );

  const renderCompanyMapWidget = () => (
    <CompanyMapWidget 
      websiteSettings={websiteSettings} 
      themeAccent={themeAccent} 
      darkMode={darkMode} 
    />
  );

  const renderBeritaUntukAndaBanner = () => {
    if (selectedCategory !== 'Berita untuk Anda') return null;

    return (
      <div className={`p-4 rounded-lg border-2 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-300 shadow bg-gradient-to-r ${
        darkMode 
          ? 'from-blue-950/40 to-indigo-950/40 border-blue-900/60 text-white' 
          : 'from-blue-50/70 to-indigo-50/75 border-blue-200 text-slate-850'
      }`}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <span>Rekomendasi Pintar: Berita untuk Anda</span>
              <span className="bg-blue-600/20 text-blue-500 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">Beta AI</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-300">
              {mostFrequentCategory ? (
                <span>
                  Menyaring berita nasional berdasarkan kategori yang paling sering Anda baca saat log-in: <strong className={`text-xs uppercase px-2 py-0.5 rounded ml-1 font-extrabold ${themeAccent.bgLight}`}>{mostFrequentCategory}</strong>.
                </span>
              ) : (
                <span>
                  Belum ada statistik bacaan terdeteksi. Silakan klik & baca beberapa berita seputar <strong>Ekonomi, Politik, Pariwisata, atau Olahraga</strong> untuk mempersonalisasi konten Anda!
                </span>
              )}
            </p>
          </div>
        </div>
        {mostFrequentCategory && (
          <button
            onClick={handleClearReadingHistory}
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded border transition-all cursor-pointer ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-sm'
            }`}
          >
            Bersihkan Riwayat
          </button>
        )}
      </div>
    );
  };

  const renderMainStream = () => (
    <div className="space-y-6">
      {renderCategoriesSlider()}
      {renderHeadlineSearch()}
      {renderBeritaUntukAndaBanner()}
      {renderHeadlineHero()}
      {renderCatalogHeader()}
      {renderCatalogSearch()}
      {renderArticlesGrid(layoutPreset)}
    </div>
  );

  const renderSidebar = () => (
    <div className="space-y-6">
      {renderSidebarAd()}
      {renderLiveStreamWidget()}
      {renderRegisterWidget()}
      {renderPremiumWidget()}
      {renderTrendingWidget()}
      {renderNotificationWidget()}
      {renderCompanyMapWidget()}
    </div>
  );

  // Find viewed article context
  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const activeArticleComments = comments.filter(c => c.articleId === selectedArticleId && c.status === 'approved');

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-250 ${
        darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-800'
      }`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 rounded-full border-4 border-blue-500/20 animate-pulse" />
            <div className="relative h-12 w-12 rounded-full border-5 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <span className="text-xs uppercase font-black tracking-widest text-neutral-400 animate-pulse">
            Memuat Portal Berita...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-250 ${
      darkMode ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Floating Read Progress Line */}
      {selectedArticleId && (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-neutral-850/60 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
      
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
        articles={articles}
        onArticleSelect={(id) => {
          setActiveSection('home');
          setSelectedArticleId(id);
        }}
        onOpenAuth={(googleFlow) => {
          setIsGoogleFlow(googleFlow);
          setShowGoogleCustomForm(false);
          setGoogleErrorMessage('');
          setShowAuthModal(true);
        }}
        bookmarkedIds={bookmarkedIds}
        onRemoveBookmark={toggleBookmark}
      />

      {/* Floating System alerts toast */}
      {alertToast && (
        <div id="alert-system-toast" className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="text-emerald-500" size={18} />
          <span className="text-xs font-bold">{alertToast}</span>
        </div>
      )}

      {/* Primary Layout Frame */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-4 py-6">

        {/* Top AdSense Banner (Moved from Navbar) */}
        {websiteSettings.adsenseClientId ? (
          <div className="mb-6 w-full flex justify-center">
            <AdSenseBanner 
              id="top-adsense-banner"
              client={websiteSettings.adsenseClientId}
              slot="header-top-banner"
              heightClass="h-[90px] md:h-[120px]"
              fallbackImgUrl={websiteSettings.adsHeader}
            />
          </div>
        ) : (
          websiteSettings.adsHeader && (
            <div id="ad-header-top" className="mb-6 w-full h-[90px] md:h-[120px] rounded-xl overflow-hidden relative shadow border border-neutral-700/20 bg-neutral-900 flex items-center justify-center">
              <span className="absolute top-2 right-3 bg-black/60 text-[9px] font-black tracking-widest px-2 py-1 rounded text-neutral-400 select-none uppercase z-10">IKLAN PREMIUM</span>
              <img 
                src={websiteSettings.adsHeader} 
                alt="Ad Banner" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
              />
            </div>
          )
        )}

        {/* -------------------- 1. HOME VIEW PORTAL -------------------- */}
        {activeSection === 'home' && !selectedArticleId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full space-y-6"
          >
            {/* Classic Layout Preset */}
            {layoutPreset === 'classic' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Portal Column */}
                <div className="lg:col-span-8 space-y-6">
                  {renderMainStream()}
                </div>
                {/* Right Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">
                  {renderSidebar()}
                </div>
              </div>
            )}

            {/* Editorial Layout Preset */}
            {layoutPreset === 'editorial' && (
              <div className="space-y-12">
                {/* Minimalist Centered Editorial Sheet */}
                <div className="max-w-4xl mx-auto space-y-8">
                  {renderMainStream()}
                </div>
                {/* Divider */}
                <div className={`border-t border-dashed ${darkMode ? 'border-neutral-800' : 'border-slate-200'} pt-8`}>
                  <h3 className={`text-xs font-black uppercase tracking-widest text-center mb-6 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                    IKHTISAR PORTAL & LAYANAN WARGA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-6">
                      {renderLiveStreamWidget()}
                      {renderPremiumWidget()}
                    </div>
                    <div className="space-y-6">
                      {renderTrendingWidget()}
                      {renderNotificationWidget()}
                    </div>
                    <div className="space-y-6">
                      {renderRegisterWidget()}
                      {renderCompanyMapWidget()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bento Layout Preset */}
            {layoutPreset === 'bento' && (
              <div className="space-y-8">
                {/* Top row: Categories navigation and headline Hero banner */}
                <div className="space-y-6">
                  {renderCategoriesSlider()}
                  {renderHeadlineSearch()}
                  {renderHeadlineHero()}
                </div>

                {/* Main Interactive Bento Mesh layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left bento: Catalog stream & bento cards grid (8 columns) */}
                  <div className="lg:col-span-8 space-y-6">
                    {renderCatalogHeader()}
                    {renderCatalogSearch()}
                    {renderArticlesGrid('bento')}
                  </div>

                  {/* Right bento side panel (4 columns) */}
                  <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {renderLiveStreamWidget()}
                    {renderTrendingWidget()}
                    {renderPremiumWidget()}
                    {renderNotificationWidget()}
                    {renderRegisterWidget()}
                    {renderCompanyMapWidget()}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}


        {/* -------------------- 2. ARTICLE RETRIEVAL DETAILED VIEW -------------------- */}
        {selectedArticleId && selectedArticle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6 w-full"
          >
            
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
              <div className={`p-8 rounded-2xl border text-center flex flex-col items-center gap-4.5 transition-all ${
                darkMode 
                  ? 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-amber-955/10 border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] text-white' 
                  : 'bg-white border-amber-200 shadow-[0_4px_30px_rgba(245,158,11,0.06)] text-slate-800'
              }`}>
                <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/40 animate-pulse">
                  <Lock className="text-amber-500" size={32} />
                </div>
                <span className="bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  ★ BERITA AKTUAL EKKSKLUSIF
                </span>
                
                <h1 className={`text-2xl font-serif font-black tracking-tight max-w-xl ${darkMode ? 'text-amber-400' : 'text-slate-900'}`}>
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
              (() => {
                const rClasses = getReadingClasses();
                const fSizeClass = getFontSizeClass();
                return (
                  <div className={`p-4 sm:p-6 md:p-8 rounded-lg border shadow-xl flex flex-col gap-6 transition-colors duration-200 ${rClasses.wrapper} ${rClasses.border}`}>
                    
                    {/* Interactive Reading Mode Options Panel */}
                    <div className={`p-3.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${rClasses.commentBg} ${rClasses.border}`}>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                        <span className="font-bold uppercase tracking-wider">Opsi Kenyamanan Membaca :</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Theme Selection */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase opacity-80">Warna Latar:</span>
                          <div className="flex items-center gap-1 bg-black/10 p-0.5 rounded-md border border-neutral-700/20">
                            {(['default', 'light', 'dark', 'sepia'] as const).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setReadingTheme(t)}
                                className={`px-2.5 py-1 rounded-sm text-[10px] font-bold capitalize transition-all cursor-pointer ${
                                  readingTheme === t
                                    ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                              >
                                {t === 'default' ? 'Sistem' : t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font Size Selection */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase opacity-80">Ukuran Teks:</span>
                          <div className="flex items-center gap-1 bg-black/10 p-0.5 rounded-md border border-neutral-700/20">
                            {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setFontSize(sz)}
                                className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                  fontSize === sz
                                    ? 'bg-blue-600 text-white shadow-sm font-extrabold'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                              >
                                {sz === 'sm' ? 'A-' : sz === 'md' ? 'Asli' : sz === 'lg' ? 'A+' : 'A++'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* News Article Metadata Header */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-blue-600 text-white text-xs font-black uppercase px-2.5 py-0.5 rounded">
                          {selectedArticle.category}
                        </span>
                        <span className={`text-xs font-bold ${rClasses.meta}`}>
                          Dipublish: {new Date(selectedArticle.publishedAt).toLocaleDateString('id-ID')}
                        </span>
                        <span className={`text-xs font-bold flex items-center gap-1 ${rClasses.meta} hover:text-blue-400 transition-colors`}>
                          <Clock size={12} className="text-blue-500 animate-pulse" />
                          <span>⏱ {Math.max(1, Math.ceil(selectedArticle.content.split(/\s+/).filter(Boolean).length / 185))} Menit Baca</span>
                        </span>
                      </div>

                      <h1 className={`text-3xl md:text-4xl font-serif font-black leading-tight tracking-tight ${rClasses.title} mb-2`}>
                        {selectedArticle.title}
                      </h1>

                      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b ${rClasses.border} pb-4`}>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 font-black flex items-center justify-center text-xs">
                            {selectedArticle.authorName.charAt(0)}
                          </div>
                          <div className="text-xs">
                            <span className={`block font-bold ${rClasses.title}`}>{selectedArticle.authorName}</span>
                            <span className="block text-[10px] text-blue-500 uppercase font-black">{selectedArticle.authorRole}</span>
                          </div>
                        </div>

                        {/* Integrated dynamic social shares layout */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold ${rClasses.meta}`}>BAGIKAN KE:</span>
                          <button 
                            onClick={() => handleShareButton(selectedArticle.id, 'link')}
                            className="px-2 py-1.5 rounded bg-blue-950/20 hover:bg-blue-950/40 text-blue-400 border border-neutral-800 cursor-pointer flex items-center gap-1 text-[10px] font-black"
                            title="Salin Tautan Berita"
                          >
                            <Share2 size={12} className="text-blue-400 shrink-0" />
                            <span>COPAS</span>
                          </button>
                          <button 
                            onClick={() => handleShareButton(selectedArticle.id, 'whatsapp')}
                            className="px-2 py-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-450 border border-emerald-900/10 cursor-pointer flex items-center gap-1 text-[10px] font-black"
                            title="Bagikan ke WhatsApp"
                          >
                            <MessageCircle size={12} className="text-emerald-400 shrink-0" />
                            <span>WHATSAPP</span>
                          </button>
                          <button 
                            onClick={() => handleShareButton(selectedArticle.id, 'facebook')}
                            className="p-1.5 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-450 border border-blue-900/10 cursor-pointer"
                            title="Bagikan ke Facebook"
                          >
                            <Facebook size={12} />
                          </button>
                          <button 
                            onClick={() => handleShareButton(selectedArticle.id, 'twitter')}
                            className="p-1.5 rounded bg-sky-950/40 hover:bg-sky-900/60 text-sky-450 border border-sky-900/10 cursor-pointer"
                            title="Bagikan ke X"
                          >
                            <Twitter size={12} />
                          </button>

                          {/* Bookmark Toggle Button */}
                          <button 
                            onClick={() => toggleBookmark(selectedArticle.id)}
                            className={`px-2.5 py-1.5 rounded border cursor-pointer flex items-center gap-1 text-[10px] font-black transition-all ${
                              bookmarkedIds.includes(selectedArticle.id)
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 font-black'
                                : 'bg-neutral-900/40 hover:bg-neutral-850/60 text-neutral-300 border-neutral-800 hover:text-white'
                            }`}
                            title={bookmarkedIds.includes(selectedArticle.id) ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
                          >
                            <Bookmark 
                              size={11} 
                              className="shrink-0" 
                              fill={bookmarkedIds.includes(selectedArticle.id) ? "currentColor" : "none"} 
                            />
                            <span>{bookmarkedIds.includes(selectedArticle.id) ? 'TERSIMPAN' : 'BOOKMARK'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className={`w-full h-48 xs:h-64 sm:h-80 rounded-lg overflow-hidden border ${rClasses.border}`}>
                      <ImageWithBlurPlaceholder 
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

                     {/* Table of Contents (Daftar Isi) Component */}
                    {(() => {
                      const paragraphs = selectedArticle.content.split('\n\n');
                      const list: { id: string; text: string; level: number }[] = [];
                      
                      paragraphs.forEach((para, ind) => {
                        const trimmed = para.trim();
                        if (!trimmed) return;
                        
                        if (trimmed.startsWith('## ')) {
                          list.push({
                            text: trimmed.replace(/^##\s+/, '').replace(/\*+/g, '').trim(),
                            id: `heading-${ind}`,
                            level: 2
                          });
                        } else if (trimmed.startsWith('### ')) {
                          list.push({
                            text: trimmed.replace(/^###\s+/, '').replace(/\*+/g, '').trim(),
                            id: `heading-${ind}`,
                            level: 3
                          });
                        } else if (
                          trimmed.length < 80 && 
                          !trimmed.includes('\n') && 
                          !trimmed.endsWith('.') && 
                          !trimmed.endsWith('?') && 
                          !trimmed.endsWith('!') && 
                          (trimmed === trimmed.toUpperCase() || trimmed.startsWith('**') && trimmed.endsWith('**'))
                        ) {
                          list.push({
                            text: trimmed.replace(/\*+/g, '').trim(),
                            id: `heading-${ind}`,
                            level: 2
                          });
                        } else {
                          // Synthesized headings for standard pre-seeded articles
                          if (trimmed.startsWith('Dengan mengemukanya')) {
                            list.push({ text: 'Latar Belakang & Pendahuluan', id: `heading-sec-1`, level: 2 });
                          } else if (trimmed.startsWith('Jika ditilik lebih jauh')) {
                            list.push({ text: 'Tantangan & Perspektif Historis', id: `heading-sec-2`, level: 2 });
                          } else if (trimmed.startsWith('Menyikapi urgensi')) {
                            list.push({ text: 'Pandangan & Analisis Pakar', id: `heading-sec-3`, level: 2 });
                          } else if (trimmed.startsWith('Dari kacamata keberpihakan')) {
                            list.push({ text: 'Dampak Sosial & Multiplier Effect', id: `heading-sec-4`, level: 2 });
                          } else if (trimmed.startsWith('Peran teknologi')) {
                            list.push({ text: 'Peran Teknologi & Revolusi Digital', id: `heading-sec-5`, level: 2 });
                          } else if (trimmed.startsWith('Sebagai kesimpulan')) {
                            list.push({ text: 'Rekomendasi & Outlook Masa Depan', id: `heading-sec-6`, level: 2 });
                          }
                        }
                      });

                      if (list.length === 0) return null;

                      return (
                        <div className={`p-4 rounded-xl border transition-all duration-300 shadow-xs mb-6 ${
                          darkMode 
                            ? 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700/85 shadow-md shadow-neutral-950/20' 
                            : 'bg-slate-50/80 border-slate-200 hover:border-indigo-150 shadow-xs'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ListOrdered size={14} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                              <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wider ${rClasses.title}`}>
                                Daftar Isi Artikel
                              </span>
                            </div>
                            <button
                              onClick={() => setTocCollapsed(!tocCollapsed)}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                                darkMode 
                                  ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                              }`}
                            >
                              {tocCollapsed ? 'Tampilkan' : 'Sembunyikan'}
                            </button>
                          </div>

                          {!tocCollapsed && (
                            <ul className="mt-3.5 space-y-2 border-t pt-3.5 border-dashed border-neutral-800/20 dark:border-neutral-800/60">
                              {list.map((item, index) => (
                                <li 
                                  key={index}
                                  className={`${item.level === 3 ? 'pl-4 sm:pl-6 list-[circle] ml-2' : 'list-none'}`}
                                >
                                  <a
                                    href={`#${item.id}`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const el = document.getElementById(item.id);
                                      if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }}
                                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors duration-150 group cursor-pointer ${
                                      darkMode 
                                        ? 'text-neutral-400 hover:text-blue-400' 
                                        : 'text-slate-650 hover:text-indigo-600'
                                    }`}
                                  >
                                    {item.level === 2 && (
                                      <span className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-blue-500/50' : 'bg-indigo-600/50'} group-hover:scale-125 transition-transform shrink-0`}></span>
                                    )}
                                    <span className="underline decoration-dotted underline-offset-4 group-hover:underline-solid">
                                      {item.text}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })()}

                    {/* Main Article Content Text with Adaptive Styling */}
                    <div className={`leading-relaxed space-y-6 font-serif transition-all duration-200 ${rClasses.paragraph} ${fSizeClass}`}>
                      {(() => {
                        const paragraphs = selectedArticle.content.split('\n\n');
                        return paragraphs.map((para, ind) => {
                          const trimmed = para.trim();
                          if (!trimmed) return null;

                          // Check if paragraph is an inline image tag like ![Caption](url)
                          if (trimmed.startsWith('![') && trimmed.includes('](') && trimmed.endsWith(')')) {
                            const altStart = 2;
                            const altEnd = trimmed.indexOf('](');
                            const srcStart = altEnd + 2;
                            const srcEnd = trimmed.length - 1;
                            const alt = trimmed.slice(altStart, altEnd);
                            const src = trimmed.slice(srcStart, srcEnd);
                            
                            return (
                              <div key={ind} className="my-6 space-y-2 flex flex-col items-center">
                                <div className="relative w-full rounded-xl overflow-hidden shadow-md max-w-2xl bg-neutral-900/40 border dark:border-neutral-800 border-slate-100">
                                  <img 
                                    src={src} 
                                    alt={alt} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-auto max-h-[420px] object-cover mx-auto"
                                  />
                                </div>
                                {alt && (
                                  <span className={`text-[11px] font-semibold text-center font-sans tracking-wide max-w-lg italic px-4 ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>
                                    📸 Foto: {alt}
                                  </span>
                                )}
                              </div>
                            );
                          }
                          
                          // Determine if this paragraph is a heading or has an injected heading
                          let heading: { text: string; id: string; level: number } | null = null;
                          let isMarkDownHeading = false;

                          // Check explicit markdown headers
                          if (trimmed.startsWith('## ')) {
                            heading = {
                              text: trimmed.replace(/^##\s+/, '').replace(/\*+/g, '').trim(),
                              id: `heading-${ind}`,
                              level: 2
                            };
                            isMarkDownHeading = true;
                          } else if (trimmed.startsWith('### ')) {
                            heading = {
                              text: trimmed.replace(/^###\s+/, '').replace(/\*+/g, '').trim(),
                              id: `heading-${ind}`,
                              level: 3
                            };
                            isMarkDownHeading = true;
                          } else if (
                            trimmed.length < 80 && 
                            !trimmed.includes('\n') && 
                            !trimmed.endsWith('.') && 
                            !trimmed.endsWith('?') && 
                            !trimmed.endsWith('!') && 
                            (trimmed === trimmed.toUpperCase() || trimmed.startsWith('**') && trimmed.endsWith('**'))
                          ) {
                            heading = {
                              text: trimmed.replace(/\*+/g, '').trim(),
                              id: `heading-${ind}`,
                              level: 2
                            };
                            isMarkDownHeading = true;
                          } else {
                            // Synthesized headings for standard pre-seeded articles
                            if (trimmed.startsWith('Dengan mengemukanya')) {
                              heading = { text: '1. LATAR BELAKANG DAN PENDAHULUAN', id: `heading-sec-1`, level: 2 };
                            } else if (trimmed.startsWith('Jika ditilik lebih jauh')) {
                              heading = { text: '2. TANTANGAN DAN PERSPEKTIF HISTORIS', id: `heading-sec-2`, level: 2 };
                            } else if (trimmed.startsWith('Menyikapi urgensi')) {
                              heading = { text: '3. PANDANGAN DAN ANALISIS PAKAR', id: `heading-sec-3`, level: 2 };
                            } else if (trimmed.startsWith('Dari kacamata keberpihakan')) {
                              heading = { text: '4. DAMPAK SOSIAL DAN MULTIPLIER EFFECT', id: `heading-sec-4`, level: 2 };
                            } else if (trimmed.startsWith('Peran teknologi')) {
                              heading = { text: '5. PERAN TEKNOLOGI DAN REVOLUSI DIGITAL', id: `heading-sec-5`, level: 2 };
                            } else if (trimmed.startsWith('Sebagai kesimpulan')) {
                              heading = { text: '6. REKOMENDASI DAN OUTLOOK MASA DEPAN', id: `heading-sec-6`, level: 2 };
                            }
                          }

                          if (isMarkDownHeading) {
                            // Render parsed heading directly
                            if (heading!.level === 2) {
                              return (
                                <h2 
                                  key={ind} 
                                  id={heading!.id} 
                                  className={`text-xl sm:text-2xl font-black mt-8 mb-4 border-b pb-1.5 scroll-mt-24 ${darkMode ? 'text-white border-neutral-800' : 'text-neutral-900 border-slate-200'}`}
                                >
                                  {heading!.text}
                                </h2>
                              );
                            } else {
                              return (
                                <h3 
                                  key={ind} 
                                  id={heading!.id} 
                                  className={`text-lg sm:text-xl font-bold mt-6 mb-3 scroll-mt-24 ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}
                                >
                                  {heading!.text}
                                </h3>
                              );
                            }
                          }

                          // If we have an injected heading, render it and then the paragraph
                          if (heading) {
                            return (
                              <section key={ind} className="space-y-3.5 pt-2">
                                <h2 
                                  id={heading.id} 
                                  className={`text-sm sm:text-base font-black uppercase tracking-wider mt-6 mb-3 border-l-4 pl-3 scroll-mt-24 ${darkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-600'}`}
                                >
                                  {heading.text}
                                </h2>
                                <p className="indent-6 leading-relaxed text-justify">{para}</p>
                              </section>
                            );
                          }

                          return <p key={ind} className="indent-6 leading-relaxed text-justify">{para}</p>;
                        });
                      })()}
                    </div>

                    {/* Interactive Reader Reactions Panel (QC Premium Recommendation) */}
                    {(() => {
                      const articleReacts = getArticleReactions(selectedArticle.id);
                      const activeReact = userReactions[selectedArticle.id];
                      return (
                        <div className={`p-4 sm:p-5 rounded-lg border my-6 space-y-4 ${rClasses.commentBg} ${rClasses.border} shadow-sm`}>
                          <div className="flex flex-col gap-1 text-left">
                            <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">RESPONS PUBLIK</span>
                            <h4 className={`text-sm font-black ${rClasses.title}`}>Bagaimana tanggapan Anda terhadap berita ini?</h4>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3.5">
                            {[
                              { type: 'informatif', label: 'Informatif', icon: ThumbsUp, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' },
                              { type: 'kaget', label: 'Kaget', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20' },
                              { type: 'faktual', label: 'Faktual', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' },
                              { type: 'inspiratif', label: 'Inspiratif', icon: Flame, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' },
                              { type: 'prihatin', label: 'Prihatin', icon: Frown, color: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20 hover:bg-neutral-500/20' }
                            ].map((item) => {
                              const isSelected = activeReact === item.type;
                              return (
                                <button
                                  key={item.type}
                                  onClick={() => handleReact(selectedArticle.id, item.type)}
                                  className={`relative overflow-visible p-2.5 rounded-lg border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-95 ${
                                    isSelected 
                                      ? 'border-blue-500 bg-blue-500/15 shadow-sm text-blue-400 ring-2 ring-blue-500/30 font-black' 
                                      : `${item.color} ${rClasses.title} border-transparent`
                                  }`}
                                >
                                  {/* Heart-pop Particles Animation Channel */}
                                  <AnimatePresence>
                                    {reactionPops
                                      .filter(p => p.type === item.type)
                                      .map(p => {
                                        const rad = (p.angle * Math.PI) / 180;
                                        const tx = Math.cos(rad) * p.distance;
                                        const ty = Math.sin(rad) * p.distance - 20; // float slightly upwards
                                        
                                        return (
                                          <motion.div
                                            key={p.id}
                                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                            animate={{
                                              x: tx,
                                              y: ty,
                                              scale: [0, 1.3, 1, 0],
                                              opacity: [1, 1, 0.7, 0],
                                              rotate: [0, p.angle / 1.5]
                                            }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                              duration: 0.9,
                                              ease: "easeOut",
                                              delay: p.delay
                                            }}
                                            className="absolute pointer-events-none z-50 flex items-center justify-center"
                                            style={{ left: '50%', top: '50%' }}
                                          >
                                            <Heart 
                                              size={p.size} 
                                              className="text-rose-500 fill-rose-500 drop-shadow-[0_2px_6px_rgba(244,63,94,0.6)]" 
                                            />
                                          </motion.div>
                                        );
                                      })}
                                  </AnimatePresence>

                                  <item.icon 
                                    size={16} 
                                    className={`shrink-0 transition-transform duration-300 ${isSelected ? 'scale-110 rotate-3 animate-bounce' : ''}`}
                                    fill={isSelected ? 'currentColor' : 'none'}
                                  />
                                  <span className="text-[10px] sm:text-[11px] font-extrabold tracking-tight line-clamp-1 truncate">{item.label}</span>
                                  <span className="text-[10px] font-black text-neutral-400 font-mono mt-0.5">
                                    {(articleReacts as any)[item.type] || 0}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* End of article advertising spaces block */}
                    {websiteSettings.adsenseClientId ? (
                      <div className="w-full h-24 my-4">
                        <AdSenseBanner 
                          id="bottom-adsense-banner"
                          client={websiteSettings.adsenseClientId}
                          slot="article-bottom-slot"
                          heightClass="h-24"
                          fallbackImgUrl={websiteSettings.adsArticleBottom}
                        />
                      </div>
                    ) : (
                      websiteSettings.adsArticleBottom && (
                        <div id="ad-article-bottom" className={`w-full h-24 rounded relative overflow-hidden flex items-center justify-center my-4 border ${rClasses.border}`}>
                          <span className="absolute top-1 right-2 bg-black/60 text-[8px] font-black tracking-widest px-1 py-0.5 rounded text-neutral-400 select-none uppercase">ADVERTISEMENT</span>
                          <img 
                            src={websiteSettings.adsArticleBottom} 
                            alt="Bottom Banner Ad" 
                            className="w-full h-full object-cover opacity-85"
                          />
                        </div>
                      )
                    )}

                    {/* Related Articles (Berita Terkait) Segment */}
                    <div className={`border-t ${rClasses.border} pt-6 space-y-4`}>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className={darkMode ? "text-blue-400" : "text-blue-500"} />
                        <h3 className={`text-sm font-black uppercase tracking-wider ${rClasses.title}`}>
                          Berita Terkait
                        </h3>
                      </div>

                      {(() => {
                        const related = articles.filter(art => 
                          art.category.toLowerCase() === selectedArticle.category.toLowerCase() && 
                          art.id !== selectedArticle.id && 
                          art.status === 'published'
                        ).slice(0, 3);

                        if (related.length === 0) {
                          return (
                            <p className={`text-xs italic ${rClasses.meta}`}>Tidak ada berita terkait lainnya di kategori ini.</p>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {related.map((art) => (
                              <div
                                key={art.id}
                                onClick={() => {
                                  setSelectedArticleId(art.id);
                                  scrollToTop();
                                }}
                                className={`group flex sm:flex-col items-start gap-3 p-2.5 rounded-lg border cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ${rClasses.commentBg} ${rClasses.border}`}
                              >
                                <div className="relative w-20 h-20 sm:w-full sm:h-28 rounded-md overflow-hidden bg-neutral-900 shrink-0">
                                  <img 
                                    src={art.imageUrl} 
                                    alt={art.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                  />
                                </div>
                                <div className="space-y-1.5 flex-1 w-full min-w-0">
                                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${rClasses.label || 'bg-blue-600/10 text-blue-500 border border-blue-500/20'}`}>
                                    {art.category}
                                  </span>
                                  <h4 className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-2 uppercase tracking-tight group-hover:text-blue-500 transition-colors ${rClasses.title}`}>
                                    {art.title}
                                  </h4>
                                  <p className={`text-[10px] ${rClasses.meta} flex items-center gap-1`}>
                                    <span>{new Date(art.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                    <span>•</span>
                                    <span>{art.views.toLocaleString('id-ID')} views</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Comments box region */}
                    <div className={`border-t ${rClasses.border} pt-6 space-y-4`}>
                      <h3 className={`text-sm font-black uppercase tracking-wider ${rClasses.title} flex items-center gap-2`}>
                        <MessageSquare size={16} />
                        <span>Kolom Opini Pembaca ({activeArticleComments.length})</span>
                      </h3>

                      {/* Comments lists display */}
                      <div className="space-y-3.5">
                        {activeArticleComments.length === 0 ? (
                          <p className={`text-xs italic ${rClasses.meta}`}>Belum ada opini publik disetujui. Tulis opini pertama Anda di bawah.</p>
                        ) : (
                          activeArticleComments.map((com) => (
                            <div key={com.id} className={`p-3.5 rounded border flex flex-col gap-1 text-xs ${rClasses.commentBg} ${rClasses.border}`}>
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className={`font-bold ${rClasses.title}`}>{com.authorName}</span>
                                <span className={rClasses.meta}>{new Date(com.createdAt).toLocaleDateString('id-ID')}</span>
                              </div>
                              <p className={`italic ${rClasses.paragraph}`}>"{com.content}"</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Submission comments form */}
                      <form onSubmit={(e) => handleAddComment(e, selectedArticle.id)} className={`p-4 rounded-lg border space-y-3 mt-4 ${rClasses.commentBg} ${rClasses.border}`}>
                        <h4 className="text-xs font-bold text-blue-500 uppercase">Salurkan Tanggapan Anda</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-[9px] uppercase tracking-wider font-bold mb-1 ${rClasses.meta}`}>Nama Lengkap</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="Nama panggilan harian..." 
                              value={newCommentName}
                              onChange={(e) => setNewCommentName(e.target.value)}
                              className={`w-full text-xs p-2 rounded focus:outline-none border ${rClasses.inputBg} focus:border-blue-500`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[9px] uppercase tracking-wider font-bold mb-1 ${rClasses.meta}`}>Email Anda (Tidak dipublikasikan)</label>
                            <input 
                              type="email" 
                              placeholder="pembaca@test.com" 
                              disabled={!!currentUser}
                              value={currentUser ? currentUser.email : ''}
                              className={`w-full text-xs p-2 rounded focus:outline-none border ${rClasses.inputBg} focus:border-blue-500 opacity-80`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-[9px] uppercase tracking-wider font-bold mb-1 ${rClasses.meta}`}>Isi Opini</label>
                          <textarea 
                            rows={3} 
                            required 
                            placeholder="Ketikan opini cerdas Anda mengenai tulisan ini..." 
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className={`w-full text-xs p-2 rounded focus:outline-none border ${rClasses.inputBg} focus:border-blue-500`}
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
                );
              })()
            )}

          </motion.div>
        )}


        {/* -------------------- 3. TV LIVE STREAMING FULL VIEW -------------------- */}
        {activeSection === 'livestream' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-5xl mx-auto space-y-6 w-full"
          >
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
                    (() => {
                      const ytId = websiteSettings.youtubeStreamId || streamInfo?.youtubeStreamId;
                      const channelId = websiteSettings.youtubeChannelId || streamInfo?.youtubeChannelId;
                      
                      if (ytId || channelId) {
                        const embedUrl = ytId 
                          ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&rel=0`
                          : `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&rel=0`;
                          
                        return (
                          <iframe
                            id="yt-live-frame"
                            src={embedUrl}
                            title="YouTube Live Stream"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        );
                      }
                      
                      return (
                        <video 
                          src={streamInfo?.streamUrl} 
                          autoPlay 
                          loop 
                          muted 
                          controls
                          className="w-full h-full object-cover"
                        />
                      );
                    })()
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
          </motion.div>
        )}


        {/* -------------------- 4. SUSUNAN REDAKSI COMPREHENSIVE VIEW -------------------- */}
        {activeSection === 'redaksi' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6 w-full"
          >
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
          </motion.div>
        )}


        {/* -------------------- 5. PROFIL PERUSAHAAN COMPLETE VIEW -------------------- */}
        {activeSection === 'profil' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6 w-full"
          >
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
              <div className="lg:col-span-5">
                <CompanyMapWidget 
                  websiteSettings={websiteSettings} 
                  themeAccent={themeAccent} 
                  darkMode={darkMode} 
                />
              </div>

            </div>
          </motion.div>
        )}


        {/* -------------------- 6. WRITER REDAKSI STUDIO PANEL (Restricted) -------------------- */}
        {activeSection === 'jurnalis' && currentUser && ['journalist', 'contributor', 'editor', 'admin'].includes(currentUser.role) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <WriterStudio
              darkMode={darkMode}
              currentUser={currentUser}
              articles={articles}
              onArticleChange={loadPortalData}
              websiteSettings={websiteSettings}
            />
          </motion.div>
        )}


        {/* -------------------- 7. GENERAL ADMIN SETTINGS & MODERATION (Restricted) -------------------- */}
        {activeSection === 'admin' && currentUser && currentUser.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            <AdminPanel
              darkMode={darkMode}
              websiteSettings={websiteSettings}
              onSettingsChange={(newSet) => setWebsiteSettings(newSet)}
              editorialTeam={editorialTeam}
              onEditorialChange={loadPortalData}
              comments={comments}
              onCommentsChange={loadPortalData}
              currentUser={currentUser}
            />
          </motion.div>
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

      {/* Quick Role-based Login Modal */}
      {showAuthModal && (
        <div id="auth-modal" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-4">
          <div className={`my-auto p-6 rounded-lg w-full max-w-md shadow-2xl relative border ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <button 
              id="auth-modal-close"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-extrabold text-lg select-none cursor-pointer"
            >
              ✕
            </button>

            {isGoogleFlow ? (
              /* GMAIL / GOOGLE SIGN-IN OR REGISTRATION FLOW */
              <div className="space-y-4">
                <div className="flex flex-col items-center text-center">
                  {/* Google SVG Logo */}
                  <svg className="h-7 w-7 mb-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" />
                  </svg>
                  <h3 className="text-base font-black tracking-tight">Pilih Akun Gmail</h3>
                  <p className="text-[11px] text-neutral-450 dark:text-neutral-400">untuk masuk atau mendaftar ke portal Fakta Faktual</p>
                </div>

                {googleErrorMessage && (
                  <div className="p-2.5 bg-red-950/45 border border-red-800 text-red-350 font-bold rounded text-[10px] text-center animate-shake">
                    {googleErrorMessage}
                  </div>
                )}

                {!showGoogleCustomForm ? (
                  <div className="space-y-2.5">
                    {/* Primary/Suggested Google Account (User of the app) */}
                    <button
                      type="button"
                      onClick={() => handleSelectGoogleAccount("angganovliantaST@gmail.com", "Angga Novlianta")}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-700/60 bg-neutral-950 hover:bg-neutral-900 text-left transition-all group cursor-pointer"
                    >
                      <div className="h-9 w-9 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 text-xs shrink-0 select-none">
                        AN
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-neutral-100 group-hover:text-blue-400 truncate transition-colors">Angga Novlianta</div>
                        <div className="text-[10px] text-neutral-400 truncate">angganovliantaST@gmail.com</div>
                      </div>
                      <div className="text-[10px] font-bold text-blue-400 transition shrink-0 bg-blue-950/50 border border-blue-900/60 px-2 py-0.5 rounded">
                        Google SSO
                      </div>
                    </button>

                    {/* Use Another Account Button */}
                    <button
                      type="button"
                      onClick={() => setShowGoogleCustomForm(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-neutral-750 bg-neutral-950/40 hover:bg-neutral-900/60 text-left transition-all group cursor-pointer"
                    >
                      <div className="h-9 w-9 rounded-full bg-neutral-850 border border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0 select-none">
                        <Plus size={15} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-neutral-200 group-hover:text-blue-400 transition-colors">Daftarkan Akun Gmail Baru</div>
                        <div className="text-[9px] text-neutral-400">Gunakan alamat Gmail kustom Anda secara instan</div>
                      </div>
                    </button>

                    <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsGoogleFlow(false)}
                        className="text-[10px] font-black text-neutral-400 hover:text-white uppercase flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <ArrowLeft size={11} className="text-neutral-500" />
                        <span>Metode Sandi</span>
                      </button>
                      <span className="text-[9px] text-neutral-500 dark:text-neutral-600 italic">Google Accounts Verification</span>
                    </div>
                  </div>
                ) : (
                  /* CUSTOM GMAIL REGISTRATION FORM */
                  <form onSubmit={handleCustomGoogleRegister} className="space-y-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Nama Lengkap Pendiri</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-2.5 text-neutral-500 pointer-events-none">
                          <UserIcon size={12} />
                        </div>
                        <input
                          type="text"
                          required
                          value={googleCustomName}
                          onChange={(e) => setGoogleCustomName(e.target.value)}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full text-xs pl-8 pr-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Surel Gmail Anda (@gmail.com)</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-2.5 text-neutral-500 pointer-events-none">
                          <Mail size={12} />
                        </div>
                        <input
                          type="email"
                          required
                          value={googleCustomEmail}
                          onChange={(e) => setGoogleCustomEmail(e.target.value)}
                          placeholder="namapengguna@gmail.com"
                          className="w-full text-xs pl-8 pr-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500 mt-1.5 leading-relaxed">
                        Sistem simulasi verifikasi & Firestore akan langsung mendaftarkan data Gmail Anda sebagai pembaca standard.
                      </p>
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setGoogleErrorMessage('');
                          setShowGoogleCustomForm(false);
                        }}
                        className="flex-1 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs cursor-pointer text-center transition"
                      >
                        KEMBALI
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide cursor-pointer transition"
                      >
                        DAFTAR & MASUK
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black text-center tracking-tight mb-2">Akses Portal Berita Fakta Faktual</h3>
                <p className="text-xs text-neutral-400 text-center mb-5">Masuk menggunakan Akun Redaksi, Pengguna Baru, atau Google SSO</p>

                {/* Google Sign-In Button */}
                <button
                  id="btn-google-sign-in"
                  onClick={handleGoogleSignIn}
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 border border-neutral-700/50 hover:border-neutral-500 rounded bg-neutral-950 font-bold text-xs cursor-pointer text-white hover:bg-black transition-all mb-4 active:scale-95 shadow"
                >
                  {/* Google SVG Logo representation */}
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.597 1.25 15.69 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
                  </svg>
                  <span>Masuk / Daftar via Gmail</span>
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-neutral-800"></div>
                  <span className="px-3 text-[10px] uppercase font-bold text-neutral-500">Kredensial Pengguna</span>
                  <div className="flex-1 border-t border-neutral-800"></div>
                </div>

                <form onSubmit={handleManualLogin} className="space-y-3">
                  {authErrorMessage && (
                    <div id="auth-error-msg" className="p-2.5 bg-red-950/45 border border-red-800 text-red-350 font-bold rounded text-[10px] text-center animate-shake">
                      {authErrorMessage}
                    </div>
                  )}
                  {isRegistering && (
                    <>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Nama Lengkap</label>
                        <input
                          id="reg-name-input"
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Nama lengkap sesuai KTP"
                          className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Foto Profil (Unggah Foto)</label>
                        <div className="flex items-center gap-2.5 mt-1 bg-black/40 p-2.5 rounded border border-neutral-800">
                          {avatarPreview ? (
                            <img 
                              src={avatarPreview} 
                              alt="Preview" 
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 rounded-full object-cover border border-blue-600/60 ring-2 ring-blue-600/20"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 text-[10px] font-black uppercase tracking-tight">
                              Kosong
                            </div>
                          )}
                          <div className="flex-1">
                            <input
                              id="reg-avatar-input"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="block w-full text-[11px] text-neutral-400 file:mr-2.5 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                            />
                            <p className="text-[9px] text-neutral-500 mt-1">Format JPG, PNG, atau WEBP (Maksimal 2MB)</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                     <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Surel / Email</label>
                    <input
                      id="auth-email-input"
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@faktafaktual.id"
                      className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Kata Sandi (Password)</label>
                    <input
                      id="auth-password-input"
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  {isRegistering && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Tingkat Hak Akses</label>
                      <select
                        id="reg-role-select"
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="user">Pembaca Terdaftar (Akses Standard)</option>
                        <option value="contributor">Kontributor / Wartawan Lepas</option>
                      </select>
                    </div>
                  )}

                  <button
                    id="btn-manual-auth-submit"
                    type="submit"
                    className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 font-bold text-xs tracking-wide text-white transition-all cursor-pointer"
                  >
                    {isRegistering ? 'DAFTAR SEKARANG' : 'MASUK KE PORTAL'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    id="toggle-register-btn"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {isRegistering ? 'Sudah memiliki akun? Masuk' : 'Belum punya akun? Buat akun sekarang'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Scroll ke Atas & Bawah Controls */}
      <div className="fixed bottom-6 right-8 z-40 flex flex-col gap-2">
        <button
          onClick={scrollToTop}
          title="Ke Atas Sekali"
          className={`p-2.5 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
            darkMode
              ? 'bg-neutral-900/95 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 shadow-md'
          }`}
          aria-label="Scroll ke Atas"
        >
          <ArrowUp size={15} />
        </button>
        <button
          onClick={scrollToBottom}
          title="Ke Bawah Sekali"
          className={`p-2.5 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
            darkMode
              ? 'bg-neutral-900/95 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              : 'bg-white/95 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 shadow-md'
          }`}
          aria-label="Scroll ke Bawah"
        >
          <ArrowDown size={15} />
        </button>
      </div>

    </div>
  );
}
