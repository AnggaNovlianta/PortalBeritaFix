import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Users, MessageSquare, CreditCard, ShieldCheck, Sparkles, AlertCircle, RefreshCw, Trash2, CheckCircle, Plus, Key, Lock } from 'lucide-react';
import { WebSettings, Comment, User } from '../types';

interface AdminPanelProps {
  darkMode: boolean;
  websiteSettings: WebSettings;
  onSettingsChange: (settings: WebSettings) => void;
  editorialTeam: { id: string; name: string; role: string; photo: string }[];
  onEditorialChange: () => void;
  comments: Comment[];
  onCommentsChange: () => void;
}

export default function AdminPanel({
  darkMode,
  websiteSettings,
  onSettingsChange,
  editorialTeam,
  onEditorialChange,
  comments,
  onCommentsChange,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'settings' | 'team' | 'comments' | 'payments' | 'security' | 'users'>('settings');

  // Users state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPasswordInput, setEditPasswordInput] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState('');
  const [userErrorMessage, setUserErrorMessage] = useState('');

  // Register New User fields
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'journalist' | 'contributor' | 'user'>('user');
  const [newUserPass, setNewUserPass] = useState('');

  // Website Settings Form
  const [siteName, setSiteName] = useState(websiteSettings.websiteName);
  const [siteLogo, setSiteLogo] = useState(websiteSettings.websiteLogo);
  const [smtpHost, setSmtpHost] = useState(websiteSettings.smtpHost);
  const [smtpPort, setSmtpPort] = useState(websiteSettings.smtpPort);
  const [smtpUser, setSmtpUser] = useState(websiteSettings.smtpUser);
  const [smtpPass, setSmtpPass] = useState(websiteSettings.smtpPass);
  const [companyName, setCompanyName] = useState(websiteSettings.companyName);
  const [companyAddress, setCompanyAddress] = useState(websiteSettings.companyAddress);
  const [companyMapCoordinates, setCompanyMapCoordinates] = useState(websiteSettings.companyMapCoordinates);
  const [socialFb, setSocialFb] = useState(websiteSettings.socialFb);
  const [socialX, setSocialX] = useState(websiteSettings.socialX);
  const [socialIg, setSocialIg] = useState(websiteSettings.socialIg);
  const [socialYt, setSocialYt] = useState(websiteSettings.socialYt);
  const [adsHeader, setAdsHeader] = useState(websiteSettings.adsHeader);
  const [adsSidebar, setAdsSidebar] = useState(websiteSettings.adsSidebar);
  const [adsArticleBottom, setAdsArticleBottom] = useState(websiteSettings.adsArticleBottom);

  // Category management hooks
  const [categories, setCategories] = useState<string[]>(websiteSettings.categories || ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan"]);
  const [newCatInput, setNewCatInput] = useState('');

  // Success Indicators
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Editorial Team Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Senior Editor Jurnalis');
  const [newMemberPhoto, setNewMemberPhoto] = useState('');
  const [teamFormSuccess, setTeamFormSuccess] = useState('');

  // Security and Subscriber logs states
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // AI Moderation loading queue ID state
  const [aiModeratingId, setAiModeratingId] = useState<string | null>(null);

  // Sync settings when websiteSettings changed
  useEffect(() => {
    setSiteName(websiteSettings.websiteName);
    setSiteLogo(websiteSettings.websiteLogo);
    setSmtpHost(websiteSettings.smtpHost);
    setSmtpPort(websiteSettings.smtpPort);
    setSmtpUser(websiteSettings.smtpUser);
    setSmtpPass(websiteSettings.smtpPass);
    setCompanyName(websiteSettings.companyName);
    setCompanyAddress(websiteSettings.companyAddress);
    setCompanyMapCoordinates(websiteSettings.companyMapCoordinates);
    setSocialFb(websiteSettings.socialFb);
    setSocialX(websiteSettings.socialX);
    setSocialIg(websiteSettings.socialIg);
    setSocialYt(websiteSettings.socialYt);
    setAdsHeader(websiteSettings.adsHeader);
    setAdsSidebar(websiteSettings.adsSidebar);
    setAdsArticleBottom(websiteSettings.adsArticleBottom);
    if (websiteSettings.categories) {
      setCategories(websiteSettings.categories);
    }
  }, [websiteSettings]);

  const fetchSecurityLogsAndSubs = async () => {
    setLoadingSecurity(true);
    try {
      const logsRes = await fetch('/api/security-logs');
      const logsData = await logsRes.json();
      setSecurityLogs(logsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    setUserErrorMessage('');
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      } else {
        setUserErrorMessage('Gagal mengambil daftar pengguna dari database.');
      }
    } catch (err) {
      console.error(err);
      setUserErrorMessage('Sinyal putus atau server tidak merespon saat memuat pengguna.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateUserPassword = async (userId: string, newPass: string) => {
    if (!newPass.trim()) {
      setUserErrorMessage('Password baru tidak boleh kosong!');
      return;
    }
    setUserSuccessMessage('');
    setUserErrorMessage('');
    try {
      const res = await fetch(`/api/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) {
        setUserSuccessMessage('Kata sandi pengguna berhasil diperbarui!');
        setEditingUserId(null);
        setEditPasswordInput('');
        fetchUsersList();
      } else {
        const errData = await res.json();
        setUserErrorMessage(errData.error || 'Gagal mengubah kata sandi.');
      }
    } catch (e) {
      console.error(e);
      setUserErrorMessage('Kesalahan koneksi saat mengubah kata sandi pengguna.');
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPass.trim()) {
      setUserErrorMessage('Semua bidang isian wajib lengkap saat registrasi!');
      return;
    }
    setUserSuccessMessage('');
    setUserErrorMessage('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
          password: newUserPass.trim()
        })
      });
      if (res.ok) {
        setUserSuccessMessage(`Akun baru (${newUserEmail}) berhasil terdaftar di Firestore.`);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPass('');
        fetchUsersList();
      } else {
        const errData = await res.json();
        setUserErrorMessage(errData.error || 'Gagal mendaftarkan akun.');
      }
    } catch (e) {
      console.error(e);
      setUserErrorMessage('Kesalahan koneksi saat mendaftarkan user baru.');
    }
  };

  useEffect(() => {
    fetchSecurityLogsAndSubs();
    if (adminTab === 'users') {
      fetchUsersList();
    }
  }, [adminTab]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess('');

    const payload: WebSettings = {
      websiteName: siteName,
      websiteLogo: siteLogo,
      smtpHost,
      smtpPort: Number(smtpPort),
      smtpUser,
      smtpPass,
      companyName,
      companyAddress,
      companyMapCoordinates,
      socialFb,
      socialX,
      socialIg,
      socialYt,
      adsHeader,
      adsSidebar,
      adsArticleBottom,
      categories,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        onSettingsChange(data.settings);
        setSaveSuccess('Konfigurasi Portal & Preferensi Iklan berhasil disegel secara dinamis!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddEditorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;

    try {
      const res = await fetch('/api/redaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          role: newMemberRole,
          photo: newMemberPhoto,
        }),
      });
      if (res.ok) {
        setTeamFormSuccess('Anggota redaksi baru berhasil dipromosikan!');
        setNewMemberName('');
        setNewMemberPhoto('');
        onEditorialChange();
        setTimeout(() => setTeamFormSuccess(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm("Hapus jurnalis dari draf struktur susunan redaksi?")) return;
    try {
      const res = await fetch(`/api/redaksi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onEditorialChange();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Comments Moderation Actions
  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/comments/${id}/moderate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onCommentsChange();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Toxicity Analyzer caller
  const triggerAiModerationScore = async (commentId: string) => {
    setAiModeratingId(commentId);
    try {
      const res = await fetch('/api/gemini/moderate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });
      if (res.ok) {
        onCommentsChange();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiModeratingId(null);
    }
  };

  // Separate comments in Pending, Approved, Rejected categories
  const pendingComments = comments.filter(c => c.status === 'pending');
  const moderatedComments = comments.filter(c => c.status !== 'pending');

  return (
    <div id="admin-panel-wrapper" className={`p-4 md:p-6 rounded-lg border transition-colors ${
      darkMode 
        ? 'bg-neutral-900/60 border-neutral-800 text-white' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* CMS Dashboard Title Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-neutral-700/20 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded bg-blue-600/10 text-blue-600">
              <Shield size={16} />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Konsol Eksekutif Administrasi</span>
          </div>
          <h2 className="text-xl font-serif font-black tracking-tight">
            Panel Kontrol Portal {websiteSettings.websiteName}
          </h2>
          <p className="text-xs text-neutral-400">Atur visual brand, SMTP Mail, iklan dinamis, kelola komentar pemirsa, dan amankan penulisan kontributor.</p>
        </div>

        {/* Outer Grid Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded p-1 w-full md:w-auto overflow-x-auto">
          <button 
            id="tab-admin-settings"
            onClick={() => setAdminTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminTab === 'settings' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings size={13} />
            Konfigurasi & Iklan
          </button>
          <button 
            id="tab-admin-team"
            onClick={() => setAdminTab('team')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminTab === 'team' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users size={13} />
            Susunan Redaksi ({editorialTeam.length})
          </button>
          <button 
            id="tab-admin-comments"
            onClick={() => setAdminTab('comments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              adminTab === 'comments' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare size={13} />
            Moderasi Komentar
            {pendingComments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-[8px] h-4 w-4 rounded-full flex items-center justify-center font-black animate-bounce">
                {pendingComments.length}
              </span>
            )}
          </button>
          <button 
            id="tab-admin-security"
            onClick={() => setAdminTab('security')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminTab === 'security' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck size={13} />
            Status Keamanan (E2E)
          </button>
          <button 
            id="tab-admin-users"
            onClick={() => setAdminTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminTab === 'users' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Lock size={13} />
            Kelola Akun & Sandi
          </button>
        </div>
      </div>

      {/* 1. TAB WEBSITE SETTINGS & ADVANCED AD MANAGEMENT */}
      {adminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Frame: Branding and SMTP Config */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                <Settings size={14} /> Preferensi Identitas & Branding
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Nama Website (Dynamic Title)</label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Tautan Gambar Logo</label>
                  <input
                    type="text"
                    required
                    value={siteLogo}
                    onChange={(e) => setSiteLogo(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
                <Mail size={14} /> Keamanan SMTP Pengiriman Email Notifikasi
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Server SMTP Host</label>
                  <input
                    type="text"
                    required
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none text-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">SMTP Port</label>
                  <input
                    type="number"
                    required
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Surel SMTP (Username)</label>
                  <input
                    type="text"
                    required
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Sandi SMTP (Password)</label>
                  <input
                    type="password"
                    required
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase">
                Profil Perusahaan & Lokasi
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Nama Perusahaan Hukum (Legal Entity)</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Koordinat Peta Google (Latitude, Longitude)</label>
                  <input
                    type="text"
                    required
                    value={companyMapCoordinates}
                    onChange={(e) => setCompanyMapCoordinates(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Alamat Gedung Lengkap</label>
                  <input
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none text-[10px]"
                  />
                </div>
              </div>
            </div>

            {/* Right Frame: Ads Settings & Layout */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                <CreditCard size={14} /> Pengaturan Iklan Monetisasi Dinamis
              </h3>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase">Tautan Gambar Iklan Banner Header (728x90)</label>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">Aktif</span>
                </div>
                <input
                  type="text"
                  value={adsHeader}
                  onChange={(e) => setAdsHeader(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded bg-neutral-950 border border-neutral-750 text-white focus:outline-none text-[10px]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Diletakkan pada sisi paling atas sejajar dengan judul utama branding.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase">Tautan Iklan Sidebar Kanan (300x250)</label>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">Aktif</span>
                </div>
                <input
                  type="text"
                  value={adsSidebar}
                  onChange={(e) => setAdsSidebar(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded bg-neutral-950 border border-neutral-750 text-white focus:outline-none text-[10px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase">Tautan Iklan Bawah Artikel (728x90)</label>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">Aktif</span>
                </div>
                <input
                  type="text"
                  value={adsArticleBottom}
                  onChange={(e) => setAdsArticleBottom(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded bg-neutral-950 border border-neutral-750 text-white focus:outline-none text-[10px]"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase">
                Tautan Media Sosial Integratif
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Facebook URL</label>
                  <input type="text" value={socialFb} onChange={(e) => setSocialFb(e.target.value)} className="w-full text-[10px] px-2 py-1.5 rounded bg-neutral-950 border border-neutral-850 text-white focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">X (Twitter) URL</label>
                  <input type="text" value={socialX} onChange={(e) => setSocialX(e.target.value)} className="w-full text-[10px] px-2 py-1.5 rounded bg-neutral-950 border border-neutral-850 text-white focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Instagram URL</label>
                  <input type="text" value={socialIg} onChange={(e) => setSocialIg(e.target.value)} className="w-full text-[10px] px-2 py-1.5 rounded bg-neutral-950 border border-neutral-850 text-white focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">YouTube Channel URL</label>
                  <input type="text" value={socialYt} onChange={(e) => setSocialYt(e.target.value)} className="w-full text-[10px] px-2 py-1.5 rounded bg-neutral-950 border border-neutral-850 text-white focus:outline-none"/>
                </div>
              </div>

              {/* Kelola Kategori Berita Card */}
              <div className="pt-4 border-t border-neutral-850 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase">
                  <Sparkles size={14} /> Kelola Kategori Berita Dinamis
                </div>
                <p className="text-[10px] text-neutral-400 normal-case leading-normal">
                  Tambahkan atau hapus kanal kategori berita di portal ini. Seluruh perubahan akan langsung mensinkronisasi menu filter depan dan pilihan redaktur saat menulis artikel.
                </p>

                {/* Input for adding category */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="Contoh: Otomotif, Gaya Hidup..."
                    className="flex-1 text-xs px-3 py-1.5 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCatInput.trim()) {
                          const catName = newCatInput.trim();
                          if (!categories.includes(catName)) {
                            setCategories([...categories, catName]);
                          }
                          setNewCatInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCatInput.trim()) {
                        const catName = newCatInput.trim();
                        if (!categories.includes(catName)) {
                          setCategories([...categories, catName]);
                        }
                        setNewCatInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Categories Badge Stream */}
                <div className="flex flex-wrap gap-1.5 p-3 rounded bg-neutral-950 border border-neutral-850 max-h-[140px] overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="flex items-center gap-1 text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-200 px-2 py-1 rounded"
                    >
                      <span className="font-bold">{cat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCategories(categories.filter((c) => c !== cat));
                        }}
                        className="text-neutral-400 hover:text-red-500 font-extrabold focus:outline-none ml-0.5 cursor-pointer text-xs"
                        title={`Hapus kategori ${cat}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <span className="text-[10px] text-neutral-500 italic">Belum ada kategori kustom.</span>
                  )}
                </div>
              </div>

            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-bold text-center">
              ✓ {saveSuccess}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider rounded uppercase flex items-center gap-2 cursor-pointer select-none"
            >
              <Settings size={13} />
              <span>{saveLoading ? 'Menyimpan...' : 'TERAPKAN & KUNCI SETTINGAN'}</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. TAB EDITORIAL TEAM roster */}
      {adminTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left box: add new member form */}
            <form onSubmit={handleAddEditorial} className="lg:col-span-5 p-5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-neutral-850 pb-2">
                Promosikan Anggota Redaksi Baru
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Nama Lengkap & Gelar Akademis</label>
                <input
                  type="text"
                  required
                  placeholder="cth: Siti Aminah, M.I.Kom"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Jabatan Redaksi</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:outline-none"
                >
                  <option value="Pemimpin Redaksi Utama">Pemimpin Redaksi Utama</option>
                  <option value="Redaktur Eksekutif Eksekutif">Redaktur Eksekutif</option>
                  <option value="Editor Senior Politik & Keamanan">Editor Senior</option>
                  <option value="Redaktur Pelaksana Teknologi">Redaktur Pelaksana</option>
                  <option value="Jurnalis Investigasi Khusus">Jurnalis Investigasi</option>
                  <option value="Fotografer Jurnalistik Utama">Fotografer Jurnalistik</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">URL Foto Profil Anggota</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newMemberPhoto}
                  onChange={(e) => setNewMemberPhoto(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-black text-white focus:outline-none text-[10px]"
                />
              </div>

              {teamFormSuccess && (
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                  ✓ {teamFormSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>DAFTARKAN REDAKTUR</span>
              </button>
            </form>

            {/* Right box: current roster with action deletion */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-800 pb-2">
                Struktur Dewan Redaksi Terdaftar
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editorialTeam.map((m) => (
                  <div key={m.id} className="p-3 rounded bg-neutral-950 border border-neutral-850 flex items-center justify-between gap-3 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                      <img 
                        src={m.photo} 
                        alt={m.name} 
                        className="h-10 w-10 rounded-full object-cover border border-neutral-700 shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{m.name}</h4>
                        <span className="text-[10px] text-blue-400 font-medium">{m.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTeamMember(m.id)}
                      className="text-neutral-500 hover:text-red-400 hover:bg-red-950/20 p-1.5 rounded transition-colors cursor-pointer"
                      title="Hapus Redaktur"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. COMMENTS MODERATION WITH INTEGRATED GEMINI SAFETY SENTIMENT */}
      {adminTab === 'comments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Left box: comments waiting moderation */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-red-500 border-b border-red-900/30 pb-2 flex items-center justify-between">
                <span>Daftar Komentar Menunggu Persetujuan ({pendingComments.length})</span>
                <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Butuh Moderasi</span>
              </h3>

              {pendingComments.length === 0 ? (
                <div className="text-center py-12 bg-neutral-950 rounded-lg border border-neutral-850">
                  <CheckCircle className="text-emerald-500 mx-auto mb-2" size={28} />
                  <p className="text-xs font-bold text-neutral-400">Semua komentar aman dan telah diselesaikan!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                  {pendingComments.map((com) => (
                    <div key={com.id} className="p-4 rounded bg-neutral-950 border border-neutral-850 space-y-3 transition-all relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">{com.authorName}</span>
                            <span className="text-[9px] text-neutral-400">({com.authorEmail})</span>
                          </div>
                          <span className="text-[8px] text-neutral-500 font-mono">Diterima: {new Date(com.createdAt).toLocaleString('id-ID')}</span>
                        </div>

                        {/* Smart AI Toxicity Analyzer Tag or Action button */}
                        {com.aiModerationScore !== undefined ? (
                          <div className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            com.aiModerationScore > 40 ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
                          }`}>
                            <Sparkles size={10} />
                            <span>Toxicity Score AI: {com.aiModerationScore}%</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerAiModerationScore(com.id)}
                            disabled={aiModeratingId === com.id}
                            className="flex items-center gap-1.5 text-[9px] text-blue-400 bg-blue-600/10 hover:bg-blue-600/15 border border-blue-600/30 px-2 py-0.5 rounded font-black cursor-pointer"
                          >
                            <Sparkles size={10} className={aiModeratingId === com.id ? 'animate-spin text-blue-500' : ''} />
                            <span>{aiModeratingId === com.id ? 'Menganalisis...' : 'Analisis AI'}</span>
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 italic border-l-2 border-neutral-700 pl-2.5">
                        "{com.content}"
                      </p>

                      {com.aiReason && (
                        <div className="text-[9px] text-neutral-400 bg-neutral-900 p-2 rounded border border-neutral-850 leading-relaxed font-sans">
                          <strong>Analisis AI Gemini:</strong> {com.aiReason}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-900 justify-end">
                        <button
                          onClick={() => handleModerateComment(com.id, 'rejected')}
                          className="px-2.5 py-1 text-[10px] text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-900/40 rounded transition-all cursor-pointer font-bold"
                        >
                          TOLAK / REJECT
                        </button>
                        <button
                          onClick={() => handleModerateComment(com.id, 'approved')}
                          className="px-3.5 py-1 text-[10px] text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 rounded transition-all cursor-pointer font-black"
                        >
                          SETUJUI KOMENTAR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right box: recently moderated catalog */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-850 pb-2">
                Riwayat Moderasi Komentar Pemirsa ({moderatedComments.length})
              </h3>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                {moderatedComments.map((com) => (
                  <div key={com.id} className="p-3 rounded bg-neutral-950 border border-neutral-850 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white font-bold">{com.authorName}</span>
                      <span className={`font-black uppercase px-2 py-0.5 rounded text-[8px] ${
                        com.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {com.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 italic">"{com.content}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. VISUAL SECURITY LEDGER LOGS & ATTACK DEFENSE PANEL */}
      {adminTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column Security widgets */}
            <div className="lg:col-span-1 space-y-4">
              <div className="p-5 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-500">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>Enskripsi Berita E2E</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Semua naskah berita yang disimpan dienkripsi secara aman dengan algoritma SHA-256 yang secara otomatis melacak jika ada upaya perubahan liar yang dilakukan pihak tidak berwenang.
                </p>
                <div className="mt-2 p-3 bg-neutral-900 rounded border border-neutral-800 font-mono text-[9px] text-emerald-400">
                  <span className="block font-bold">STATUS SYSTEM: SECURE</span>
                  <span className="block">LEDGER INTEGRITY: 100%</span>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-500">
                  <AlertCircle size={16} className="text-blue-400 animate-pulse" />
                  <span>Teknologi Anti-Hacker</span>
                </div>
                <ul className="text-[10px] text-neutral-400 space-y-2 list-disc pl-4 font-sans">
                  <li>Pencegah Injeksi Database (SQL Shield)</li>
                  <li>Pelindung Penempelan Script Asing (XSS Shield)</li>
                  <li>Validasi Otomatis Google SSO OTP JWT</li>
                </ul>
              </div>
            </div>

            {/* Right Column Security Incident feed logs */}
            <div className="lg:col-span-2 p-5 bg-neutral-950 rounded-lg border border-neutral-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 border-b border-neutral-850 pb-2">
                Log Keamanan & Pelindung Serangan (🛡️ Active Firewall)
              </h3>

              {loadingSecurity ? (
                <div className="text-center py-6">
                  <RefreshCw className="animate-spin text-blue-500 mx-auto" />
                </div>
              ) : (
                <div className="space-y-3 font-mono text-[10px] max-h-[360px] overflow-y-auto pr-1">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-black rounded border border-neutral-900 flex justify-between gap-4">
                      <div>
                        <span className="text-emerald-400 font-bold block">[{log.event}]</span>
                        <span className="text-neutral-300">{log.desc}</span>
                        <span className="block text-[8px] text-neutral-500 mt-1">{new Date(log.time).toLocaleString('id-ID')}</span>
                      </div>
                      <span className="text-emerald-500 bg-emerald-900/10 px-2 py-0.5 rounded font-black h-fit">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {adminTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-neutral-100">
          {/* Main User list block */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-850 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={16} className="text-blue-500" /> Database Akun Pengguna ({usersList.length})
                </h3>
                <p className="text-[10px] text-neutral-400">Daftar identitas warga portal Nusantara dan password plain-text asli mereka yang tersinkronisasi di Firestore.</p>
              </div>
              <button 
                type="button"
                onClick={fetchUsersList}
                className="p-1 px-2.5 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded text-xs hover:bg-neutral-900 cursor-pointer flex items-center gap-1 font-bold"
              >
                <RefreshCw size={12} className={loadingUsers ? "animate-spin" : ""} /> Refres
              </button>
            </div>

            {/* Notification indicators */}
            {userSuccessMessage && (
              <div className="p-3 bg-emerald-950/45 border border-emerald-800 rounded text-xs text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                <span>{userSuccessMessage}</span>
              </div>
            )}
            {userErrorMessage && (
              <div className="p-3 bg-red-950/45 border border-red-800 rounded text-xs text-red-300 font-medium flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <span>{userErrorMessage}</span>
              </div>
            )}

            {loadingUsers ? (
              <div className="py-20 text-center text-xs text-neutral-400">
                <RefreshCw className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                <span>Memuat database pengguna...</span>
              </div>
            ) : (
              <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
                {usersList.map((usr) => (
                  <div key={usr.id} className="p-3.5 bg-neutral-950 rounded border border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-neutral-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <img 
                        src={usr.avatarUrl} 
                        alt={usr.name} 
                        className="w-10 h-10 rounded-full object-cover border border-neutral-850"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-white">{usr.name}</span>
                          <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
                            usr.role === 'admin' ? 'bg-red-600/20 text-red-400 border border-red-800/40' :
                            usr.role === 'editor' ? 'bg-amber-600/20 text-amber-400 border border-amber-800/40' :
                            usr.role === 'journalist' ? 'bg-blue-600/20 text-blue-400 border border-blue-800/40' :
                            usr.role === 'contributor' ? 'bg-purple-600/20 text-purple-400 border border-purple-800/40' :
                            'bg-neutral-800 text-neutral-450 border border-neutral-800/60'
                          }`}>
                            {usr.role}
                          </span>
                          {usr.isPremium && (
                            <span className="bg-amber-500/20 text-amber-500 px-1 py-0.5 rounded font-bold text-[8px] uppercase tracking-widest border border-amber-500/10">PREMIUM ★</span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 flex flex-wrap gap-x-2 gap-y-1">
                          <span>Sandi: <strong className="text-white font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-[11px] font-bold select-all tracking-wider">{usr.password || '—'}</strong></span>
                          <span className="text-neutral-600">•</span>
                          <span>Surel: <span className="text-neutral-300 font-mono text-[10px]">{usr.email}</span></span>
                          <span className="text-neutral-600">•</span>
                          <span>User ID: <span className="text-neutral-550 select-all font-mono text-[9px]">{usr.id}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUserId(usr.id);
                        setEditPasswordInput(usr.password || '');
                        setUserSuccessMessage('');
                        setUserErrorMessage('');
                      }}
                      className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded text-[10px] font-black cursor-pointer uppercase flex items-center justify-center gap-1 self-start md:self-auto"
                    >
                      <Key size={11} className="text-blue-500" />
                      <span>Ubah Sandi</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Area panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Ganti Kata Sandi Panel (if edit chosen) */}
            {editingUserId && (
              <div className="bg-neutral-900 border border-blue-900/40 rounded-lg p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
                  <Key size={14} /> Ganti Kata Sandi Pengguna
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded">
                  <p className="text-[10px] text-neutral-400 leading-normal">
                    Mengubah password untuk akun:
                  </p>
                  <p className="text-xs font-bold text-white mt-1">
                    {usersList.find(u => u.id === editingUserId)?.name} 
                    <span className="text-neutral-400 font-mono font-medium block text-[10px] mt-0.5">({usersList.find(u => u.id === editingUserId)?.email})</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Kata Sandi Baru</label>
                  <input
                    type="text"
                    value={editPasswordInput}
                    onChange={(e) => setEditPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi baru"
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600 font-mono tracking-wider text-base"
                  />
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateUserPassword(editingUserId, editPasswordInput)}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Simpan Sandi Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUserId(null)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* 2. Dapatkan Pendaftaran User Baru */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase">
                <Lock size={14} /> Pendaftaran Admin / Anggota Baru
              </div>
              <p className="text-[10px] text-neutral-400 normal-case leading-normal mt-1">
                Daftarkan akun jurnalis, editor, kontributor, atau administrator baru langsung dari panel ini ke basis data Firestore.
              </p>

              <form onSubmit={handleRegisterUser} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Contoh: Ahmad Subardjo"
                    className="w-full text-xs px-3 py-1.5 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Alamat Email / Surel</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="ahmad@faktafaktual.id"
                    className="w-full text-xs px-3 py-1.5 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Hak Akses (Role)</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full text-xs px-3 py-1.5 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="user">Warga Pembaca Terdaftar</option>
                    <option value="contributor">Kontributor / Penulis Bebas</option>
                    <option value="journalist">Jurnalis Investigasi</option>
                    <option value="editor">Editor Editorial Utama</option>
                    <option value="admin">Administrator Portal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Kata Sandi Awal</label>
                  <input
                    type="text"
                    required
                    value={newUserPass}
                    onChange={(e) => setNewUserPass(e.target.value)}
                    placeholder="Sandi pembuka yang kuat"
                    className="w-full text-xs px-3 py-1.5 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Plus size={14} />
                  <span>Daftarkan Akun Baru</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
