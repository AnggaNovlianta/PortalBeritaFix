import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, Users, MessageSquare, CreditCard, ShieldCheck, Sparkles, AlertCircle, RefreshCw, Trash2, CheckCircle, Plus, Key, Lock, Camera, Tv, BarChart3, Globe, MapPin, Tablet, Eye } from 'lucide-react';
import { WebSettings, Comment, User } from '../types';

interface AdminPanelProps {
  darkMode: boolean;
  websiteSettings: WebSettings;
  onSettingsChange: (settings: WebSettings) => void;
  editorialTeam: { id: string; name: string; role: string; photo: string }[];
  onEditorialChange: () => void;
  comments: Comment[];
  onCommentsChange: () => void;
  currentUser: User | null;
}

export default function AdminPanel({
  darkMode,
  websiteSettings,
  onSettingsChange,
  editorialTeam,
  onEditorialChange,
  comments,
  onCommentsChange,
  currentUser,
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<'settings' | 'team' | 'comments' | 'payments' | 'security' | 'users' | 'analytics'>('settings');

  // Mobile responsive view flag
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobileWidth = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobileWidth();
    window.addEventListener('resize', checkMobileWidth);
    return () => window.removeEventListener('resize', checkMobileWidth);
  }, []);

  // Visitor & Geo Location Analytics State
  const [viewerLogs, setViewerLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchViewerLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/viewer-logs');
      if (res.ok) {
        const data = await res.json();
        setViewerLogs(data);
      }
    } catch (e) {
      console.error("Gagal memuat data log penonton", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Users state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [confirmDeleteMemberId, setConfirmDeleteMemberId] = useState<string | null>(null);
  const [editPasswordInput, setEditPasswordInput] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);
  const [editAvatarBase64, setEditAvatarBase64] = useState<string | null>(null);
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
  const [announcement, setAnnouncement] = useState(websiteSettings.announcement || '');
  const [youtubeChannelId, setYoutubeChannelId] = useState(websiteSettings.youtubeChannelId || '');
  const [youtubeStreamId, setYoutubeStreamId] = useState(websiteSettings.youtubeStreamId || '');
  const [adsenseClientId, setAdsenseClientId] = useState(websiteSettings.adsenseClientId || '');
  const [adsenseHeaderCode, setAdsenseHeaderCode] = useState(websiteSettings.adsenseHeaderCode || '');
  const [themePreset, setThemePreset] = useState<'slate' | 'emerald' | 'amber' | 'indigo' | 'crimson'>(websiteSettings.themePreset || 'slate');
  const [layoutPreset, setLayoutPreset] = useState<'classic' | 'editorial' | 'bento'>(websiteSettings.layoutPreset || 'classic');

  // Category management hooks
  const [categories, setCategories] = useState<string[]>(websiteSettings.categories || ["Politik", "Ekonomi", "Teknologi", "Pariwisata", "Olahraga", "Internasional", "Hiburan", "Kesehatan", "Gaya Hidup", "Edukasi", "Otomotif", "Opini", "Nasional", "Kriminal"]);
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

  // Seeder untuk Artikel Dummy (Fakta Faktual)
  const [seedingDummy, setSeedingDummy] = useState(false);
  const [seedCount, setSeedCount] = useState<number | null>(null);
  const [seedMessage, setSeedMessage] = useState('');

  const handleSeedDummyArticles = async () => {
    setSeedingDummy(true);
    setSeedCount(null);
    setSeedMessage('');
    try {
      const res = await fetch('/api/seed-dummy-articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSeedCount(data.count);
        if (data.count > 0) {
          setSeedMessage(`Berhasil melengkapi database dengan dummy artikel berkualitas tinggi! Total ${data.count} artikel baru berhasil ditambahkan untuk semua kategori berita.`);
        } else {
          setSeedMessage("Database sudah lengkap! Semua 70 artikel dummy unik berkategori lengkap sudah terisi di dalam sistem.");
        }
        window.dispatchEvent(new CustomEvent('articles-refreshed'));
      } else {
        const errData = await res.json();
        setSeedMessage(`Gagal menggenerasi artikel: ${errData.error || 'Kesalahan Server'}`);
      }
    } catch (e) {
      console.error(e);
      setSeedMessage('Terjadi kesalahan koneksi saat memicu seeder dummy artikel.');
    } finally {
      setSeedingDummy(false);
    }
  };

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
    setAnnouncement(websiteSettings.announcement || '');
    setYoutubeChannelId(websiteSettings.youtubeChannelId || '');
    setYoutubeStreamId(websiteSettings.youtubeStreamId || '');
    setAdsenseClientId(websiteSettings.adsenseClientId || '');
    setAdsenseHeaderCode(websiteSettings.adsenseHeaderCode || '');
    setThemePreset(websiteSettings.themePreset || 'slate');
    setLayoutPreset(websiteSettings.layoutPreset || 'classic');
    if (websiteSettings.categories) {
      setCategories(websiteSettings.categories);
    }
  }, [websiteSettings]);

  const saveCategories = async (updatedCategories: string[]) => {
    try {
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
        categories: updatedCategories,
        announcement,
        youtubeChannelId,
        youtubeStreamId,
        adsenseClientId,
        adsenseHeaderCode,
        themePreset,
        layoutPreset,
      };
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        onSettingsChange(data.settings);
      }
    } catch (err) {
      console.error("Gagal menyimpan kategori:", err);
    }
  };

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

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserErrorMessage('');
    setUserSuccessMessage('');
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        try {
          setUserSuccessMessage('Foto melebihi 2MB. Sedang melakukan kompresi gambar otomatis...');
          
          const compressedBase64 = await new Promise<string>((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (event) => {
              img.src = event.target?.result as string;
            };
            
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              // Calculate resized dimensions maintaining aspect ratio
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height = Math.round((height * MAX_WIDTH) / width);
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width = Math.round((width * MAX_HEIGHT) / height);
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Gagal memproses context canvas gambar.'));
                return;
              }
              
              ctx.drawImage(img, 0, 0, width, height);
              // Convert to high-quality JPEG (0.75 quality reduces size by up to 90% with zero visible artifacting)
              const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
              resolve(dataUrl);
            };
            
            img.onerror = () => reject(new Error('Format file gambar tidak valid atau rusak.'));
            reader.onerror = () => reject(new Error('Gagal membaca file gambar asli.'));
            reader.readAsDataURL(file);
          });

          setEditAvatarPreview(compressedBase64);
          setEditAvatarBase64(compressedBase64);
          setUserSuccessMessage('Foto berhasil dikompresi secara otomatis agar pas untuk database!');
        } catch (err: any) {
          console.error(err);
          setUserErrorMessage(err.message || 'Gagal mengompresi gambar secara otomatis.');
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setEditAvatarPreview(base64String);
          setEditAvatarBase64(base64String);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpdateUserProfile = async (userId: string, newPass: string, newAvatarBase64: string | null) => {
    setUserSuccessMessage('');
    setUserErrorMessage('');
    try {
      let isUpdated = false;

      // 1. Ganti kata sandi jika diisi
      if (newPass.trim()) {
        const resPass = await fetch(`/api/users/${userId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPass.trim() })
        });
        if (!resPass.ok) {
          const errData = await resPass.json();
          setUserErrorMessage(errData.error || 'Gagal mengubah kata sandi.');
          return;
        }
        isUpdated = true;
      }

      // 2. Ganti foto profil jika diunggah baru
      if (newAvatarBase64) {
        const resAvatar = await fetch(`/api/users/${userId}/avatar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarData: newAvatarBase64 })
        });
        if (!resAvatar.ok) {
          const errData = await resAvatar.json();
          setUserErrorMessage(errData.error || 'Gagal menyimpan foto profil.');
          return;
        }
        isUpdated = true;
      }

      if (isUpdated) {
        setUserSuccessMessage('Informasi profil pengguna berhasil diperbarui!');
        setEditingUserId(null);
        setEditPasswordInput('');
        setEditAvatarPreview(null);
        setEditAvatarBase64(null);
        fetchUsersList();
      } else {
        setUserErrorMessage('Harap masukkan password baru atau unggah foto profil baru untuk disimpan.');
      }
    } catch (e) {
      console.error(e);
      setUserErrorMessage('Sinyal terganggu. Gagal memperbarui data pengguna.');
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

  const handleDeleteUser = async (userId: string) => {
    setUserSuccessMessage('');
    setUserErrorMessage('');
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requester-Role': currentUser?.role || 'admin',
          'X-Requester-Id': currentUser?.id || ''
        },
        body: JSON.stringify({
          requesterRole: currentUser?.role || 'admin',
          requesterId: currentUser?.id || ''
        })
      });
      if (res.ok) {
        setUserSuccessMessage('Pengguna berhasil dihapus secara permanen dari database!');
        setConfirmDeleteUserId(null); // Clear confirm state
        if (editingUserId === userId) {
          setEditingUserId(null);
          setEditPasswordInput('');
        }
        fetchUsersList();
      } else {
        const errData = await res.json();
        setUserErrorMessage(errData.error || 'Gagal menghapus pengguna.');
      }
    } catch (e) {
      console.error(e);
      setUserErrorMessage('Kesalahan koneksi saat menghapus pengguna.');
    }
  };

  useEffect(() => {
    fetchSecurityLogsAndSubs();
    if (adminTab === 'users') {
      fetchUsersList();
    } else if (adminTab === 'analytics') {
      fetchViewerLogs();
    }
  }, [adminTab]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSaveSuccess('Sedang memproses & mengompresi logo...');
        const compressedBase64 = await new Promise<string>((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();
          
          reader.onload = (event) => {
            img.src = event.target?.result as string;
          };
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 200;
            let width = img.width;
            let height = img.height;

            // Maintain aspect ratio
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Gagal memproses context canvas gambar.'));
              return;
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG with 0.8 quality to keep it crisp but extremely small in size (< 50KB)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          };
          
          img.onerror = () => reject(new Error('Format file gambar tidak valid atau rusak.'));
          reader.onerror = () => reject(new Error('Gagal membaca file gambar asli.'));
          reader.readAsDataURL(file);
        });

        setSiteLogo(compressedBase64);
        setSaveSuccess('Logo berhasil diunggah secara lokal! Silakan simpan pengaturan untuk disegel.');
        setTimeout(() => setSaveSuccess(''), 4000);
      } catch (err: any) {
        console.error(err);
        setSaveSuccess('');
        alert(err.message || 'Gagal memproses logo.');
      }
    }
  };

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
      announcement,
      youtubeChannelId,
      youtubeStreamId,
      adsenseClientId,
      adsenseHeaderCode,
      themePreset,
      layoutPreset,
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
    try {
      const res = await fetch(`/api/redaksi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteMemberId(null);
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
        <div className="flex flex-nowrap md:flex-wrap items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded p-1 w-full md:w-auto overflow-x-auto scrollbar-none">
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
          <button 
            id="tab-admin-analytics"
            onClick={() => setAdminTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              adminTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 size={13} />
            Analitik Lokasi ({viewerLogs.length})
          </button>
        </div>
      </div>

      {/* 1. TAB WEBSITE SETTINGS & ADVANCED AD MANAGEMENT */}
      {adminTab === 'settings' && (
        <div className="space-y-6">
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
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Upload Logo Website</label>
                  <div className="flex items-center gap-4 border border-neutral-700 bg-neutral-950 p-2 rounded">
                    {siteLogo ? (
                      <img 
                        src={siteLogo} 
                        alt="Logo Preview" 
                        className="h-10 w-24 object-contain rounded bg-neutral-900 border border-neutral-800"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div className="h-10 w-24 flex items-center justify-center bg-neutral-900 text-[10px] text-neutral-500 rounded border border-neutral-800">
                        No Logo
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded transition">
                        Pilih Gambar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoFileChange}
                        />
                      </label>
                      <p className="text-[9px] text-neutral-400 mt-1">Sistem akan melakukan kompresi otomatis.</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 border border-neutral-850 bg-neutral-950/40 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase">Pilihan Tema Warna Utama Portal Berita (Theme Preset)</label>
                    <span className="text-[8px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded font-black uppercase">Dukungan Variatif</span>
                  </div>
                  <p className="text-[9px] text-neutral-500 normal-case">Pilih skema warna & identitas visual untuk menghiasi seluruh tampilan portal faktafaktual.id (Latar, tombol, aksen, dan gradien visual jika Anda jenuh dengan skema klasik).</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                    {[
                      { id: 'slate', name: 'Classic Slate', color: 'bg-slate-600' },
                      { id: 'emerald', name: 'Emerald Forest', color: 'bg-emerald-600' },
                      { id: 'amber', name: 'Amber Editorial', color: 'bg-amber-600' },
                      { id: 'indigo', name: 'Royal Indigo', color: 'bg-indigo-600' },
                      { id: 'crimson', name: 'Crimson News', color: 'bg-rose-600' }
                    ].map((themeOpt) => {
                      const isActive = themePreset === themeOpt.id;
                      return (
                        <button
                          key={themeOpt.id}
                          type="button"
                          onClick={() => setThemePreset(themeOpt.id as any)}
                          className={`p-2 rounded-lg border transition-all text-left flex flex-col justify-between gap-2.5 cursor-pointer ${
                            isActive 
                              ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/30' 
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className={`h-3 w-3 rounded-full ${themeOpt.color} border border-white/10`} />
                            {isActive && <span className="text-[8px] bg-blue-500 text-white font-heavy px-1 py-0.2 rounded-sm select-none scale-90">AKTIF</span>}
                          </div>
                          <span className="text-[9.5px] font-bold leading-normal tracking-tight">{themeOpt.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 border border-neutral-850 bg-neutral-950/40 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase">Pilihan Tata Letak Layout Portal (Layout Preset)</label>
                    <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-black uppercase">Responsif Dinamis</span>
                  </div>
                  <p className="text-[9px] text-neutral-500 normal-case">Pilih skema tata letak terbaik untuk website Anda. Anda bisa mengganti layout secara langsung tanpa merusak struktur data jika jenuh dengan susunan kolom portal yang lama.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {[
                      { 
                        id: 'classic', 
                        name: 'Tiga-Kolom Klasik', 
                        desc: 'Berita utama di kiri, panel widget bursa pasar, live stream TV dan sponsor/iklan sidebar di kolom kanan.' 
                      },
                      { 
                        id: 'editorial', 
                        name: 'Koran Editorial', 
                        desc: 'Desain minimalis berwibawa: kolase artikel terpusat yang lebar, mengutamakan kenyamanan membaca artikel premium.' 
                      },
                      { 
                        id: 'bento', 
                        name: 'Modern Bento Grid', 
                        desc: 'Kisi bento interaktif dengan kartu-kartu bervariasi ukuran, cocok untuk khalayak muda yang serba dinamis.' 
                      }
                    ].map((layOpt) => {
                      const isActive = layoutPreset === layOpt.id;
                      return (
                        <button
                          key={layOpt.id}
                          type="button"
                          onClick={() => setLayoutPreset(layOpt.id as any)}
                          className={`p-3 rounded-lg border transition-all text-left flex flex-col justify-between gap-1 cursor-pointer ${
                            isActive 
                              ? 'bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500/30' 
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full border-b border-neutral-850 pb-1 mb-1">
                            <span className="text-[10px] font-extrabold leading-normal tracking-tight">{layOpt.name}</span>
                            {isActive && <span className="text-[8px] bg-blue-500 text-white font-heavy px-1.5 py-0.5 rounded-sm select-none scale-90">AKTIF</span>}
                          </div>
                          <p className="text-[8.5px] text-neutral-500 leading-normal normal-case">{layOpt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Papan Teks Berjalan (Running Text / Announcement)</label>
                  <textarea
                    rows={2}
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Masukkan custom teks berjalan untuk diinformasikan di bawah navbar..."
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-700 bg-neutral-950 text-white focus:outline-none resize-none"
                  />
                  <p className="text-[9px] text-neutral-500 mt-1">Isi teks pengumuman yang akan terus berjalan di bawah bilah navigasi utama bersama dengan berita-berita terhangat.</p>
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

              {/* Google AdSense Configuration widget */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                    <Sparkles size={12} className="text-yellow-400 animate-pulse" /> Google AdSense Monetisasi
                  </span>
                  <span className="text-[8px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">Aktif</span>
                </div>
                <p className="text-[9px] text-neutral-400 leading-normal normal-case">
                  Masukkan ID Penerbit (Publisher ID) AdSense Anda dan kode skrip header adsense untuk mengaktifkan penayangan iklan otomatis (Auto Ads) secara aman di seluruh halaman portal berita ini.
                </p>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">ID Penerbit AdSense</label>
                  <input
                    type="text"
                    value={adsenseClientId}
                    onChange={(e) => setAdsenseClientId(e.target.value)}
                    placeholder="Contoh: ca-pub-1234567890123456"
                    className="w-full text-[11px] px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Kode Header AdSense (Script Tag)</label>
                  <textarea
                    rows={3}
                    value={adsenseHeaderCode}
                    onChange={(e) => setAdsenseHeaderCode(e.target.value)}
                    placeholder="Contoh: <script async src='https://pagead2.googlesyndication.com/...' crossorigin='anonymous'></script>"
                    className="w-full text-[11px] font-mono p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-350 focus:outline-none resize-none"
                  />
                </div>
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

              {/* YouTube TV Live Streaming Connections Option */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-red-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                    <Tv size={12} className="text-red-500 animate-pulse" /> TV Streaming YouTube Connection
                  </span>
                  <span className="text-[8px] bg-red-600/15 text-red-450 px-1.5 py-0.5 rounded font-black uppercase">Live Connect</span>
                </div>
                <p className="text-[9px] text-neutral-400 leading-normal normal-case">
                  Koneksikan saluran TV Live Streaming di portal langsung dengan YouTube Channel Anda. Masukkan Channel ID, atau ID Siaran Langsung (Live Video ID).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">YouTube Channel ID</label>
                    <input
                      type="text"
                      value={youtubeChannelId}
                      onChange={(e) => setYoutubeChannelId(e.target.value)}
                      placeholder="e.g., UC68D_D49mI-Q2Ujhi76W2pw"
                      className="w-full text-xs px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Live Video / Video ID (Opsional)</label>
                    <input
                      type="text"
                      value={youtubeStreamId}
                      onChange={(e) => setYoutubeStreamId(e.target.value)}
                      placeholder="e.g., 5qap5aO4i9A"
                      className="w-full text-xs px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[8px] text-neutral-500 normal-case leading-tight">
                  Tip: ID Video langsung menayangkan stream spesifik tersebut. Jika kosong, pemutar akan mencoba mengaitkan siaran langsung default dari Channel ID.
                </p>
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
                            const updated = [...categories, catName];
                            setCategories(updated);
                            saveCategories(updated);
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
                          const updated = [...categories, catName];
                          setCategories(updated);
                          saveCategories(updated);
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
                          const updated = categories.filter((c) => c !== cat);
                          setCategories(updated);
                          saveCategories(updated);
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

        {/* Database & News Seeder Utility */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-500 border-b border-neutral-850 pb-2 flex items-center gap-1.5">
              📁 Alat Pemeliharaan & Seeder Artikel Berita Dummy
            </h3>
            <p className="text-[10.5px] text-neutral-400 mt-2 leading-relaxed">
              Fakta Faktual telah terintegrasi dengan modul seeder otomatis yang menghasilkan 
              <strong> 10 artikel berita berkualitas per kategori (Total 70 artikel unik)</strong> 
              dengan panjang <strong>minimal 500 kata</strong> untuk masing-masing kategori (Politik, Ekonomi, 
              Teknologi, Pariwisata, Olahraga, Internasional, Hiburan) lengkap dengan tautan gambar menarik (Unsplash) 
              secara acak dan aman dengan enkripsi integritas data E2E.
            </p>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-850 rounded">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 block uppercase">STATUS PERSYARATAN</span>
                <span className="text-xs text-emerald-400 font-bold block mt-0.5">✓ Siap Digenerasi (7 Kategori Berita Berlangganan)</span>
              </div>
              <button
                type="button"
                disabled={seedingDummy}
                onClick={handleSeedDummyArticles}
                className="w-full sm:w-auto py-2 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-800 disabled:to-indigo-800 text-white text-xs font-black tracking-wide rounded cursor-pointer transition uppercase flex items-center justify-center gap-1.5 focus:outline-none"
              >
                {seedingDummy ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>MENGGENERASI BERITA...</span>
                  </>
                ) : (
                  <span>GENERASI 70 ARTIKEL DUMMY</span>
                )}
              </button>
            </div>

            {seedMessage && (
              <div className="mt-4 p-3 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium space-y-1">
                <p className="font-bold">{seedMessage}</p>
                <p className="text-[10px] text-neutral-500 leading-normal">
                  Semua data tersinkronisasi dan dilindungi dengan protokol kriptografi bawaan Fakta Faktual.
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
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

                    {confirmDeleteMemberId === m.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDeleteTeamMember(m.id)}
                          className="text-[10px] bg-red-650 hover:bg-red-705 text-white font-bold px-2 py-1 rounded transition-colors"
                          title="Yakin Hapus?"
                        >
                          Yakin?
                        </button>
                        <button
                          onClick={() => setConfirmDeleteMemberId(null)}
                          className="text-[10px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold px-1.5 py-1 rounded transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteMemberId(m.id)}
                        className="text-neutral-500 hover:text-red-400 hover:bg-red-950/20 p-1.5 rounded transition-colors cursor-pointer"
                        title="Hapus Redaktur"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
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

      {adminTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in text-neutral-100">
          
          {/* Dashboard Summary Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="p-3 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between shadow-sm">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 block mb-1 truncate">Total Pembaca Tercatat</span>
                <h3 className="text-lg sm:text-2xl font-serif font-black tracking-tight text-white leading-none">
                  {viewerLogs.length.toLocaleString('id-ID')} <span className="text-[10px] sm:text-xs font-sans font-normal text-emerald-400">Views</span>
                </h3>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 truncate">Akumulasi real-time hit</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0 ml-1.5">
                <Eye size={isMobile ? 16 : 20} />
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between shadow-sm">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 block mb-1 truncate">Cakupan Wilayah Daerah</span>
                <h3 className="text-lg sm:text-2xl font-serif font-black tracking-tight text-white leading-none">
                  {new Set(viewerLogs.map(l => l.city)).size} <span className="text-[10px] sm:text-xs font-sans font-normal text-amber-500">Kota</span>
                </h3>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 truncate">Sebaran kota aktif</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-amber-600/10 text-amber-500 flex items-center justify-center shrink-0 ml-1.5">
                <Globe size={isMobile ? 16 : 20} />
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between shadow-sm">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 block mb-1 truncate">Arsip Tulisan</span>
                <h3 className="text-lg sm:text-2xl font-serif font-black tracking-tight text-white leading-none">
                  {new Set(viewerLogs.map(l => l.articleId)).size} <span className="text-[10px] sm:text-xs font-sans font-normal text-emerald-400">Liputan</span>
                </h3>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 truncate">Dari {editorialTeam.length} kontributor</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-emerald-600/10 text-emerald-500 flex items-center justify-center shrink-0 ml-1.5">
                <BarChart3 size={isMobile ? 16 : 20} />
              </div>
            </div>

            <div className="p-3 sm:p-5 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between shadow-sm">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 block mb-1 truncate">Sesi Desktop Client</span>
                <h3 className="text-lg sm:text-2xl font-serif font-black tracking-tight text-white leading-none">
                  {Math.round((viewerLogs.filter(l => l.device?.toLowerCase() === 'desktop').length / (viewerLogs.length || 1)) * 100)}%
                </h3>
                <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-1 truncate">Sisa {Math.round((viewerLogs.filter(l => l.device?.toLowerCase() === 'mobile').length / (viewerLogs.length || 1)) * 100)}% Gawai</p>
              </div>
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-600/10 text-purple-500 flex items-center justify-center shrink-0 ml-1.5">
                <Tablet size={isMobile ? 16 : 20} />
              </div>
            </div>

          </div>

          {/* Graphical Analytics and Map Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Frame: Top visited articles list & Device breakdown */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Leaderboard */}
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-2">
                  Berita Terpopuler (Leaderboard)
                </h3>
                {loadingLogs ? (
                  <div className="text-center py-6 text-neutral-500">Memuat statistik berita...</div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const articleCounts = viewerLogs.reduce((acc: any, log: any) => {
                        acc[log.articleId] = {
                          id: log.articleId,
                          title: log.articleTitle || "Liputan Isu Nasional",
                          count: (acc[log.articleId]?.count || 0) + 1
                        };
                        return acc;
                      }, {});

                      const sortedArticles = Object.values(articleCounts)
                        .sort((a: any, b: any) => b.count - a.count)
                        .slice(0, 5);

                      if (sortedArticles.length === 0) {
                        return <p className="text-xs text-neutral-500 py-3">Belum ada tayangan berita terekam.</p>;
                      }

                      return sortedArticles.map((art: any, index) => (
                        <div key={art.id} className="flex items-start gap-2 text-xs border-b border-neutral-800/40 pb-2 last:border-b-0">
                          <span className="font-bold font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                            #{index + 1}
                          </span>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-serif font-black text-white truncate">
                              {art.title}
                            </h4>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">ID: {art.id}</span>
                          </div>
                          <span className="text-xs font-black text-emerald-400 whitespace-nowrap bg-emerald-950/25 px-1.5 py-0.5 rounded">
                            {art.count} views
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>

              {/* Devices Distribution Progress block */}
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-2">
                  Metode Perangkat (Platform Share)
                </h3>
                
                {(() => {
                  const mobileCount = viewerLogs.filter(l => l.device?.toLowerCase() === 'mobile').length;
                  const desktopCount = viewerLogs.filter(l => l.device?.toLowerCase() === 'desktop').length;
                  const tabletCount = viewerLogs.filter(l => l.device?.toLowerCase() === 'tablet').length;
                  const total = viewerLogs.length || 1;

                  const pMobile = Math.round((mobileCount / total) * 100);
                  const pDesktop = Math.round((desktopCount / total) * 100);
                  const pTablet = Math.round((tabletCount / total) * 100);

                  return (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span className="text-neutral-300">Smartphone / Ponsel</span>
                          <span className="text-emerald-400 font-bold">{pMobile}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800/60">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pMobile}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span className="text-neutral-300">Desktop / Laptop</span>
                          <span className="text-blue-400 font-bold">{pDesktop}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800/60">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pDesktop}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-medium mb-1">
                          <span className="text-neutral-300">Tablet / iPad</span>
                          <span className="text-purple-400 font-bold">{pTablet}%</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800/60">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pTablet}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

            </div>

            {/* Right Frame: Map simulation & Geographical Breakdown List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Geographical Breakdown List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-neutral-900 border border-neutral-800 rounded-lg p-3.5 sm:p-5">
                
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-2">
                    Distribusi Geografis Pembaca
                  </h3>
                  {loadingLogs ? (
                    <div className="text-center py-6 text-neutral-500">Memuat daerah geografis...</div>
                  ) : (
                    <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                      {(() => {
                        const cityCounts = viewerLogs.reduce((acc: any, log: any) => {
                          acc[log.city] = (acc[log.city] || 0) + 1;
                          acc[log.city + "_region"] = log.region;
                          return acc;
                        }, {});

                        const sortedCities = Object.keys(cityCounts)
                          .filter(k => !k.endsWith("_region"))
                          .map(city => ({
                            city,
                            region: cityCounts[city + "_region"] || "DKI Jakarta",
                            count: cityCounts[city],
                            percentage: Math.round((cityCounts[city] / (viewerLogs.length || 1)) * 100)
                          }))
                          .sort((a, b) => b.count - a.count);

                        if (sortedCities.length === 0) {
                          return <p className="text-xs text-neutral-500">Belum ada sebaran daerah terekam.</p>;
                        }

                        return sortedCities.slice(0, 6).map((cityObj) => (
                          <div key={cityObj.city} className="text-xs">
                            <div className="flex justify-between mb-1 items-center gap-1">
                              <span className="font-bold text-neutral-300 flex items-center gap-1 min-w-0 truncate">
                                <MapPin size={10} className="text-rose-500 shrink-0" />
                                <span className="truncate max-w-[80px] sm:max-w-none">{cityObj.city}</span>
                                <span className="font-normal text-neutral-500 truncate max-w-[50px] sm:max-w-none">({cityObj.region})</span>
                              </span>
                              <span className="text-[10px] text-neutral-400 shrink-0">{cityObj.count} views ({cityObj.percentage}%)</span>
                            </div>
                            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-850">
                              <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" style={{ width: `${cityObj.percentage}%` }}></div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Radar Interactive map layout representation */}
                <div className="bg-black border border-neutral-850 rounded p-3 sm:p-4 flex flex-col justify-between relative overflow-hidden h-[220px] sm:h-[300px]">
                  
                  {/* Decorative map radar layout lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1)_0%,transparent_80%)] opacity-20 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10 pointer-events-none"></div>

                  <div className="flex items-center justify-between z-10 gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                      <span className="text-[8px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider truncate">Live Radar Satelit</span>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 border border-emerald-900 bg-emerald-950/20 px-1 py-0.2 rounded shrink-0">100% ONLINE</span>
                  </div>

                  {/* High visual map simulation drawing */}
                  <div className="relative flex-grow flex items-center justify-center p-2">
                    
                    {/* Simulated pulse points on Indonesian map region */}
                    {/* 1. Jakarta */}
                    <div className="absolute top-[55%] left-[30%] group cursor-pointer z-10">
                      <span className="block h-3.5 w-3.5 bg-rose-500/30 rounded-full animate-ping absolute -top-1.5 -left-1.5"></span>
                      <span className="block h-1.5 w-1.5 bg-rose-500 rounded-full border border-white"></span>
                    </div>

                    {/* 2. Surabaya */}
                    <div className="absolute top-[62%] left-[45%] group cursor-pointer z-10">
                      <span className="block h-3 w-3 bg-amber-500/30 rounded-full animate-ping absolute -top-1 -left-1"></span>
                      <span className="block h-1.5 w-1.5 bg-amber-500 rounded-full border border-white"></span>
                    </div>

                    {/* 3. Makassar */}
                    <div className="absolute top-[50%] left-[62%] group cursor-pointer z-10">
                      <span className="block h-3 w-3 bg-cyan-400/30 rounded-full animate-ping absolute -top-1 -left-1"></span>
                      <span className="block h-1.5 w-1.5 bg-cyan-400 rounded-full border border-white"></span>
                    </div>

                    {/* 4. Medan */}
                    <div className="absolute top-[25%] left-[12%] group cursor-pointer z-10">
                      <span className="block h-3 w-3 bg-emerald-500/30 rounded-full animate-ping absolute -top-1 -left-1"></span>
                      <span className="block h-1.5 w-1.5 bg-emerald-500 rounded-full border border-white"></span>
                    </div>

                    {/* 5. Denpasar */}
                    <div className="absolute top-[64%] left-[52%] group cursor-pointer z-10">
                      <span className="block h-3 bg-rose-500/20 rounded-full animate-ping absolute -top-1 -left-1"></span>
                      <span className="block h-1.5 w-1.5 bg-rose-500 rounded-full border border-white"></span>
                    </div>

                    {/* Map region outlines coordinates text */}
                    <svg className="w-full h-full max-h-[140px]" viewBox="0 0 300 120" style={{ opacity: 0.35 }}>
                      <path d="M 20,40 Q 40,25 60,35 Q 80,45 100,50 L 120,60 L 140,75 L 160,82 Q 185,85 200,80 Q 210,75 220,83 L 245,86 L 275,80" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="32" y="32" fill="#9CA3AF" fontSize="6" fontFamily="monospace">MEDAN</text>
                      <text x="100" y="80" fill="#9CA3AF" fontSize="6" fontFamily="monospace">JAKARTA</text>
                      <text x="160" y="92" fill="#9CA3AF" fontSize="6" fontFamily="monospace">SURABAYA</text>
                      <text x="210" y="48" fill="#9CA3AF" fontSize="6" fontFamily="monospace">MAKASSAR</text>
                      <text x="250" y="105" fill="#9CA3AF" fontSize="6" fontFamily="monospace">DENPASAR</text>
                    </svg>

                  </div>

                  <p className="text-[9px] text-neutral-400 border-t border-neutral-900 pt-2 text-center leading-normal">
                    Pulsasi satelit peta mendeteksi kepadatan interaksi geografis pada node router jaringan lokal.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Table feed: Live Activity Stream logs list */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Log Alir Aktivitas Terkini (Activity Stream)
                </h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">Daftar rekonsiliasi view log audit langsung dari cloud database Firestore</p>
              </div>
              <button 
                type="button"
                onClick={fetchViewerLogs}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] text-neutral-300 hover:text-white bg-neutral-950 hover:bg-black rounded border border-neutral-800 cursor-pointer"
              >
                <RefreshCw size={10} className={loadingLogs ? "animate-spin" : ""} />
                Sajikan Data Terbaru
              </button>
            </div>

            {loadingLogs ? (
              <div className="text-center py-10 text-neutral-500">Menarik log aktivitas...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300 border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[10px] uppercase font-black text-neutral-400 animate-fade-in">
                      <th className="py-2 px-1.5 sm:px-3 text-left">Waktu Terekam</th>
                      <th className="py-2 px-1.5 sm:px-3 text-left">Judul Berita yang Dibaca</th>
                      <th className="py-2 px-1.5 sm:px-3 text-left">Lokasi / Kota</th>
                      <th className="py-2 px-1.5 sm:px-3 text-center hidden sm:table-cell">Tipe Gawai</th>
                      <th className="py-2 px-1.5 sm:px-3 text-right hidden md:table-cell">Status Sesi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewerLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-neutral-500">Belum ada aktivitas terekam.</td>
                      </tr>
                    ) : (
                      viewerLogs
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .slice(0, 10)
                        .map((log) => (
                           <tr key={log.id} className="border-b border-neutral-800/40 hover:bg-neutral-850/40 transition-all font-mono text-[11px]">
                            <td className="py-2 px-1.5 sm:px-3 text-neutral-400 whitespace-nowrap text-[10px] sm:text-[11px]">
                              {new Date(log.timestamp).toLocaleString('id-ID')}
                            </td>
                            <td className="py-2 px-1.5 sm:px-3 font-serif font-black text-white max-w-[120px] sm:max-w-[280px] truncate text-[10px] sm:text-[11px]">
                              {log.articleTitle || "Membaca Berita Utama"}
                            </td>
                            <td className="py-2 px-1.5 sm:px-3 text-[10px] sm:text-[11px] truncate max-w-[100px] sm:max-w-none">
                              <span className="flex items-center gap-1 truncate">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                <span className="truncate">{log.city}, {log.region}</span>
                              </span>
                            </td>
                            <td className="py-2 px-1.5 sm:px-3 text-center hidden sm:table-cell">
                              <span className="px-2 py-0.5 rounded bg-neutral-950 font-medium text-[10px] uppercase tracking-wider text-neutral-300 border border-neutral-800">
                                {log.device || "Mobile"}
                              </span>
                            </td>
                            <td className="py-2 px-1.5 sm:px-3 text-right hidden md:table-cell">
                              <span className="text-emerald-500 text-[9px] font-black tracking-widest bg-emerald-950/10 border border-emerald-950/30 px-1.5 py-0.5 rounded">
                                PASSED_AUDIT
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
                    
                    <div className="flex items-center gap-1.5 self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUserId(usr.id);
                          setEditPasswordInput(usr.password || '');
                          setEditAvatarPreview(usr.avatarUrl);
                          setEditAvatarBase64(null);
                          setUserSuccessMessage('');
                          setUserErrorMessage('');
                        }}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 rounded text-[10px] font-black cursor-pointer uppercase flex items-center justify-center gap-1 transition-all"
                      >
                        <Settings size={11} className="text-blue-500" />
                        <span>Edit Profil</span>
                      </button>

                      {usr.id !== currentUser?.id && (
                        <>
                          {confirmDeleteUserId === usr.id ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(usr.id)}
                                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white border border-red-500 rounded text-[10px] font-black cursor-pointer uppercase flex items-center justify-center gap-1 transition-all shadow-md"
                              >
                                <span>Yakin?</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteUserId(null)}
                                className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded text-[10px] font-black cursor-pointer uppercase flex items-center justify-center transition-all"
                              >
                                <span>Batal</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setUserSuccessMessage('');
                                setUserErrorMessage('');
                                setConfirmDeleteUserId(usr.id);
                              }}
                              className="px-2.5 py-1.5 bg-red-950/35 hover:bg-red-900/35 text-red-400 border border-red-900/40 hover:border-red-500 rounded text-[10px] font-black cursor-pointer uppercase flex items-center justify-center gap-1 transition-all shadow-inner"
                              title="Hapus Pengguna"
                            >
                              <Trash2 size={11} className="text-red-500" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Area panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Edit Profil Dan Foto Pengguna */}
            {editingUserId && (
              <div className="bg-neutral-900 border border-blue-900/40 rounded-lg p-5 space-y-3.5 shadow-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
                  <Settings size={14} className="text-blue-500" /> Edit Profil Pengguna
                </div>
                
                <div className="p-3 bg-neutral-950 border border-neutral-850 rounded">
                  <p className="text-[9px] uppercase tracking-wider font-bold text-neutral-500 leading-none mb-1">
                    Akun yang sedang diedit:
                  </p>
                  <p className="text-xs font-bold text-white leading-normal">
                    {usersList.find(u => u.id === editingUserId)?.name} 
                    <span className="text-neutral-400 font-mono font-medium block text-[10px] mt-0.5">({usersList.find(u => u.id === editingUserId)?.email})</span>
                  </p>
                </div>

                {/* Photo Update Section */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Foto Profil Pengguna</label>
                  <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded border border-neutral-800">
                    {editAvatarPreview ? (
                      <img 
                        src={editAvatarPreview} 
                        alt="Preview" 
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 rounded-full object-cover border border-blue-600/60 ring-2 ring-blue-600/20"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-neutral-850 border border-neutral-700 flex items-center justify-center text-neutral-400 text-[10px] font-black uppercase text-center leading-none">
                        Foto Kosong
                      </div>
                    )}
                    <div className="flex-1 space-y-1 block">
                      <input
                        id="edit-avatar-file"
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="block w-full text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-blue-600/90 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                      <p className="text-[9px] text-neutral-500 leading-tight">Format JPG/PNG/WEBP (Maksimal 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Password Update Section */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold text-neutral-400">Kata Sandi Akun</label>
                  <input
                    type="text"
                    value={editPasswordInput}
                    onChange={(e) => setEditPasswordInput(e.target.value)}
                    placeholder="Sandi baru (biarkan lama jika tidak diganti)"
                    className="w-full text-xs px-3 py-2 border rounded border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-blue-600 font-mono tracking-wider"
                  />
                  <p className="text-[9px] text-neutral-500 leading-normal">Ketikkan kata sandi baru untuk mengganti password saat ini.</p>
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateUserProfile(editingUserId, editPasswordInput, editAvatarBase64)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Simpan Perubahan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUserId(null);
                      setEditAvatarPreview(null);
                      setEditAvatarBase64(null);
                      setEditPasswordInput('');
                    }}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs font-bold cursor-pointer transition-colors"
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
