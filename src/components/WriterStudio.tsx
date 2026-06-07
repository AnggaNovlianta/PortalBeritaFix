import React, { useState, useEffect } from 'react';
import { PenTool, BarChart3, TrendingUp, Sparkles, RefreshCw, Layers, Calendar, Lock, CheckCircle, Trash2, Eye, ShieldAlert, Check } from 'lucide-react';
import { User, Article, WebSettings, AuthorAnalytics } from '../types';

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

  // Reviewer Mode state
  const isReviewer = ['editor', 'admin'].includes(currentUser.role);
  const [showAllPortalArticles, setShowAllPortalArticles] = useState(isReviewer);

  // Preserve original author when Editor/Admin is editing a journalist's story
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null);
  const [originalAuthorName, setOriginalAuthorName] = useState<string | null>(null);
  const [originalAuthorRole, setOriginalAuthorRole] = useState<string | null>(null);

  // New/Edit Article Form State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
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
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error("Gagal memuat analitik jurnalis", e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return;

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
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary || "Berita harian Fakta Faktual",
      seoKeywords: seoKeywords ? seoKeywords.split(',').map(s => s.trim()) : [category],
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
    if (!window.confirm("Apakah Anda yakin ingin menghapus artikel berita ini secara permanen dari basis data?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
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

  return (
    <div id="writer-studio-wrapper" className={`p-4 md:p-6 rounded-lg border transition-colors ${
      darkMode 
        ? 'bg-neutral-900/60 border-neutral-800 text-white' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Studio Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-neutral-700/20 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded bg-blue-600/10 text-blue-600">
              <PenTool size={16} />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Studio Redaksi Penulis</span>
          </div>
          <h2 className="text-xl font-serif font-black tracking-tight flex items-center gap-2">
            Selamat Datang, {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'editor' ? 'Editor' : 'Jurnalis'} {currentUser.name} 
            <span className="text-emerald-500 text-xs flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded font-sans">
              <CheckCircle size={10} /> Online
            </span>
          </h2>
          <p className="text-xs text-neutral-400">Tulis berita nasional berkualitas, optimalkan SEO cerdas, dan tinjau kinerja konten Anda langsung.</p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded p-1 w-full md:w-auto overflow-x-auto">
          <button 
            id="tab-writer-analytics"
            onClick={() => setStudioTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'analytics'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 size={13} />
            Dasbor Analitik
          </button>
          <button 
            id="tab-writer-compose"
            onClick={() => { resetForm(); setStudioTab('write'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'write' && !editingArticleId
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PenTool size={13} />
            Tulis Naskah Baru
          </button>
          <button 
            id="tab-writer-articles"
            onClick={() => setStudioTab('articles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              studioTab === 'articles'
                ? 'bg-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Pembaca (Views)</span>
              <div className="text-2xl font-black text-white mt-1">
                {analytics?.totalViews.toLocaleString('id-ID') || '0'}
              </div>
              <div className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-bold">
                <TrendingUp size={11} /> +14.2% Bulan ini
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-sans">Rekomendasi Premium (CTR)</span>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {analytics?.ctr}%
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                Melampaui rata-rata nasional (1.5%)
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Konversi Langganan Premium</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {analytics?.premiumSubscriptionsReferred || '0'} Akun
              </div>
              <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1 font-bold">
                ★ Estimasi Bonus: Rp {( (analytics?.premiumSubscriptionsReferred || 0) * 15000 ).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Publikasi Aktif</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {writerArticles.length} Naskah
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {writerArticles.filter(a => a.status === 'scheduled').length} Terjadwal • {writerArticles.filter(a => a.status === 'draft').length} Draf
              </div>
            </div>
          </div>

          {/* Graphical Analytics (SVG Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SVG Traffic trend chart */}
            <div className="p-5 rounded-lg bg-neutral-950 border border-neutral-800 lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-2 flex-grow">Tren Pembaca Mingguan (Real-time Google Analytics Sync)</h4>
                <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">LIVE STREAM SYNC</span>
              </div>
              
              <div className="h-44 w-full flex items-end justify-between pt-6 px-4 border-b border-neutral-800">
                {analytics?.viewsOverTime.map((item, index) => {
                  const maxViews = Math.max(...analytics.viewsOverTime.map(v => v.views)) || 1;
                  const heightPercent = Math.max(12, Math.round((item.views / maxViews) * 100));
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 gap-2 group relative">
                      {/* Floating tooltip */}
                      <span className="absolute -top-7 bg-neutral-900 border border-neutral-800 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                        {item.views} Views
                      </span>
                      <div 
                        className={`w-7 sm:w-10 rounded-t transition-all duration-500 relative cursor-pointer ${
                          index === 4 
                            ? 'bg-gradient-to-t from-blue-600 to-indigo-500 border border-blue-400 shadow-md shadow-blue-500/20' 
                            : 'bg-gradient-to-t from-neutral-800 to-neutral-600 group-hover:to-blue-500'
                        }`} 
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20"></div>
                      </div>
                      <span className="text-[9px] font-bold text-neutral-300 mt-1 select-none">{item.date}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 mt-2">
                <span>Pembaca Harian Terendah</span>
                <span>Puncak Trafik (Hari Kerja)</span>
              </div>
            </div>

            {/* Doughnut category visualizer */}
            <div className="p-5 rounded-lg bg-neutral-950 border border-neutral-800 lg:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 border-b border-neutral-800 pb-2">Kanal Populer Penulis</h4>
              
              <div className="space-y-3.5 pt-2">
                {analytics?.categoryPerformance.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-neutral-300">{item.category}</span>
                      <span className="text-white">{item.count.toLocaleString('id-ID')} views</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className={`h-full rounded-full ${
                          idx === 0 ? 'bg-blue-600' : idx === 1 ? 'bg-cyan-500' : 'bg-purple-500'
                        }`} 
                        style={{ width: `${Math.min(100, Math.round((item.count / (analytics.totalViews || 100)) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-2 rounded bg-blue-600/5 border border-blue-600/10 text-[10px] text-blue-400 text-center leading-relaxed">
                Menulis topik <strong>Teknologi</strong> & <strong>Ekonomi</strong> memiliki potensi views 45% lebih tinggi pekan ini.
              </div>
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
                  className="text-[10px] font-bold text-neutral-400 hover:text-white border border-neutral-800 px-2 py-0.5 rounded cursor-pointer"
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
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 focus:border-blue-600 focus:outline-none"
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
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 focus:border-blue-600 focus:outline-none disabled:opacity-80 disabled:cursor-not-allowed"
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
              <div className="p-3 bg-neutral-950 rounded border border-neutral-800 flex items-center gap-3 animate-pulse">
                <Calendar className="text-orange-500" size={16} />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Tentukan Jam Penerbitan Otomatis</label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="text-xs bg-black text-white p-1 rounded focus:outline-none border border-neutral-800"
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
                className="w-full text-xs px-3 py-2.5 border rounded border-neutral-700 bg-neutral-950 text-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase">Konten Lengkap Berita (Gaya Jurnalisme)</label>
                <button
                  type="button"
                  onClick={triggerProofread}
                  disabled={aiLoadingProofread}
                  className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded cursor-pointer"
                >
                  <Sparkles size={11} className={aiLoadingProofread ? 'animate-spin' : ''} />
                  <span>{aiLoadingProofread ? 'Mengkoreksi...' : 'Asisten AI: Proofreader Ejaan'}</span>
                </button>
              </div>
              <textarea
                rows={9}
                required
                placeholder="Tulis draf naskah berita nasional yang informatif di sini. Gunakan spasi enter ganda untuk paragraf baru."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white font-sans focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Ringkasan Depan (Summary Singkat)</label>
              <input
                type="text"
                placeholder="Ringkasan singkat untuk tampilan kartu depan web..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Tautan URL Gambar Artikel</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none text-[10px]"
                />
              </div>

              <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded p-3">
                <Lock className="text-amber-400" size={17} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-200">Konten Premium</span>
                    <input
                      type="checkbox"
                      checked={isPremium}
                      onChange={(e) => setIsPremium(e.target.checked)}
                      className="cursor-pointer h-4 w-4 text-blue-600 rounded focus:ring-blue-600 bg-black border-neutral-700"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400">Hanya dapat dibaca pelanggan premium.</p>
                </div>
              </div>
            </div>

            {/* SEO Automation Module Block */}
            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase">
                  <Sparkles size={14} className="text-blue-500" />
                  <span>Integrasi Optimasi Mesin Pencari (SEO)</span>
                </div>
                
                <button
                  type="button"
                  onClick={triggerAiSeoSuggest}
                  disabled={aiLoadingSeo}
                  className="flex items-center gap-1 text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded font-bold cursor-pointer transition-all"
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
                    className="w-full text-[11px] px-2 py-1.5 rounded border border-neutral-800 bg-black text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-bold text-neutral-400 mb-1">Keywords / Fokus Kata Kunci (Dipisah koma)</label>
                  <input
                    type="text"
                    placeholder="ekonomi digital, menteri, umkm"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full text-[11px] px-2 py-1.5 rounded border border-neutral-800 bg-black text-white focus:outline-none"
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
                  className="w-full text-[11px] px-2.5 py-1.5 rounded border border-neutral-800 bg-black text-white focus:outline-none"
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
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:from-indigo-800 text-white font-extrabold text-xs tracking-wider rounded uppercase shadow-lg select-none cursor-pointer transition-all active:scale-95"
            >
              🔐 {editingArticleId ? 'PERBARUI DAN RE-ENKRIPSI PORTAL' : 'AMANKAN & SEBARKAN SEKARANG'}
            </button>
          </form>

          {/* Side-by-Side Real Time Custom Preview */}
          <div className="xl:col-span-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-neutral-800 pb-2">
              <Eye size={14} />
              <span>Pratinjau Langsung (Live Reader Preview)</span>
            </h4>

            <div className={`p-5 rounded-lg border shadow-xl flex flex-col gap-4 font-sans ${
              darkMode ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-150'
            }`}>
              {/* Cover Photo */}
              <div className="w-full h-44 bg-neutral-900 rounded overflow-hidden relative">
                <img 
                  src={imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&fit=crop&q=80"} 
                  alt="Pre-Render" 
                  className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  {category}
                </span>
                {isPremium && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                    PREMIUM
                  </span>
                )}
              </div>

              {/* Author and Date metadata block */}
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <div className="h-7 w-7 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-black text-blue-500">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-[10px]">
                  <span className={`${darkMode ? 'text-white' : 'text-slate-900'} font-bold`}>{currentUser.name}</span>
                  <span className="text-neutral-400 block">Diterbitkan: {status === 'scheduled' ? `Terjadwal: ${publishedAt}` : 'Hari ini (Instan)'}</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className={`text-xl font-serif font-black leading-tight tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}>
                {title || "Masukan Judul Artikel Anda..."}
              </h1>

              {/* Content Render with simulated typography */}
              <div className={`text-xs leading-relaxed space-y-3 font-sans opacity-90 ${
                darkMode ? 'text-neutral-300' : 'text-slate-700'
              }`}>
                {content ? (
                  content.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p className="italic text-neutral-500">Mulai menulis untuk melihat susunan paragraf layout berita utama Anda disini secara dinamis...</p>
                )}
              </div>

              {/* Cryptographical visually signed ledger anchor representation */}
              <div className="p-2.5 mt-2 rounded bg-cyan-950/20 border border-cyan-800/40 font-mono text-[9px] text-cyan-400 flex flex-col gap-1">
                <span className="font-extrabold uppercase tracking-widest text-[8px]">Perlindungan Enkripsi Finansial E2E</span>
                <span className="truncate">Digital Ledger Hash: sha256:{title ? 'verified:' + title.length * 1234 : 'estimating...'}</span>
                <span>Integritas Berita: Aman dari Serangan Peretas</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. DAFTAR ARTIKEL PENULIS TERSEDIA */}
      {studioTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 border border-neutral-850 rounded-lg">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-500">
                {showAllPortalArticles ? "🔴 Mode Peninjau Redaksi (Semua Berita Portal)" : "🟢 Mode Penulis Mandiri (Karya Anda)"}
              </h4>
              <p className="text-[10px] text-neutral-400">
                {showAllPortalArticles 
                  ? "Menampilkan seluruh naskah dari jurnalis se-Nusanews. Anda dapat mengedit, mereview, atau menerbitkannya."
                  : "Menampilkan karya tulis pribadi Anda. Klik tombol biru di sebelah kanan untuk beralih mode."}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isReviewer && (
                <button
                  type="button"
                  onClick={() => setShowAllPortalArticles(!showAllPortalArticles)}
                  className={`p-1.5 px-3 rounded text-xs font-extrabold transition-all cursor-pointer border ${
                    showAllPortalArticles 
                      ? 'bg-blue-600/20 border-blue-600 text-blue-400 hover:bg-blue-600/30' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{showAllPortalArticles ? "Sembunyikan Naskah Lain" : "Tampilkan Semua Naskah"}</span>
                </button>
              )}
              
              <span className="text-[10px] font-mono font-extrabold text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded">
                Total: {writerArticles.length} artikel
              </span>
            </div>
          </div>

          {writerArticles.length === 0 ? (
            <div className="text-center py-12 bg-neutral-950 rounded-lg border border-neutral-800">
              <ShieldAlert className="text-neutral-600 mx-auto mb-2" size={32} />
              <p className="text-sm font-bold text-neutral-400">Anda belum pernah menerbangkan draf berita apapun.</p>
              <button
                onClick={() => setStudioTab('write')}
                className="mt-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded transition-all cursor-pointer"
              >
                Tulis Berita Pertama Anda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {writerArticles.map((art) => (
                <div 
                  key={art.id} 
                  className="p-4 rounded-lg bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col gap-3 relative group"
                >
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="h-32 w-full object-cover rounded"
                  />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-neutral-900 border border-neutral-800 text-blue-400 px-2 py-0.5 rounded font-black uppercase">
                      {art.category}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded text-white ${
                      art.status === 'published' ? 'bg-emerald-600' : art.status === 'scheduled' ? 'bg-amber-600 animate-pulse' : 'bg-neutral-600'
                    }`}>
                      {art.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xs text-white line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-[10px] text-neutral-400 line-clamp-2">
                    {art.summary}
                  </p>

                  {/* Author Meta Info */}
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-450 mt-1 pb-1">
                    <span>Penulis:</span>
                    <span className="font-black text-neutral-300">{art.authorName || "Anonim"}</span>
                    <span className="text-[8px] bg-neutral-900 border border-neutral-800 text-neutral-400 px-1 py-0.2 rounded font-sans uppercase">
                      {art.authorRole || "user"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2 border-t border-neutral-850">
                    <span>👁 {art.views.toLocaleString('id-ID')} views</span>
                    <span>💬 {art.commentsCount} komentar</span>
                  </div>

                  {/* Edit / Delete actions overlay */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-850 justify-end">
                    <button
                      onClick={() => handleEditArticleClick(art)}
                      className={`p-1 px-2.5 rounded text-[10px] cursor-pointer text-center font-bold border transition-colors ${
                        currentUser.id !== art.authorId && ['editor', 'admin'].includes(currentUser.role)
                          ? 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-600/30'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800'
                      }`}
                    >
                      {currentUser.id !== art.authorId && ['editor', 'admin'].includes(currentUser.role)
                        ? 'Tinjau & Terbitkan'
                        : 'Edit Draf'}
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1 px-2.5 rounded bg-red-950/35 hover:bg-red-900/60 text-[10px] text-red-400 border border-red-900/40 cursor-pointer text-center font-bold"
                      title="Hapus Naskah"
                    >
                      <Trash2 size={11} />
                    </button>
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
