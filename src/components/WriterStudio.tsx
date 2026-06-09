import React, { useState, useEffect, useRef } from 'react';
import { PenTool, BarChart3, TrendingUp, Sparkles, RefreshCw, Layers, Calendar, Lock, CheckCircle, Trash2, Eye, ShieldAlert, Check, Upload, FileImage, X, Search, Image, Plus, Link } from 'lucide-react';
import { User, Article, WebSettings, AuthorAnalytics } from '../types';
import { ImageWithBlurPlaceholder } from './ImageWithBlurPlaceholder';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Helper function to compress large uploaded images to lightweight base64 format with automatic WebP conversion
const compressImage = (file: File, maxWidth = 1100, maxHeight = 800, quality = 0.70): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Scale proportionally if image is exceeding our high-fidelity layout benchmarks
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const bestRatio = Math.min(widthRatio, heightRatio);
          width = Math.round(width * bestRatio);
          height = Math.round(height * bestRatio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: event.target?.result as string,
            originalSize: file.size,
            compressedSize: file.size
          });
          return;
        }

        // Apply clean anti-alias parameters
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Dynamic conversion: Attempt WebP (native compression, up to 30% smaller than JPG), fallback to classic JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (dataUrl.indexOf('image/webp') === -1) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Calculate size of base64 data URL
        const base64Content = dataUrl.split(',')[1] || '';
        const compressedSize = Math.round((base64Content.length * 3) / 4);

        resolve({
          dataUrl,
          originalSize: file.size,
          compressedSize
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface WriterStudioProps {
  darkMode: boolean;
  currentUser: User;
  articles: Article[];
  onArticleChange: () => void;
  websiteSettings: WebSettings;
}

export default function WriterStudio({
  darkMode,
  currentUser,
  articles,
  onArticleChange,
  websiteSettings,
}: WriterStudioProps) {
  // Navigation tabs inside Writer Studio
  const [studioTab, setStudioTab] = useState<'analytics' | 'write' | 'articles'>('analytics');

  // Screen size detection for responsive maps/charts
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search state for Katalog Berita
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');

  // Reviewer Mode state
  const isReviewer = ['editor', 'admin'].includes(currentUser.role);
  const [showAllPortalArticles, setShowAllPortalArticles] = useState(isReviewer);

  // Preserve original author when Editor/Admin is editing a journalist's story
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null);
  const [originalAuthorName, setOriginalAuthorName] = useState<string | null>(null);
  const [originalAuthorRole, setOriginalAuthorRole] = useState<string | null>(null);

  // New/Edit Article Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [confirmDeleteArticleId, setConfirmDeleteArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Teknologi');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80');
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>('published');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 16));
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Refs and States for Inline Content Images
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inlineImages, setInlineImages] = useState<{ id: string; url: string; caption: string }[]>([]);
  const [inlineCaption, setInlineCaption] = useState('');
  const [insertingInlineImage, setInsertingInlineImage] = useState(false);
  const [inlineUrlInput, setInlineUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const insertAtCursor = (url: string, captionStr: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const insertText = `\n\n![${captionStr}](${url})\n\n`;
      setContent(before + insertText + after);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + insertText.length, start + insertText.length);
      }, 50);
    } else {
      setContent(prev => prev + `\n\n![${captionStr}](${url})\n\n`);
    }
  };

  const handleInsertInlineImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInsertingInlineImage(true);
    try {
      // Compress with slightly smaller dimensions than hero illustration to maintain great applet performance
      const result = await compressImage(file, 900, 600, 0.70);
      const caption = inlineCaption.trim() || file.name.split('.')[0] || 'Foto Dokumentasi';
      
      insertAtCursor(result.dataUrl, caption);
      
      setInlineImages(prev => [
        ...prev,
        { id: `inline-${Date.now()}`, url: result.dataUrl, caption }
      ]);
      setInlineCaption('');
      setInlineUrlInput('');
    } catch (err) {
      console.error("Gagal mengompresi gambar sisipan:", err);
      alert("Gagal mengolah file gambar sisipan.");
    } finally {
      setInsertingInlineImage(false);
    }
  };

  const handleInsertInlineUrl = () => {
    if (!inlineUrlInput.trim()) {
      alert("Masukkan URL gambar eksternal yang ingin disematkan.");
      return;
    }
    const caption = inlineCaption.trim() || 'Foto Dokumentasi';
    insertAtCursor(inlineUrlInput.trim(), caption);
    
    setInlineImages(prev => [
      ...prev,
      { id: `inline-${Date.now()}`, url: inlineUrlInput.trim(), caption }
    ]);
    setInlineCaption('');
    setInlineUrlInput('');
    setShowUrlField(false);
  };

  // Smart upload and compression states
  const [compressingImage, setCompressingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionMetrics, setCompressionMetrics] = useState<{ original: string; compressed: string; savings?: string | null } | null>(null);
  
  // Automated SEO settings
  const [autoSeoEnabled, setAutoSeoEnabled] = useState(true);

  // AI Loaders
  const [aiLoadingSeo, setAiLoadingSeo] = useState(false);
  const [aiLoadingProofread, setAiLoadingProofread] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Writer Analytics State
  const [analytics, setAnalytics] = useState<AuthorAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/analytics/${currentUser.id}`);
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const data = await res.json();
        setAnalytics(data);
      } else {
        console.warn(`Gagal memuat analitik jurnalis: response status ${res.status}`);
      }
    } catch (e) {
      console.error("Gagal memuat analitik jurnalis", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Periodically poll for views and performance metrics every 25 seconds (real-time stream simulation)
    const intervalId = setInterval(() => {
      fetchAnalytics();
    }, 25000);

    return () => clearInterval(intervalId);
  }, [currentUser.id, articles]);

  const handleEditArticleClick = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setContent(art.content);
    setSummary(art.summary);
    setCategory(art.category);
    setImageUrl(art.imageUrl);
    setIsPremium(art.isPremium);
    setStatus(art.status);
    setPublishedAt(new Date(art.publishedAt).toISOString().slice(0, 16));
    setSeoTitle(art.seoTitle);
    setSeoDescription(art.seoDescription);
    setSeoKeywords(art.seoKeywords ? art.seoKeywords.join(', ') : '');
    setOriginalAuthorId(art.authorId);
    setOriginalAuthorName(art.authorName);
    setOriginalAuthorRole(art.authorRole);
    setStudioTab('write');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImageFile(file);
    }
  };

  const processImageFile = async (file: File) => {
    setCompressingImage(true);
    setCompressionMetrics(null);
    try {
      // Compress file using modern WebP/JPEG auto-conversion engine with high-fidelity margins
      const result = await compressImage(file, 1200, 900, 0.70);
      
      const originalKb = (result.originalSize / 1024).toFixed(1);
      const compressedKb = (result.compressedSize / 1024).toFixed(1);
      const savingsPercent = Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100);

      setImageUrl(result.dataUrl);
      setCompressionMetrics({
        original: `${originalKb} KB`,
        compressed: `${compressedKb} KB`,
        savings: savingsPercent > 0 ? `${savingsPercent}%` : null
      });
    } catch (err) {
      console.error("Gagal mengompresi gambar:", err);
    } finally {
      setCompressingImage(false);
    }
  };

  const handleUseStockFallback = () => {
    const fallbackMap: Record<string, string> = {
      'Politik': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&fit=crop&q=80',
      'Ekonomi': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&fit=crop&q=80',
      'Teknologi': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fit=crop&q=80',
      'Pariwisata': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&fit=crop&q=80',
      'Olahraga': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&fit=crop&q=80',
      'Internasional': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&fit=crop&q=80',
      'Hiburan': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&fit=crop&q=80',
    };
    setImageUrl(fallbackMap[category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80');
    setCompressionMetrics(null);
  };

  const resetForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setContent('');
    setSummary('');
    setCategory('Teknologi');
    setImageUrl('https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80');
    setIsPremium(false);
    setStatus('published');
    setPublishedAt(new Date().toISOString().slice(0, 16));
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setSaveSuccess('');
    setOriginalAuthorId(null);
    setOriginalAuthorName(null);
    setOriginalAuthorRole(null);
    setCompressionMetrics(null);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return;

    let finalSeoTitle = seoTitle;
    let finalSeoDescription = seoDescription;
    let finalSeoKeywords = seoKeywords;

    if (autoSeoEnabled && (!seoTitle || !seoDescription || !seoKeywords)) {
      setAiLoadingSeo(true);
      try {
        const res = await fetch('/api/gemini/assist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, type: 'seo' })
        });
        const data = await res.json();
        if (data.seoTitle) {
          finalSeoTitle = data.seoTitle;
          finalSeoDescription = data.seoDescription;
          if (data.seoKeywords) {
            finalSeoKeywords = Array.isArray(data.seoKeywords) ? data.seoKeywords.join(', ') : data.seoKeywords;
          }
          setSeoTitle(finalSeoTitle);
          setSeoDescription(finalSeoDescription);
          setSeoKeywords(finalSeoKeywords);
        }
      } catch (err) {
        console.error("Gagal melakukan otomatisasi SEO saat menyimpan:", err);
      } finally {
        setAiLoadingSeo(false);
      }
    }

    const isPublisher = ['admin', 'editor'].includes(currentUser.role);
    const finalStatus = isPublisher ? status : 'draft';

    const payload = {
      title,
      content,
      summary: summary || content.substring(0, 150) + "...",
      category,
      imageUrl,
      isPremium,
      status: finalStatus,
      publishedAt: new Date(publishedAt).toISOString(),
      seoTitle: finalSeoTitle || title,
      seoDescription: finalSeoDescription || summary || "Berita harian Fakta Faktual",
      seoKeywords: finalSeoKeywords ? finalSeoKeywords.split(',').map(s => s.trim()) : [category],
      authorId: originalAuthorId || currentUser.id,
      authorName: originalAuthorName || currentUser.name,
      authorRole: originalAuthorRole || currentUser.role,
    };

    try {
      let res;
      if (editingArticleId) {
        res = await fetch(`/api/articles/${editingArticleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setSaveSuccess('Naskah berita Anda berhasil didaftarkan dan diamankan!');
        onArticleChange();
        setTimeout(() => {
          resetForm();
          setStudioTab('articles');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteArticleId(null);
        onArticleChange();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // call server's Gemini API for SEO assistance
  const triggerAiSeoSuggest = async () => {
    if (!title || !content) {
      alert("Masukkan judul dan konten terlebih dahulu agar asisten AI dapat merangkum analisis SEO.");
      return;
    }
    setAiLoadingSeo(true);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, type: 'seo' })
      });
      const data = await res.json();
      if (data.seoTitle) {
        setSeoTitle(data.seoTitle);
        setSeoDescription(data.seoDescription);
        if (data.seoKeywords) {
          setSeoKeywords(data.seoKeywords.join(', '));
        }
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoadingSeo(false);
    }
  };

  // call server's Gemini API for Proofreading
  const triggerProofread = async () => {
    if (!content) {
      alert("Masukkan draf isi berita terlebih dahulu untuk dikoreksi.");
      return;
    }
    setAiLoadingProofread(true);
    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'proofread' })
      });
      const data = await res.json();
      if (data.result) {
        setContent(data.result);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoadingProofread(false);
    }
  };

  const writerArticles = articles.filter(a => showAllPortalArticles ? true : a.authorId === currentUser.id);

  const filteredWriterArticles = React.useMemo(() => {
    if (!catalogSearchQuery.trim()) {
      return writerArticles;
    }
    const q = catalogSearchQuery.trim().toLowerCase();
    return writerArticles.filter(art => 
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      (art.summary || '').toLowerCase().includes(q) ||
      (art.content || '').toLowerCase().includes(q) ||
      (art.authorName || '').toLowerCase().includes(q)
    );
  }, [writerArticles, catalogSearchQuery]);

  const topArticlesData = React.useMemo(() => {
    return [...writerArticles]
      .filter(a => a.status === 'published')
      .sort((a, b) => b.views - a.views)
      .slice(0, 6)
      .map(art => ({
        name: art.title.length > 22 ? art.title.substring(0, 19) + '...' : art.title,
        fullTitle: art.title,
        views: art.views,
        category: art.category
      }));
  }, [writerArticles]);

  return (
    <div id="writer-studio-wrapper" className={`p-3 sm:p-5 md:p-6 rounded-xl border transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-neutral-900/90 via-neutral-950/95 to-slate-950 border-neutral-800 text-white shadow-2xl' 
        : 'bg-gradient-to-br from-slate-50 via-white to-white border-slate-200 text-slate-800 shadow-md'
    }`}>
      {/* Studio Header Row */}
      <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 mb-6 border-b ${
        darkMode ? 'border-neutral-800/80' : 'border-slate-150'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`p-1.5 rounded ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <PenTool size={16} />
            </span>
            <span className={`text-[11px] font-black uppercase tracking-widest ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Studio Redaksi Penulis</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-black tracking-tight flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span>Selamat Datang, {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'editor' ? 'Editor' : 'Jurnalis'} {currentUser.name}</span>
            <span className="text-emerald-500 text-[10px] sm:text-xs flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded font-sans leading-none shrink-0">
              <CheckCircle size={10} /> Online
            </span>
          </h2>
          <p className={`text-[11px] sm:text-xs mt-1 ${darkMode ? 'text-neutral-450' : 'text-slate-500'}`}>Tulis berita nasional berkualitas, optimalkan SEO cerdas, dan tinjau kinerja konten Anda langsung.</p>
        </div>

        {/* Action Toggle Tabs */}
        <div className={`flex flex-nowrap items-center gap-1 border rounded-lg p-1 w-full lg:w-auto overflow-x-auto scrollbar-none transition-colors scroll-smooth ${
          darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-100 border-slate-200/90'
        }`}>
          <button 
            id="tab-writer-analytics"
            onClick={() => setStudioTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : darkMode 
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-900/40' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BarChart3 size={13} />
            Dasbor Analitik
          </button>
          <button 
            id="tab-writer-compose"
            onClick={() => { resetForm(); setStudioTab('write'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'write' && !editingArticleId
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : darkMode 
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-900/40' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <PenTool size={13} />
            Tulis Naskah Baru
          </button>
          <button 
            id="tab-writer-articles"
            onClick={() => setStudioTab('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'articles'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : darkMode 
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-900/40' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers size={13} />
            Katalog Berita ({writerArticles.length})
          </button>
        </div>
      </div>

      {/* 1. DASBOR ANALITIK WRITER */}
      {studioTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Numeric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                darkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>Total Pembaca</span>
              <div className={`text-lg sm:text-2xl font-serif font-black mt-0.5 sm:mt-1 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {analytics?.totalViews.toLocaleString('id-ID') || '0'}
              </div>
              <div className="text-[9px] sm:text-[10px] text-emerald-500 flex items-center gap-1 mt-0.5 sm:mt-1 font-bold">
                <TrendingUp size={10} /> +14.2%
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                darkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>Rekomendasi CTR</span>
              <div className="text-lg sm:text-2xl font-black text-amber-500 mt-0.5 sm:mt-1">
                {analytics?.ctr}%
              </div>
              <div className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 ${
                darkMode ? 'text-neutral-400' : 'text-slate-505'
              } truncate`}>
                Melampaui rata-rata rujukan
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                darkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>Konversi Premium</span>
              <div className="text-lg sm:text-2xl font-black text-amber-400 mt-0.5 sm:mt-1">
                {analytics?.premiumSubscriptionsReferred || '0'} Akun
              </div>
              <div className="text-[9px] sm:text-[10px] text-amber-500 flex items-center gap-1 mt-0.5 sm:mt-1 font-bold truncate">
                ★ Bonus: Rp {( (analytics?.premiumSubscriptionsReferred || 0) * 15000 ).toLocaleString('id-ID')}
              </div>
            </div>

            <div className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                darkMode ? 'text-neutral-400' : 'text-slate-500'
              }`}>Publikasi Aktif</span>
              <div className="text-lg sm:text-2xl font-black text-cyan-500 mt-0.5 sm:mt-1">
                {writerArticles.length} Naskah
              </div>
              <div className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 ${
                darkMode ? 'text-neutral-400' : 'text-slate-500'
              } truncate`}>
                {writerArticles.filter(a => a.status === 'scheduled').length} Jadwal • {writerArticles.filter(a => a.status === 'draft').length} Draf
              </div>
            </div>
          </div>

          {/* Graphical Analytics (Recharts-powered Interactive Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Tren Pembaca Mingguan (Area Chart) */}
            <div className={`p-3.5 xs:p-5 rounded-xl border transition-all duration-300 lg:col-span-8 flex flex-col justify-between ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <div>
                <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
                  darkMode ? 'border-neutral-800/80' : 'border-slate-150'
                }`}>
                  <h4 className={`text-xs font-black uppercase tracking-widest flex-grow flex items-center gap-1.5 ${
                    darkMode ? 'text-neutral-400' : 'text-slate-700'
                  }`}>
                    <span>Tren Pembaca Mingguan</span>
                    <span className={`text-[10px] font-normal normal-case ${darkMode ? 'text-neutral-500' : 'text-slate-500'}`}>(Interactive Analytics)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={fetchAnalytics}
                      disabled={loadingAnalytics}
                      className={`p-1.5 rounded border transition-colors disabled:opacity-50 ${
                        darkMode 
                          ? 'hover:bg-neutral-900 border-neutral-800/80' 
                          : 'hover:bg-slate-50 border-slate-200/80'
                      }`}
                      title="Sinkronisasi Data Real-time"
                    >
                      <RefreshCw size={11} className={`text-blue-500 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                    </button>
                    <span className="text-[9px] bg-red-500/15 text-red-500 border border-red-500/10 px-2 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
                      STREAM LIVE
                    </span>
                  </div>
                </div>
                
                <div className="h-44 sm:h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics?.viewsOverTime || []}
                      margin={{ top: 10, right: 5, left: isMobile ? -22 : -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#171717" : "#0f172a/5"} />
                      <XAxis 
                        dataKey="date" 
                        stroke={darkMode ? "#737373" : "#64748b"} 
                        tick={{ fontSize: isMobile ? 8 : 10, fontWeight: 'bold' }} 
                        tickFormatter={(val) => {
                          if (!val) return '';
                          if (isMobile) {
                            const p = val.split(' ');
                            if (p.length >= 2) return `${p[0]} ${p[1].substring(0, 3)}`;
                          }
                          return val;
                        }}
                      />
                      <YAxis 
                        stroke={darkMode ? "#737373" : "#64748b"} 
                        tick={{ fontSize: isMobile ? 8 : 10, fontWeight: 'bold' }} 
                      />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#0a0a0a' : '#ffffff',
                          borderRadius: '8px',
                          borderColor: darkMode ? '#262626' : '#cbd5e1',
                          color: darkMode ? '#fff' : '#0f172a',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#4f46e5" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`flex justify-between text-[10px] mt-3 pt-2 border-t font-bold font-mono ${
                darkMode ? 'text-neutral-500 border-neutral-900/50' : 'text-slate-550 border-slate-100'
              }`}>
                <span>✓ Data diperbarui otomatis setiap 25 detik</span>
                <span>Puncak Trafik (Live Sync)</span>
              </div>
            </div>

            {/* 2. Kanal Populer Penulis (Pie Chart) */}
            <div className={`p-3.5 xs:p-5 rounded-xl border transition-all duration-300 lg:col-span-4 flex flex-col justify-between ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <div>
                <h4 className={`text-xs font-black uppercase tracking-widest mb-2 pb-2 border-b ${
                  darkMode ? 'text-neutral-400 border-neutral-800' : 'text-slate-700 border-slate-150'
                }`}>
                  Kanal Populer Penulis
                </h4>
                
                {(!analytics?.categoryPerformance || analytics.categoryPerformance.length === 0) ? (
                  <div className="h-44 flex items-center justify-center text-xs text-neutral-500">
                    Belum ada data topik berita.
                  </div>
                ) : (
                  <>
                    <div className="h-40 w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.categoryPerformance}
                            cx="50%"
                            cy="50%"
                            innerRadius={isMobile ? 35 : 45}
                            outerRadius={isMobile ? 55 : 65}
                            paddingAngle={3}
                            dataKey="count"
                            nameKey="category"
                          >
                            {analytics.categoryPerformance.map((entry, index) => {
                              const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: darkMode ? '#0a0a0a' : '#ffffff',
                              borderRadius: '8px',
                              borderColor: darkMode ? '#262626' : '#cbd5e1',
                              fontSize: '11px',
                              color: darkMode ? '#fff' : '#0f172a'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-black uppercase text-neutral-500">Total Views</span>
                        <span className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{analytics.totalViews.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {analytics.categoryPerformance.map((item, idx) => {
                        const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981'];
                        const pct = analytics.totalViews > 0 ? Math.round((item.count / analytics.totalViews) * 100) : 0;
                        return (
                          <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold min-w-0">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                            <span className={`truncate flex-1 max-w-[85px] xs:max-w-[120px] sm:max-w-[150px] ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`} title={item.category}>{item.category}</span>
                            <span className={`ml-auto shrink-0 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className={`mt-4 p-2.5 rounded text-[10px] text-center leading-relaxed border ${
                darkMode 
                  ? 'bg-blue-950/20 border-blue-900/30 text-blue-400' 
                  : 'bg-indigo-50 border-indigo-100 text-indigo-700'
              }`}>
                Menulis naskah bertopik <strong>Teknologi</strong> & <strong>Ekonomi</strong> tercatat mendongkrak views 45% lebih tinggi!
              </div>
            </div>

            {/* 3. Peringkat Views Artikel Terbitan (Horizontal Bar Chart) */}
            <div className={`p-5 rounded-xl border transition-all duration-300 col-span-12 ${
              darkMode 
                ? 'bg-neutral-950/80 border-neutral-800/80 hover:border-neutral-700/60 shadow-lg' 
                : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:shadow shadow-sm'
            }`}>
              <div className={`flex items-center justify-between mb-4 pb-2 border-b ${
                darkMode ? 'border-neutral-800' : 'border-slate-150'
              }`}>
                <h4 className={`text-xs font-black uppercase tracking-widest flex-grow flex items-center gap-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-slate-700'
                }`}>
                  <BarChart3 size={13} className="text-cyan-500" />
                  <span>Peringkat Views Artikel Terbitan (Real-time Top Stories)</span>
                </h4>
                <span className="text-[9px] bg-cyan-500/10 text-cyan-500 border border-cyan-500/5 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                  PERFORMA REAL-TIME
                </span>
              </div>

              {topArticlesData.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-neutral-500">
                  Belum ada artikel yang dipublikasikan secara daring untuk diukur kinerjanya.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="h-44 sm:h-56 lg:col-span-8 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topArticlesData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: isMobile ? -10 : 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#171717" : "#0f172a/5"} horizontal={true} vertical={false} />
                        <XAxis type="number" stroke={darkMode ? "#737373" : "#64748b"} tick={{ fontSize: isMobile ? 8 : 9, fontWeight: 'bold' }} />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          stroke={darkMode ? "#737373" : "#64748b"} 
                          tick={{ fontSize: isMobile ? 8 : 9, fontWeight: 'bold' }} 
                          width={isMobile ? 75 : 130} 
                          tickFormatter={(val) => isMobile && val.length > 9 ? val.substring(0, 7) + '..' : val}
                        />
                        <RechartsTooltip
                          formatter={(value) => [`${value.toLocaleString('id-ID')} Views`, 'Jumlah Pembaca']}
                          contentStyle={{
                            backgroundColor: darkMode ? '#0a0a0a' : '#ffffff',
                            borderRadius: '8px',
                            borderColor: darkMode ? '#262626' : '#cbd5e1',
                            fontSize: '11px',
                            color: darkMode ? '#fff' : '#0f172a',
                            fontWeight: 'bold'
                           }}
                         />
                         <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                           {topArticlesData.map((entry, index) => {
                             const colors = ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#0f766e'];
                             return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                           })}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </div>

                   <div className="lg:col-span-4 space-y-3">
                     <h5 className={`text-[10px] font-black uppercase tracking-wider ${
                       darkMode ? 'text-neutral-450' : 'text-slate-500 font-extrabold'
                     }`}>Detil Pembaca Berdasarkan Judul</h5>
                     <div className={`divide-y border rounded p-2.5 max-h-[170px] overflow-y-auto scrollbar-none font-sans transition-all ${
                       darkMode 
                         ? 'divide-neutral-900 border-neutral-900 bg-neutral-950/60' 
                         : 'divide-slate-100 border-slate-200/80 bg-white shadow-inner shadow-slate-100'
                     }`}>
                       {topArticlesData.map((art, index) => (
                         <div key={index} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                           <div className="min-w-0 flex items-center gap-1.5 overflow-hidden">
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ${
                               darkMode ? 'bg-neutral-900 text-neutral-450' : 'bg-slate-100 text-slate-650'
                             }`}>{index + 1}</span>
                             <span className={`text-[11px] font-semibold truncate hover:underline cursor-pointer max-w-[110px] sm:max-w-[200px] inline-block ${
                               darkMode ? 'text-white' : 'text-slate-805'
                             }`} title={art.fullTitle}>
                               {art.fullTitle}
                             </span>
                           </div>
                           <span className="text-[11px] font-extrabold text-cyan-500 shrink-0 whitespace-nowrap">{art.views.toLocaleString('id-ID')} Views</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. FORM TULIS / EDIT NASKAH BERITA (With Direct HTML Side-by-Side Preview) */}
      {studioTab === 'write' && (
        <div id="editor-grid" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Writing Input Column */}
          <form onSubmit={handleSaveArticle} className="xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-500">
                {editingArticleId ? `Edit Naskah ID: ${editingArticleId}` : 'Buat Berita Baru'}
              </h4>
              {editingArticleId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                    darkMode 
                      ? 'text-neutral-400 hover:text-white border-neutral-800 hover:bg-neutral-850' 
                      : 'text-slate-650 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Batal Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Pilih Kategori Berita</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full text-xs px-3 py-2 border rounded transition-all focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                    darkMode 
                      ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500' 
                      : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                  }`}
                >
                  {(websiteSettings.categories || ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"]).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Status Publikasi</label>
                <select
                  value={['admin', 'editor'].includes(currentUser.role) ? status : 'draft'}
                  onChange={(e) => setStatus(e.target.value as any)}
                  disabled={!['admin', 'editor'].includes(currentUser.role)}
                  className={`w-full text-xs px-3 py-2 border rounded transition-all focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-85 disabled:cursor-not-allowed ${
                    darkMode 
                      ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500' 
                      : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                  }`}
                >
                  {['admin', 'editor'].includes(currentUser.role) ? (
                    <>
                      <option value="published">Segera Terbitkan (Published) ✔</option>
                      <option value="scheduled">Terjadwal Berjangka (Scheduled) ⏱</option>
                      <option value="draft">Simpan sebagai Draf Pribadi (Draft)</option>
                    </>
                  ) : (
                    <option value="draft">Ajukan Draf Berita ke Redaksi (Butuh Persetujuan Editor)</option>
                  )}
                </select>
              </div>
            </div>

            {status === 'scheduled' && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 animate-pulse transition-colors ${
                darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-orange-50/60 border-orange-100 shadow-sm'
              }`}>
                <Calendar className="text-orange-500" size={16} />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Tentukan Jam Penerbitan Otomatis</label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className={`text-xs p-1.5 rounded focus:outline-none border ${
                      darkMode 
                        ? 'bg-black text-white border-neutral-800 focus:border-blue-500' 
                        : 'bg-white text-slate-900 border-slate-200 focus:border-blue-600 shadow-sm'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Judul Utama Naskah (Maks 110 Karakter)</label>
              <input
                type="text"
                required
                placeholder="cth: Akselerasi Ekonomi Digital Nasional: Target Pertumbuhan 8% Terus Didorong"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-base font-serif font-bold px-4 py-3 border rounded transition-all focus:ring-1 focus:outline-none ${
                  darkMode 
                    ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500 focus:ring-blue-500' 
                    : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600 focus:ring-blue-600'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase">Konten Lengkap Berita (Serif, Spasial, Nyaman ditulis)</label>
                <button
                  type="button"
                  onClick={triggerProofread}
                  disabled={aiLoadingProofread}
                  className="flex items-center gap-1.5 text-[10px] text-cyan-500 hover:text-cyan-400 font-bold bg-cyan-950/20 border border-cyan-800/40 px-2.5 py-1 rounded cursor-pointer hover:border-cyan-500 transition-all shadow-sm"
                >
                  <Sparkles size={11} className={aiLoadingProofread ? 'animate-spin' : ''} />
                  <span>{aiLoadingProofread ? 'Mengkoreksi...' : 'Asisten AI: Proofreader Ejaan'}</span>
                </button>
              </div>
              {/* Toolbar Penyisipan Gambar di Dalam Artikel */}
              <div className={`p-3 rounded-t-lg border-x border-t flex flex-col gap-2.5 transition-all text-xs ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800/80'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-slate-200/60 dark:border-neutral-800/50">
                  <div className="flex items-center gap-1.5">
                    <Image size={13} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <span className={`font-black text-[10px] sm:text-[11px] uppercase tracking-wide ${darkMode ? 'text-neutral-200' : 'text-slate-800'}`}>
                      Sisipkan Gambar di Dalam Paragraf
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUrlField(false)}
                      className={`px-2.5 py-1 rounded font-black text-[10px] uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        !showUrlField
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Upload size={10} />
                      Unggah File
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlField(true)}
                      className={`px-2.5 py-1 rounded font-black text-[10px] uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        showUrlField
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Link size={10} />
                      Tautan URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-4 flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Keterangan Gambar (Alt / Caption)</span>
                    <input
                      type="text"
                      placeholder="cth: Ilustrasi infrastruktur digital..."
                      value={inlineCaption}
                      onChange={(e) => setInlineCaption(e.target.value)}
                      className={`px-2.5 py-1.5 rounded text-xs border focus:outline-none transition-all ${
                        darkMode
                          ? 'border-neutral-800 bg-neutral-950/60 text-white focus:border-blue-500'
                          : 'border-slate-200 bg-white text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  {!showUrlField ? (
                    <div className="sm:col-span-8 flex items-center gap-2">
                      <div className="flex-1">
                        <label className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed rounded text-xs cursor-pointer font-bold transition-all ${
                          insertingInlineImage
                            ? 'opacity-60 cursor-not-allowed'
                            : darkMode
                              ? 'border-neutral-700 bg-neutral-950/40 hover:bg-neutral-850 text-neutral-300'
                              : 'border-slate-250 bg-white hover:bg-slate-50 text-slate-705'
                        }`}>
                          <Upload size={13} className={insertingInlineImage ? 'animate-pulse' : ''} />
                          <span>{insertingInlineImage ? 'Memproses...' : 'Pilih & Sisipkan Gambar'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleInsertInlineImageFile}
                            disabled={insertingInlineImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="sm:col-span-8 flex items-center gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-neutral-400 font-mono">Alamat URL Gambar (HTTPS)</span>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={inlineUrlInput}
                          onChange={(e) => setInlineUrlInput(e.target.value)}
                          className={`px-2.5 py-1.5 rounded text-xs border focus:outline-none transition-all ${
                            darkMode
                              ? 'border-neutral-800 bg-neutral-950/60 text-white focus:border-blue-500'
                              : 'border-slate-200 bg-white text-slate-900 focus:border-blue-600'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleInsertInlineUrl}
                        className="px-3.5 py-1.5 rounded font-black text-[10px] uppercase bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 self-end cursor-pointer"
                      >
                        <Plus size={11} />
                        Sematkan
                      </button>
                    </div>
                  )}
                </div>

                {/* Preview inserted inline images list */}
                {inlineImages.length > 0 && (
                  <div className="flex flex-col gap-1.5 border-t pt-2 border-slate-200/50 dark:border-neutral-800/30">
                    <span className="text-[9px] uppercase font-bold text-neutral-400">Gambar yang Terpasang dalam Sesi:</span>
                    <div className="flex flex-wrap gap-2">
                      {inlineImages.map((img) => (
                        <div 
                          key={img.id}
                          className={`flex items-center gap-2 p-1 pr-2 rounded border bg-neutral-950/20 max-w-[200px] shrink-0 overflow-hidden ${
                            darkMode ? 'border-neutral-850' : 'border-slate-200'
                          }`}
                        >
                          <img src={img.url} alt={img.caption} referrerPolicy="no-referrer" className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1 min-w-0 flex flex-col">
                            <span className="text-[9px] font-bold truncate block">{img.caption}</span>
                            <span className="text-[7.5px] text-neutral-405 font-mono truncate">![{img.caption.slice(0, 5)}...]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <textarea
                ref={textareaRef}
                rows={16}
                required
                placeholder="Tulis draf naskah berita nasional yang informatif di sini. Gunakan tombol Enter (Double-Return) untuk menciptakan jeda paragraf demi kenyamanan pembaca jurnalisme berbobot..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full text-sm font-sans px-4 py-4 border rounded-b focus:outline-none focus:ring-1 leading-relaxed transition-all tracking-wide rounded-t-none border-t-0 ${
                  darkMode 
                    ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500 focus:ring-blue-500 font-mono text-[13px]' 
                    : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600 focus:ring-blue-600'
                }`}
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Ringkasan Depan (Summary Singkat)</label>
              <input
                type="text"
                placeholder="Ringkasan singkat untuk tampilan kartu depan web..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={`w-full text-xs px-3.5 py-2.5 border rounded focus:outline-none transition-all ${
                  darkMode 
                    ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500 font-mono text-[12px]' 
                    : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="block text-[10px] font-black text-neutral-400 uppercase mb-1">
                  Gambar Artikel Utama (Uploader Cerdas & Kompresi Otomatis)
                </label>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={async (e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      await processImageFile(file);
                    } else {
                      alert("Silakan unggah berkas gambar yang valid (.png, .jpg, .jpeg, .webp)");
                    }
                  }}
                  className={`border border-dashed rounded-lg p-4 text-center transition-all relative flex flex-col items-center justify-center min-h-[115px] cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : darkMode
                        ? 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-indigo-500/40 shadow-sm'
                        : 'border-slate-250 bg-white hover:bg-slate-50 hover:border-indigo-400 shadow-inner shadow-slate-100/40'
                  }`}
                  onClick={() => document.getElementById('smart-image-file-input')?.click()}
                >
                  <input
                    id="smart-image-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {compressingImage ? (
                    <div className="flex flex-col items-center gap-1.5">
                      <RefreshCw size={20} className="text-blue-500 animate-spin" />
                      <span className="text-[10px] font-bold text-blue-500">Merapikan & Mengompresi Gambar...</span>
                      <span className="text-[8px] text-neutral-400">Teknologi Optimalisasi Aktif</span>
                    </div>
                  ) : imageUrl ? (
                    <div className="flex flex-col items-center gap-1.5 w-full">
                      <div className="relative group/thumb w-24 h-14 rounded border border-neutral-700/30 overflow-hidden shadow-sm">
                        <img
                          src={imageUrl}
                          alt="Pratinjau unggahan"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={12} className="text-white" />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 justify-center">
                          <CheckCircle size={10} />
                          <span>Gambar Aktif Terpilih</span>
                        </span>
                        
                        {compressionMetrics ? (
                          <div className="flex flex-col items-center gap-0.5 mt-0.5">
                            <p className="text-[8.5px] text-neutral-400 font-mono">
                              {compressionMetrics.original} &rarr; <span className="font-extrabold text-blue-400">{compressionMetrics.compressed}</span>
                            </p>
                            {compressionMetrics.savings && (
                              <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 font-black rounded uppercase tracking-wider animate-pulse">
                                Hemat {compressionMetrics.savings}
                              </span>
                            )}
                          </div>
                        ) : imageUrl.startsWith('data:') ? (
                          <p className="text-[8.5px] text-neutral-400 mt-0.5 font-mono">
                            Kompresi Berhasil
                          </p>
                        ) : (
                          <p className="text-[8.5px] text-neutral-400 mt-0.5 font-mono">
                            Gunakan Gambar Bawaan
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={20} className={darkMode ? 'text-neutral-550' : 'text-slate-400'} />
                      <div className="text-[10px]">
                        <span className="text-blue-500 font-extrabold hover:underline">Pilih berkas</span>, atau tarik ke sini
                      </div>
                      <p className="text-[8px] text-neutral-400">
                        Otomatis dikompresi di bawah 100 KB demi performa
                      </p>
                    </div>
                  )}
                </div>

                {/* Cover presets helper */}
                <div className="flex items-center justify-between mt-1">
                  <button
                    type="button"
                    onClick={handleUseStockFallback}
                    className={`text-[9px] font-bold px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                      darkMode
                        ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-neutral-300 animate-none'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                    }`}
                  >
                    <FileImage size={10} />
                    <span>Pakai Gambar Bawaan Kategori</span>
                  </button>
                  <span className="text-[8px] font-mono text-neutral-400">Hemat Kuota</span>
                </div>
              </div>

              <div className={`flex items-center gap-3 border rounded-xl p-3.5 transition-all ${
                darkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-slate-50/50 border-slate-200 shadow-sm'
              }`}>
                <Lock className="text-amber-550" size={17} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${darkMode ? 'text-neutral-300' : 'text-slate-800'}`}>Konten Premium</span>
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="cursor-pointer h-4 w-4 text-indigo-600 rounded focus:ring-indigo-600 bg-neutral-900 border-neutral-700"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">Hanya dapat dibaca pelanggan premium.</p>
                </div>
              </div>
            </div>

            {/* SEO Automation Module Block */}
            <div className={`p-4 rounded-xl border space-y-3.5 transition-all ${
              darkMode ? 'bg-neutral-900/40 border-neutral-805' : 'bg-slate-100/60 border-slate-200 shadow-sm'
            }`}>
              {/* Automated Active SEO Option Banner */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border mb-1 transition-all ${
                darkMode ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50 border-blue-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="auto-seo-toggle"
                    checked={autoSeoEnabled}
                    onChange={(e) => setAutoSeoEnabled(e.target.checked)}
                    className="cursor-pointer h-3.5 w-3.5 text-blue-600 rounded focus:ring-blue-600 border-gray-300"
                  />
                  <label htmlFor="auto-seo-toggle" className="text-[10px] font-black text-blue-500 uppercase cursor-pointer select-none">
                    Otomatisasi SEO Cerdas Aktif (Asisten Gemini)
                  </label>
                </div>
                <span className="text-[9px] text-neutral-450 font-semibold">Isi otomatis saat naskah disimpan</span>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-800/10 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase">
                  <Sparkles size={14} />
                  <span>Integrasi Optimasi Mesin Pencari (SEO)</span>
                </div>
                
                <button
                  type="button"
                  onClick={triggerAiSeoSuggest}
                  disabled={aiLoadingSeo}
                  className="flex items-center gap-1.5 text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-600/30 px-3 py-1 rounded font-bold cursor-pointer transition-all shadow-sm"
                >
                  {aiLoadingSeo ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" />
                      <span>Pemrosesan AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={11} />
                      <span>Otomatisasi SEO via Gemini</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Meta SEO Title</label>
                  <input
                    type="text"
                    placeholder="Judul SEO di Tab Google"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className={`w-full text-[11px] px-2.5 py-2 rounded focus:outline-none transition-all border ${
                      darkMode 
                        ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500' 
                        : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Keywords (Fokus Kata Kunci, Pisah Koma)</label>
                  <input
                    type="text"
                    placeholder="ekonomi digital, menteri, umkm"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className={`w-full text-[11px] px-2.5 py-2 rounded focus:outline-none transition-all border ${
                      darkMode 
                        ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500' 
                        : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Meta Description (Maks 160 Karakter)</label>
                <input
                  type="text"
                  placeholder="Ringkasan padat optimasi mesin pencari Google..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className={`w-full text-[11px] px-2.5 py-2 rounded focus:outline-none transition-all border ${
                    darkMode 
                      ? 'border-neutral-800 bg-neutral-900/50 text-white focus:bg-neutral-950/85 focus:border-blue-500' 
                      : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                ✓ {saveSuccess}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-750 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-xs tracking-wider rounded-lg uppercase shadow-md select-none cursor-pointer transition-all active:scale-95"
            >
              {editingArticleId ? 'SIMPAN PERUBAHAN ARTIKEL' : 'PUBLIKASIKAN ARTIKEL SEKARANG'}
            </button>
          </form>

          {/* Side-by-Side Real Time Custom Preview */}
          <div className="xl:col-span-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-500 flex items-center gap-1.5 border-b border-neutral-700/20 pb-2">
              <Eye size={14} />
              <span>Pratinjau Pembaca (Live Reader Preview)</span>
            </h4>

            <div className={`p-3.5 sm:p-6 rounded-xl border shadow-xl flex flex-col gap-4 sm:gap-5 transition-colors ${
              darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-slate-50/50 border-slate-200'
            }`}>
              {/* Cover Photo */}
              <div className="w-full h-36 sm:h-48 bg-neutral-950 rounded-lg overflow-hidden relative shadow-sm">
                <ImageWithBlurPlaceholder 
                  src={imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80"} 
                  alt="Pre-Render" 
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                  {category}
                </span>
                {isPremium && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow">
                    PREMIUM
                  </span>
                )}
              </div>

              {/* Author and Date metadata block */}
              <div className={`flex items-center gap-3 border-b pb-4 ${darkMode ? 'border-neutral-800/60' : 'border-slate-150'}`}>
                <div className="h-8 w-8 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center text-xs font-black">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs">
                  <span className={`font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</span>
                  <span className="text-neutral-400 block text-[10px] mt-0.5">Diterbitkan: {status === 'scheduled' ? `Terjadwal pada ${publishedAt}` : 'Terbit Instan'}</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className={`text-lg sm:text-2xl font-serif font-black leading-tight tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {title || "Masukan Judul Artikel Anda..."}
              </h1>

              {/* Content Render with simulated typography */}
              <div className={`text-sm leading-relaxed space-y-4 font-serif ${
                darkMode ? 'text-neutral-300 animate-fade-in' : 'text-slate-800'
              }`}>
                {content ? (
                  content.split('\n\n').map((para, i) => (
                    <p key={i} className="first-letter:font-bold first-letter:text-lg">{para}</p>
                  ))
                ) : (
                  <p className="italic text-neutral-500 font-sans text-xs">Mulai menulis di editor untuk melihat susunan paragraf layout berita utama Anda disini secara dinamis...</p>
                )}
              </div>

              {/* Editorial / Journalism Ethics Check */}
              <div className={`p-4 mt-2 rounded-lg border font-sans text-xs flex flex-col gap-1.5 transition-colors ${
                darkMode ? 'bg-neutral-900/40 border-neutral-800 text-neutral-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <span className="font-extrabold uppercase tracking-wider text-[10px] text-blue-600 flex items-center gap-1.5">
                  <CheckCircle size={12} className="text-blue-500" /> Standar Pemeriksaan Redaksi
                </span>
                <p className="text-[11px] leading-relaxed text-neutral-400">
                  Naskah ini dievaluasi secara otomatis sesuai dengan standar Kode Etik Jurnalistik (KEJ). Pastikan draf mengandung informasi berimbang, menjunjung asas praduga tak bersalah, dan menyebutkan sumber kredibel.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. DAFTAR ARTIKEL PENULIS TERSEDIA */}
      {studioTab === 'articles' && (
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg transition-colors ${
            darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-500">
                {showAllPortalArticles ? "🔴 Mode Peninjau Redaksi (Semua Berita Portal)" : "🟢 Mode Penulis Mandiri (Karya Anda)"}
              </h4>
              <p className="text-[10px] text-neutral-400">
                {showAllPortalArticles 
                  ? "Menampilkan seluruh naskah dari jurnalis se-Nusanews. Anda dapat mengedit, mereview, atau menerbitkannya."
                  : "Menampilkan karya tulis pribadi Anda. Klik tombol mendarat di samping kanan untuk beralih mode."}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isReviewer && (
                <button
                  type="button"
                  onClick={() => setShowAllPortalArticles(!showAllPortalArticles)}
                  className={`p-1.5 px-3 rounded text-xs font-extrabold transition-all cursor-pointer border ${
                    showAllPortalArticles 
                      ? 'bg-blue-600/10 border-blue-600 text-blue-500 hover:bg-blue-600/20' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{showAllPortalArticles ? "Sembunyikan Naskah Lain" : "Tampilkan Semua Naskah"}</span>
                </button>
              )}
              
              <span className={`text-[10px] font-mono font-extrabold px-2 py-1 rounded border transition-colors ${
                darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                Total: {writerArticles.length} naskah
              </span>
            </div>
          </div>

          {/* Search bar specifically for Catalog of Articles */}
          {writerArticles.length > 0 && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                placeholder="Cari naskah berita berdasarkan judul, kategori, ringkasan, isi, atau jurnalis..."
                className={`w-full text-xs pl-9 pr-9 py-2.5 rounded-lg border transition-all ${
                  darkMode 
                    ? 'bg-neutral-900/60 border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50' 
                    : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50'
                }`}
              />
              {catalogSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCatalogSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {writerArticles.length === 0 ? (
            <div className={`text-center py-12 rounded-lg border transition-colors ${
              darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-slate-50 border-slate-200'
            }`}>
              <ShieldAlert className="text-neutral-500 mx-auto mb-2" size={32} />
              <p className="text-sm font-bold text-neutral-400">Anda belum pernah menerbitkan naskah berita apapun.</p>
              <button
                onClick={() => setStudioTab('write')}
                className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded transition-all cursor-pointer"
              >
                Tulis Berita Pertama Anda
              </button>
            </div>
          ) : filteredWriterArticles.length === 0 ? (
            <div className={`text-center py-12 rounded-lg border transition-colors ${
              darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-slate-50 border-slate-200'
            }`}>
              <Search className="text-neutral-500 mx-auto mb-2 opacity-60" size={32} />
              <p className="text-sm font-bold text-neutral-400">Tidak ada naskah berita yang cocok dengan kata kunci pencarian Anda.</p>
              <button
                onClick={() => setCatalogSearchQuery('')}
                className={`mt-3 text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer border ${
                  darkMode ? 'bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border-neutral-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                Atur Ulang Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWriterArticles.map((art) => (
                <div 
                  key={art.id} 
                  className={`p-4 rounded-lg border hover:border-blue-600/35 transition-all flex flex-col gap-3 relative group shadow-sm ${
                    darkMode ? 'bg-neutral-950 border-neutral-850 hover:border-neutral-700' : 'bg-white border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <ImageWithBlurPlaceholder 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-full object-cover"
                    containerClassName="h-32 w-full rounded shadow-sm"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] border px-2 py-0.5 rounded font-black uppercase ${
                      darkMode ? 'bg-neutral-900 border-neutral-850 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      {art.category}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded text-white ${
                      art.status === 'published' ? 'bg-emerald-600' : art.status === 'scheduled' ? 'bg-amber-600 animate-pulse' : 'bg-neutral-600'
                    }`}>
                      {art.status}
                    </span>
                  </div>

                  <h3 className={`font-serif font-bold text-xs line-clamp-2 leading-snug ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {art.title}
                  </h3>

                  <p className={`text-[10px] line-clamp-2 ${darkMode ? 'text-neutral-400' : 'text-slate-650'}`}>
                    {art.summary}
                  </p>

                  {/* Author Meta Info */}
                  <div className="flex items-center gap-1.5 text-[9px] mt-1 pb-1">
                    <span className="text-neutral-400">Penulis:</span>
                    <span className={`font-black ${darkMode ? 'text-neutral-200' : 'text-slate-900'}`}>{art.authorName || "Anonim"}</span>
                    <span className={`text-[8px] border px-1 py-0.2 rounded font-sans uppercase ${
                      darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-450' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      {art.authorRole || "user"}
                    </span>
                  </div>

                  <div className={`flex justify-between items-center text-[10px] text-neutral-400 pt-2 border-t ${
                    darkMode ? 'border-neutral-850' : 'border-slate-150'
                  }`}>
                    <span>👁 {art.views.toLocaleString('id-ID')} views</span>
                    <span>💬 {art.commentsCount} komentar</span>
                  </div>

                  {/* Edit / Delete actions overlay */}
                  <div className={`flex items-center gap-2 pt-2 border-t justify-end ${
                    darkMode ? 'border-neutral-850' : 'border-slate-150'
                  }`}>
                    <button
                      onClick={() => handleEditArticleClick(art)}
                      className={`p-1 px-2.5 rounded text-[10px] cursor-pointer text-center font-bold border transition-colors ${
                        currentUser.id !== art.authorId && ['editor', 'admin'].includes(currentUser.role)
                          ? 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border-blue-600/30'
                          : darkMode 
                            ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {currentUser.id !== art.authorId && ['editor', 'admin'].includes(currentUser.role)
                        ? 'Tinjau & Terbitkan'
                        : 'Edit Draf'}
                    </button>
                    {confirmDeleteArticleId === art.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1 px-2 rounded bg-red-650 hover:bg-red-750 text-[10px] text-white cursor-pointer text-center font-bold transition-colors shadow-md"
                          title="Yakin Hapus?"
                        >
                          Yakin?
                        </button>
                        <button
                          onClick={() => setConfirmDeleteArticleId(null)}
                          className={`p-1 px-1.5 rounded text-[10px] cursor-pointer text-center font-bold transition-colors border ${
                            darkMode ? 'bg-neutral-800 hover:bg-neutral-700 hover:text-white border-neutral-700' : 'bg-slate-100 border-slate-200 text-slate-705'
                          }`}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteArticleId(art.id)}
                        className={`p-1 px-2.5 rounded text-[10px] border cursor-pointer text-center font-bold transition-colors ${
                          darkMode 
                            ? 'bg-red-950/20 hover:bg-red-900/40 text-red-450 border-red-900/30' 
                            : 'bg-red-50 hover:bg-red-100 text-red-650 border-red-200'
                        }`}
                        title="Hapus Naskah"
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
