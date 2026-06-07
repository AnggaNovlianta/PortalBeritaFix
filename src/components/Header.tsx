import React, { useState } from 'react';
import { Sun, Moon, Search, LogIn, LogOut, User as UserIcon, Shield, Radio, Landmark, Users2, Info, Building } from 'lucide-react';
import { User, WebSettings } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentUser: User | null;
  onLogin: (email: string, role?: string, password?: string, fullName?: string) => Promise<boolean>;
  onLogout: () => void;
  websiteSettings: WebSettings;
  activeSection: 'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream';
  setActiveSection: (sec: 'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  currentUser,
  onLogin,
  onLogout,
  websiteSettings,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
}: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'contributor' | 'journalist'>('user');
  const [authErrorMessage, setAuthErrorMessage] = useState('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErrorMessage('');
    let success = false;
    if (isRegistering) {
      if (!emailInput || !regName || !passwordInput) {
        setAuthErrorMessage('Lengkapi semua bidang!');
        return;
      }
      success = await onLogin(emailInput, regRole, passwordInput, regName);
      if (success) {
        setIsRegistering(false);
        setShowAuthModal(false);
        setEmailInput('');
        setPasswordInput('');
        setRegName('');
      } else {
        setAuthErrorMessage('Gagal mendaftar. Email mungkin sudah digunakan.');
      }
    } else {
      if (!emailInput) return;
      success = await onLogin(emailInput, undefined, passwordInput);
      if (success) {
        setShowAuthModal(false);
        setEmailInput('');
        setPasswordInput('');
      } else {
        setAuthErrorMessage('Akses Ditolak: Email atau Kata Sandi salah!');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    // Elegant fully compliant Google Sign-In simulator as requested
    await onLogin("angganovliantaST@gmail.com", "user", "secret-google-pass");
    setShowAuthModal(false);
  };

  return (
    <header className={`border-b sticky top-0 z-40 backdrop-blur-md transition-colors ${
      darkMode ? 'bg-neutral-950/90 border-neutral-800' : 'bg-white/95 border-neutral-200'
    }`}>
      {/* Top Brand Banner Space */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Dynamic CMS Logo & Brand Name */}
        <div 
          id="web-branding"
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveSection('home')}
        >
          <img 
            id="web-logo"
            src={websiteSettings.websiteLogo} 
            alt="Logo" 
            referrerPolicy="no-referrer"
            className="h-11 w-11 object-cover rounded-md shadow-sm border border-blue-600/30"
          />
          <div>
            <h1 id="web-name" className={`text-2xl font-black tracking-tighter ${
              darkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              {websiteSettings.websiteName}
              <span className="text-blue-600 text-3xl font-extrabold leading-none">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Portal Berita Nasional</p>
          </div>
        </div>

        {/* Dynamic Header Ad Banner */}
        {websiteSettings.adsHeader && (
          <div id="ad-header-top" className="hidden lg:block w-[520px] h-[72px] rounded overflow-hidden relative shadow border border-neutral-700/20 bg-neutral-900 flex items-center justify-center">
            <span className="absolute top-1 right-2 bg-black/60 text-[8px] font-black tracking-widest px-1 py-0.5 rounded text-neutral-400 select-none uppercase">IKLAN PREMIUM</span>
            <img 
              src={websiteSettings.adsHeader} 
              alt="Ad Banner" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        {/* Global Controls & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full cursor-pointer transition-all border ${
              darkMode 
                ? 'border-neutral-700 hover:bg-neutral-800 text-amber-400' 
                : 'border-neutral-200 hover:bg-neutral-100 text-neutral-600'
            }`}
            title="Ganti Mode Tampilan"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Google Search Style Web Search Bar */}
          <div id="search-bar-wrap" className="relative w-44 md:w-56">
            <input
              id="search-input-field"
              type="text"
              placeholder="Cari berita nasional..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-8 pr-3 py-2 rounded-md outline-none border transition-all ${
                darkMode
                  ? 'bg-neutral-900 border-neutral-800 focus:border-blue-600 text-neutral-200 focus:ring-1 focus:ring-blue-600'
                  : 'bg-neutral-50 border-neutral-200 focus:border-blue-600 text-neutral-800 focus:ring-1 focus:ring-blue-600'
              }`}
            />
            <Search className="absolute left-2.5 top-2.5 text-neutral-400" size={14} />
          </div>

          {/* User Account State */}
          {currentUser ? (
            <div id="user-pills" className="flex items-center gap-2">
              <div 
                onClick={() => {
                  if (currentUser.role === 'admin') setActiveSection('admin');
                  else if (['journalist', 'contributor', 'editor'].includes(currentUser.role)) setActiveSection('jurnalis');
                }}
                className={`hidden md:flex flex-col items-end cursor-pointer `}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold leading-none ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {currentUser.name}
                  </span>
                  {currentUser.role === 'admin' && (
                    <Shield size={12} className="text-blue-600 animate-pulse" />
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide text-blue-600">
                  {currentUser.role} {currentUser.isPremium ? '★' : ''}
                </span>
              </div>
              
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className={`h-9 w-9 rounded-full border-2 object-cover ${
                  currentUser.isPremium ? 'border-amber-400 shadow-md animate-bounce-slow' : 'border-neutral-400'
                }`}
              />
              
              <button
                id="logout-btn"
                onClick={onLogout}
                className={`p-2 rounded-md cursor-pointer transition-all border ${
                  darkMode 
                    ? 'border-neutral-800 hover:bg-neutral-900 hover:text-red-400 text-neutral-300' 
                    : 'border-neutral-200 hover:bg-neutral-50 hover:text-red-500 text-neutral-600'
                }`}
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="login-modal-open-btn"
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-3.5 py-2.5 rounded-md cursor-pointer transition-all shadow active:scale-95 text-center whitespace-nowrap"
            >
              <LogIn size={14} />
              <span>LOGIN AKSES</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className={`border-t transition-colors ${
        darkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-neutral-50/50 border-neutral-150'
      }`}>
        <div id="main-nav-bar" className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-1 scrollbar-none py-1">
            <button
              id="nav-home"
              onClick={() => setActiveSection('home')}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer ${
                activeSection === 'home'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : `border-transparent text-neutral-400 hover:text-neutral-200`
              }`}
            >
              <Landmark size={14} />
              Berita Utama
            </button>

            <button
              id="nav-livestream"
              onClick={() => setActiveSection('livestream')}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer ${
                activeSection === 'livestream'
                  ? 'border-blue-600 text-blue-600 font-black'
                  : `border-transparent text-blue-600 hover:bg-blue-600/10`
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping inline-block"></span>
              <Radio size={14} />
              TV Live Streaming
            </button>



            {/* Role Restricted Panels */}
            {currentUser && ['journalist', 'contributor', 'editor'].includes(currentUser.role) && (
              <button
                id="nav-journalist-dashboard"
                onClick={() => setActiveSection('jurnalis')}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer ${
                  activeSection === 'jurnalis'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : `border-transparent text-blue-600 hover:text-blue-500`
                }`}
              >
                {currentUser.role === 'editor' ? 'Studio Redaksi' : 'Studio Penulis'}
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                id="nav-admin-dashboard"
                onClick={() => setActiveSection('admin')}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer ${
                  activeSection === 'admin'
                    ? 'border-blue-600 text-blue-600 font-black'
                    : `border-transparent text-blue-600 hover:text-blue-500`
                }`}
              >
                Panel Admin
              </button>
            )}
          </div>

          <div className="hidden sm:flex text-[11px] font-bold text-neutral-400 gap-1.5 items-center bg-blue-600/10 px-3 py-1.5 rounded-md border border-blue-600/20">
            <span className="text-blue-600">Kanal Premium:</span>
            <span className="font-black text-xs text-blue-600">96.8 FM</span>
            <span>|</span>
            <span className="italic">Fakta Faktual TV</span>
          </div>
        </div>
      </nav>

      {/* Quick Role-based Login Modal */}
      {showAuthModal && (
        <div id="auth-modal" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`p-6 rounded-lg w-full max-w-md shadow-2xl relative border ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <button 
              id="auth-modal-close"
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-extrabold text-lg select-none cursor-pointer"
            >
              ✕
            </button>

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
              <span>Masuk Cepat via Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-neutral-800"></div>
              <span className="px-3 text-[10px] uppercase font-bold text-neutral-500">Kredensial Pengguna</span>
              <div className="flex-1 border-t border-neutral-800"></div>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-3">
              {authErrorMessage && (
                <div id="auth-error-msg" className="p-2.5 bg-red-950/45 border border-red-800 text-red-300 font-bold rounded text-[10px] text-center animate-shake">
                  {authErrorMessage}
                </div>
              )}
              {isRegistering && (
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

            {/* Quick role presets box for testing ease */}
            <div className="mt-5 p-3 rounded bg-blue-600/5 border border-blue-600/10">
              <span className="block text-[10px] uppercase tracking-wider font-bold text-blue-400 text-center mb-2">MASUK CEPAT DEVLOPMENT (ROLE PRESETS)</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-center">
                <button 
                  onClick={() => { onLogin("admin@faktafaktual.id", undefined, "admin123"); setShowAuthModal(false); }}
                  className="p-1 px-1.5 rounded border border-neutral-700 hover:bg-neutral-800 font-extrabold cursor-pointer transition-all text-neutral-300"
                >
                  Admin Portal
                </button>
                <button 
                  onClick={() => { onLogin("editor@faktafaktual.id", undefined, "editor123"); setShowAuthModal(false); }}
                  className="p-1 px-1.5 rounded border border-neutral-700 hover:bg-neutral-800 font-extrabold cursor-pointer transition-all text-neutral-300"
                >
                  Editor Reviewer
                </button>
                <button 
                  onClick={() => { onLogin("wartawan@faktafaktual.id", undefined, "wartawan123"); setShowAuthModal(false); }}
                  className="p-1 px-1.5 rounded border border-neutral-700 hover:bg-neutral-800 font-extrabold cursor-pointer transition-all text-neutral-300"
                >
                  Jurnalis Inten
                </button>
                <button 
                  onClick={() => { onLogin("kontributor@faktafaktual.id", undefined, "kontributor123"); setShowAuthModal(false); }}
                  className="p-1 px-1.5 rounded border border-neutral-700 hover:bg-neutral-800 font-extrabold cursor-pointer transition-all text-neutral-300"
                >
                  Kontributor
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                id="toggle-register-btn"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {isRegistering ? 'Sudah memiliki akun? Masuk' : 'Belum punya akun? Buat akun sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
