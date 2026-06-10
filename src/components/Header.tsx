import React, { useState } from 'react';
import { Sun, Moon, Search, LogIn, LogOut, User as UserIcon, Shield, Radio, Landmark, Users2, Info, Building, ArrowLeft, Plus, Check, Mail, X, Trash2, Bookmark, Menu, Newspaper } from 'lucide-react';
import { User, WebSettings, Article } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentUser: User | null;
  onLogin: (email: string, role?: string, password?: string, fullName?: string, avatarBase64?: string) => Promise<boolean>;
  onLogout: () => void;
  websiteSettings: WebSettings;
  activeSection: 'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream';
  setActiveSection: (sec: 'home' | 'redaksi' | 'profil' | 'jurnalis' | 'admin' | 'livestream') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  articles?: Article[];
  onArticleSelect?: (id: string) => void;
  onOpenAuth?: (googleFlow: boolean) => void;
  bookmarkedIds?: string[];
  onRemoveBookmark?: (id: string) => void;
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
  articles,
  onArticleSelect,
  onOpenAuth,
  bookmarkedIds = [],
  onRemoveBookmark,
}: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'profil' | 'bookmarks'>('profil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const preset = websiteSettings.themePreset || 'slate';
  const themeAccent = {
    slate: {
      text: 'text-blue-500',
      textHover: 'hover:text-blue-400',
      bg: 'bg-blue-600',
      bgHover: 'hover:bg-blue-700',
      border: 'border-blue-600',
      borderMuted: 'border-blue-600/40 hover:border-blue-500',
      bgLight: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
      focusRing: 'focus:border-blue-600 focus:ring-blue-600',
      badgeGrad: 'from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
      navGrad: 'from-zinc-950 via-zinc-800 to-stone-950',
      navGradLight: 'from-zinc-900 via-zinc-700 to-stone-900',
    },
    emerald: {
      text: 'text-emerald-500',
      textHover: 'hover:text-emerald-400',
      bg: 'bg-emerald-600',
      bgHover: 'hover:bg-emerald-700',
      border: 'border-emerald-600',
      borderMuted: 'border-emerald-600/40 hover:border-emerald-500',
      bgLight: 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
      focusRing: 'focus:border-emerald-600 focus:ring-emerald-600',
      badgeGrad: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-850',
      navGrad: 'from-zinc-950 via-zinc-800 to-stone-950',
      navGradLight: 'from-zinc-900 via-zinc-700 to-stone-900',
    },
    amber: {
      text: 'text-amber-500',
      textHover: 'hover:text-amber-400',
      bg: 'bg-amber-600',
      bgHover: 'hover:bg-amber-700',
      border: 'border-amber-600',
      borderMuted: 'border-amber-600/40 hover:border-amber-500',
      bgLight: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
      focusRing: 'focus:border-amber-600 focus:ring-amber-600',
      badgeGrad: 'from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-850',
      navGrad: 'from-zinc-950 via-zinc-800 to-stone-950',
      navGradLight: 'from-zinc-900 via-zinc-700 to-stone-900',
    },
    indigo: {
      text: 'text-indigo-500',
      textHover: 'hover:text-indigo-400',
      bg: 'bg-indigo-600',
      bgHover: 'hover:bg-indigo-700',
      border: 'border-indigo-600',
      borderMuted: 'border-indigo-600/40 hover:border-indigo-500',
      bgLight: 'bg-indigo-600/10 text-indigo-600 border-indigo-600/20',
      focusRing: 'focus:border-indigo-600 focus:ring-indigo-600',
      badgeGrad: 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-855',
      navGrad: 'from-zinc-950 via-zinc-800 to-stone-950',
      navGradLight: 'from-zinc-900 via-zinc-700 to-stone-900',
    },
    crimson: {
      text: 'text-rose-500',
      textHover: 'hover:text-rose-400',
      bg: 'bg-rose-600',
      bgHover: 'hover:bg-rose-700',
      border: 'border-rose-600',
      borderMuted: 'border-rose-600/40 hover:border-rose-500',
      bgLight: 'bg-rose-600/10 text-rose-600 border-rose-600/20',
      focusRing: 'focus:border-rose-600 focus:ring-rose-600',
      badgeGrad: 'from-rose-600 to-red-750 hover:from-rose-750 hover:to-red-850',
      navGrad: 'from-zinc-950 via-zinc-800 to-stone-950',
      navGradLight: 'from-zinc-900 via-zinc-700 to-stone-900',
    },
  }[preset];

  const trimmedName = (websiteSettings.websiteName || '').trim();
  const firstSpaceIndex = trimmedName.indexOf(' ');
  let firstWord = trimmedName;
  let restOfName = '';

  if (firstSpaceIndex !== -1) {
    firstWord = trimmedName.substring(0, firstSpaceIndex);
    restOfName = trimmedName.substring(firstSpaceIndex + 1);
  }

  return (
    <header className={`border-b border-neutral-900/60 sticky top-0 z-40 bg-gradient-to-r ${darkMode ? themeAccent.navGrad : themeAccent.navGradLight} backdrop-blur-md transition-colors animate-fade-in`}>
      {/* Top Brand Banner Space */}
      <div className="max-w-7xl mx-auto px-3 py-3 md:px-4 md:py-4 flex flex-col items-center justify-center gap-3.5 md:flex-row md:justify-between md:gap-3 flex-wrap md:flex-nowrap">
        
        {/* Dynamic CMS Logo & Brand Name */}
        <div 
          id="web-branding"
          className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 md:gap-4 cursor-pointer select-none shrink-0 justify-center text-center"
          onClick={() => setActiveSection('home')}
        >
          {websiteSettings.websiteLogo ? (
            <img 
              id="web-logo"
              src={websiteSettings.websiteLogo} 
              alt="Logo" 
              referrerPolicy="no-referrer"
              className={`h-14 w-14 sm:h-16 sm:w-16 object-cover rounded-xl shadow-lg border-2 ${themeAccent.borderMuted} transition-all duration-300`}
            />
          ) : (
            <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${themeAccent.badgeGrad} border-2 ${themeAccent.borderMuted} shadow-lg shrink-0`}>
              <Newspaper className="text-white" size={24} />
            </div>
          )}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 id="web-name" className="text-lg xs:text-xl sm:text-2xl md:text-4xl font-extrabold md:font-black tracking-tighter leading-none flex items-center justify-center sm:justify-start">
              <span className={themeAccent.text}>{firstWord}</span>
              {restOfName && <span className="text-white ml-1.5 sm:ml-2">{restOfName}</span>}
              <span className={`${themeAccent.text} text-lg md:text-3xl font-extrabold leading-none`}>.</span>
            </h1>
            <p className={`text-[8.5px] xs:text-[10px] sm:text-[11px] md:text-xs uppercase tracking-widest ${themeAccent.text} font-black mt-1 md:mt-1.5`}>Portal Berita Nasional</p>
          </div>
        </div>



        {/* Global Controls & Search */}
        <div className="flex items-center justify-center gap-2 md:gap-3 w-full md:w-auto md:justify-end flex-wrap">
          {/* Mobile Navigation Trigger Toggle */}
          <button
            id="mobile-nav-hamburger"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white hover:bg-neutral-850 min-h-[38px] min-w-[38px]"
            title="Menu Navigasi Utama"
          >
            <Menu size={18} />
          </button>

          {/* Theme Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center p-2 text-amber-400 cursor-pointer transition-all border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-850 rounded-lg min-h-[38px] min-w-[38px]"
            title="Ganti Mode Tampilan"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Google Search Style Web Search Bar */}
          <div id="search-bar-wrap" className="relative flex-1 xs:flex-none w-32 xs:w-44 sm:w-52">
            <input
              id="search-input-field"
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-[10px] sm:text-xs pl-7 pr-2.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 focus:outline-none transition-all ${themeAccent.focusRing} focus:ring-1`}
            />
            <Search className="absolute left-2.5 top-[9px] sm:top-3 text-neutral-400" size={12} />
          </div>

          {/* User Account State */}
          {currentUser ? (
            <div className="relative">
              <div 
                id="user-pills" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 md:gap-2.5 cursor-pointer bg-neutral-900/60 border border-neutral-800 hover:border-neutral-750 p-0.5 md:p-1 pl-2 pr-0.5 md:px-3 rounded-full transition-all select-none"
              >
                <div className="hidden md:flex flex-col items-end">
                  <div className="flex items-center gap-1 mr-1">
                    <span className="text-xs font-bold leading-none text-white">
                      {currentUser.name}
                    </span>
                    {currentUser.role === 'admin' && (
                      <Shield size={11} className={`${themeAccent.text} animate-pulse`} />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${themeAccent.text}`}>
                    {currentUser.role} {currentUser.isPremium ? '★' : ''}
                  </span>
                </div>
                
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  referrerPolicy="no-referrer"
                  className={`h-6 w-6 md:h-8 md:w-8 rounded-full border-2 object-cover ${
                    currentUser.isPremium ? 'border-amber-400 shadow-sm' : 'border-neutral-500'
                  }`}
                />
              </div>

              {/* User Profile & Bookmarks Dropdown Menu */}
              {showProfileMenu && (
                <div 
                  id="user-profile-menu-dropdown" 
                  className="absolute right-[-10px] sm:right-0 top-10 md:top-12 w-[90vw] xs:w-80 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl z-50 p-4 space-y-3 animate-fade-in text-neutral-100"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-neutral-900 pb-3">
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      referrerPolicy="no-referrer"
                      className={`h-11 w-11 rounded-full object-cover border-2 ${
                        currentUser.isPremium ? 'border-amber-400' : 'border-neutral-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <h4 className="text-xs font-black text-white truncate flex items-center gap-1">
                        <span>{currentUser.name}</span>
                        {currentUser.isPremium && <span className="text-amber-400 text-xs shrink-0 font-bold" title="Premium Subscriber">★</span>}
                      </h4>
                      <p className="text-[10px] text-neutral-400 truncate">{currentUser.email}</p>
                      <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 ${
                        currentUser.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : currentUser.role === 'journalist' || currentUser.role === 'editor'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileMenu(false);
                      }}
                      className="p-1 text-neutral-400 hover:text-white rounded cursor-pointer"
                      title="Tutup Menu"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Tabs Nav */}
                  <div className="flex border-b border-neutral-900 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProfileTab('profil');
                      }}
                      className={`flex-1 py-1.5 font-bold border-b-2 text-center transition-all cursor-pointer ${
                        activeProfileTab === 'profil'
                          ? 'border-blue-500 text-blue-400 font-extrabold'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Profil Saya
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProfileTab('bookmarks');
                      }}
                      className={`flex-1 py-1.5 font-bold border-b-2 text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeProfileTab === 'bookmarks'
                          ? 'border-blue-500 text-blue-400 font-extrabold'
                          : 'border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span>Bookmark ({bookmarkedIds.length})</span>
                    </button>
                  </div>

                  {/* Tab Body */}
                  {activeProfileTab === 'profil' ? (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1 bg-neutral-900 p-2.5 rounded border border-neutral-900 text-[11px] leading-relaxed text-left">
                        <div className="flex justify-between text-neutral-400">
                          <span>Status Akun:</span>
                          <span className={currentUser.isPremium ? "text-amber-400 font-extrabold" : "text-neutral-300"}>
                            {currentUser.isPremium ? "Premium Berlangganan" : "Akun Standar"}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Surel:</span>
                          <span className="text-neutral-300 truncate max-w-[150px]" title={currentUser.email}>{currentUser.email}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {['journalist', 'contributor', 'editor', 'admin'].includes(currentUser.role) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowProfileMenu(false);
                              if (currentUser.role === 'admin') setActiveSection('admin');
                              else setActiveSection('jurnalis');
                            }}
                            className={`w-full py-2 rounded text-xs font-extrabold text-center bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer`}
                          >
                            Masuk {currentUser.role === 'admin' ? 'Panel Admin' : 'Studio Penulis'}
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProfileMenu(false);
                            onLogout();
                          }}
                          className="w-full py-2 rounded text-xs font-bold text-center border border-neutral-800 hover:bg-red-500/10 hover:text-red-400 text-neutral-300 transition-all cursor-pointer"
                        >
                          Keluar Akun
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Bookmarks tab */
                    <div className="space-y-2 pt-1 max-h-56 overflow-y-auto scrollbar-thin text-left">
                      {bookmarkedIds.length === 0 ? (
                        <div className="py-8 text-center text-xs text-neutral-500">
                          Belum ada artikel yang dibookmark.
                        </div>
                      ) : (
                        <div className="space-y-1.5 divide-y divide-neutral-900">
                          {articles && articles
                            .filter(art => bookmarkedIds.includes(art.id))
                            .map(art => (
                              <div key={art.id} className="pt-2 first:pt-0 flex items-start gap-2 group">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProfileMenu(false);
                                    if (onArticleSelect) onArticleSelect(art.id);
                                  }}
                                  className="flex-1 min-w-0 cursor-pointer"
                                >
                                  <h5 className="text-[11px] font-bold text-neutral-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                                    {art.title}
                                  </h5>
                                  <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider">
                                    {art.category}
                                  </span>
                                </div>
                                {onRemoveBookmark && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRemoveBookmark(art.id);
                                    }}
                                    className="p-1 rounded text-neutral-500 hover:text-red-500 hover:bg-red-500/10 shrink-0 transition cursor-pointer"
                                    title="Hapus bookmark"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="login-modal-open-btn"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth(false);
                }}
                className={`flex items-center gap-1 text-[10px] md:text-xs font-black bg-gradient-to-r ${themeAccent.badgeGrad} text-white px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded cursor-pointer transition-all shadow active:scale-95 text-center whitespace-nowrap`}
              >
                <LogIn size={12} className="shrink-0" />
                <span>MASUK</span>
              </button>

              <button
                id="header-gmail-signup-btn"
                onClick={() => {
                  if (onOpenAuth) onOpenAuth(true);
                }}
                className="hidden sm:flex items-center gap-1.5 text-[10px] md:text-xs font-black bg-neutral-900 border border-neutral-750 hover:bg-neutral-850 text-neutral-100 hover:border-neutral-500 px-2.5 py-1.5 md:px-3.5 md:py-2.5 rounded cursor-pointer transition-all shadow active:scale-95 text-center whitespace-nowrap"
                title="Daftar menggunakan akun Gmail tepercaya"
              >
                {/* Google Small Color SVG Logo */}
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" />
                </svg>
                <span>DAFTAR GMAIL</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="border-t border-neutral-900/40 bg-black/10 backdrop-blur-xs transition-colors w-full overflow-hidden">
        <div id="main-nav-bar" className="max-w-7xl mx-auto px-3 flex items-center justify-between overflow-x-auto gap-4 scrollbar-none py-1">
          <div className="flex items-center gap-1 flex-nowrap overflow-x-auto whitespace-nowrap py-0.5 scrollbar-none w-full md:w-auto scroll-smooth">
            <button
              id="nav-home"
              onClick={() => setActiveSection('home')}
              className={`flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeSection === 'home'
                  ? `${themeAccent.border} ${themeAccent.text} font-black`
                  : `border-transparent text-neutral-400 hover:text-neutral-200`
              }`}
            >
              <Landmark size={13} />
              Berita Utama
            </button>

            <button
              id="nav-livestream"
              onClick={() => setActiveSection('livestream')}
              className={`flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeSection === 'livestream'
                  ? `${themeAccent.border} ${themeAccent.text} font-black`
                  : `border-transparent text-neutral-400 hover:text-neutral-200`
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${themeAccent.bg} animate-ping inline-block shrink-0`}></span>
              <Radio size={13} className="shrink-0" />
              TV Live Streaming
            </button>



            {/* Role Restricted Panels */}
            {currentUser && ['journalist', 'contributor', 'editor', 'admin'].includes(currentUser.role) && (
              <button
                id="nav-journalist-dashboard"
                onClick={() => setActiveSection('jurnalis')}
                className={`flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeSection === 'jurnalis'
                    ? `${themeAccent.border} ${themeAccent.text} font-black`
                    : `border-transparent text-neutral-400 hover:text-neutral-200`
                }`}
              >
                <Users2 size={13} />
                {['editor', 'admin'].includes(currentUser.role) ? 'Studio Redaksi' : 'Studio Penulis'}
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                id="nav-admin-dashboard"
                onClick={() => setActiveSection('admin')}
                className={`flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 text-xs font-extrabold tracking-tight transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  activeSection === 'admin'
                    ? `${themeAccent.border} ${themeAccent.text} font-black`
                    : `border-transparent text-neutral-400 hover:text-neutral-200`
                }`}
              >
                <Shield size={13} />
                Panel Admin
              </button>
            )}
          </div>

          <div className={`hidden sm:flex text-[11px] font-bold text-neutral-400 gap-1.5 items-center ${themeAccent.bgLight} px-3 py-1.5 rounded-md border`}>
            <span>Kanal Premium:</span>
            <span className="font-black text-xs">96.8 FM</span>
            <span>|</span>
            <span className="italic">Fakta Faktual TV</span>
          </div>
        </div>
      </nav>

      {/* Running Text / News Ticker */}
      <div className="bg-neutral-900 border-t border-neutral-850 py-1.5 px-4 overflow-hidden shadow-inner select-none flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${themeAccent.bg} text-white font-black text-[10px] tracking-widest uppercase px-2 py-0.5 rounded shrink-0 animate-pulse`}>
            <span className="h-2 w-2 rounded-full bg-white animate-ping inline-block"></span>
            TRENDING
          </div>
          <div className="flex-1 overflow-hidden">
            <marquee
              scrollamount="3.5"
              onMouseOver={(e: any) => e.currentTarget.stop()}
              onMouseOut={(e: any) => e.currentTarget.start()}
              className="text-[11px] font-medium text-neutral-300 flex items-center cursor-pointer gap-6"
            >
              <span className="inline-flex items-center gap-8">
                {/* Custom Announcement from Admin */}
                {websiteSettings.announcement && (
                  <span className={`${themeAccent.text} font-bold flex items-center gap-2`}>
                    <span className="bg-neutral-950/60 text-neutral-300 text-[9px] px-1.5 py-0.5 rounded border border-neutral-800">INFO PORTAL</span>
                    <span>{websiteSettings.announcement}</span>
                  </span>
                )}
                
                {/* Trending News items */}
                {articles && articles.filter(a => a.status === 'published').length > 0 ? (
                  articles
                    .filter(a => a.status === 'published')
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((art, index) => (
                      <span 
                        key={art.id} 
                        onClick={() => onArticleSelect && onArticleSelect(art.id)}
                        className={`hover:underline inline-flex items-center gap-2 transition ${themeAccent.textHover}`}
                      >
                        <span className={`${themeAccent.text} font-black`}>🔥 # {index + 1}</span>
                        <span className="font-bold text-white">[{art.category}]</span>
                        <span>{art.title}</span>
                      </span>
                    ))
                ) : (
                  <>
                    <span className="text-neutral-400">Menyajikan berita nasional tepercaya, tajam dan akurat 24 jam nonstop...</span>
                    <span className="text-neutral-400">|</span>
                    <span className="text-neutral-400">Silakan kunjungi Panel Kontrol Admin untuk mengubah pengumuman berjalan secara dinamis...</span>
                  </>
                )}
              </span>
            </marquee>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-In Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              id="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Sidebar drawer body */}
            <motion.div
              id="mobile-drawer-body"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed top-0 left-0 bottom-0 h-screen w-72 z-50 shadow-2xl flex flex-col border-r transition-colors ${
                darkMode ? 'bg-neutral-950 border-neutral-850 text-neutral-100' : 'bg-slate-900 border-slate-800 text-white'
              } md:hidden`}
            >
              {/* Drawer Header */}
              <div className="p-4 flex items-center justify-between border-b border-neutral-900 bg-neutral-950/40">
                <div className="flex items-center gap-3">
                  <img
                    src={websiteSettings.websiteLogo}
                    alt="Logo"
                    className="h-10 w-10 object-cover rounded-lg border border-neutral-800 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight flex items-center leading-none text-white">
                      <span className={themeAccent.text}>{firstWord}</span>
                      {restOfName && <span className="text-white ml-1.5 truncate max-w-[110px]">{restOfName}</span>}
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1 font-bold">Portal Berita</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg cursor-pointer transition-all flex items-center justify-center min-w-[36px] min-h-[36px]"
                  title="Tutup Menu"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 font-black mb-3">Navigasi Utama</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveSection('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold text-left transition-all ${
                        activeSection === 'home'
                          ? `${themeAccent.bgLight} font-black border border-neutral-800/40`
                          : 'text-neutral-300 hover:bg-neutral-900/40 hover:text-white'
                      }`}
                    >
                      <Landmark size={14} className="shrink-0" />
                      <span>Berita Utama</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveSection('livestream');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold text-left transition-all ${
                        activeSection === 'livestream'
                          ? `${themeAccent.bgLight} font-black border border-neutral-800/40`
                          : 'text-neutral-300 hover:bg-neutral-900/40 hover:text-white'
                      }`}
                    >
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${themeAccent.bg} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${themeAccent.bg}`}></span>
                      </span>
                      <Radio size={14} className="shrink-0" />
                      <span>TV Live Streaming</span>
                    </button>

                    {/* Role Restricted links inside Drawer */}
                    {currentUser && ['journalist', 'contributor', 'editor', 'admin'].includes(currentUser.role) && (
                      <button
                        onClick={() => {
                          setActiveSection('jurnalis');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold text-left transition-all ${
                          activeSection === 'jurnalis'
                            ? `${themeAccent.bgLight} font-black border border-neutral-800/40`
                            : 'text-neutral-300 hover:bg-neutral-900/40 hover:text-white'
                        }`}
                      >
                        <Users2 size={14} className="shrink-0" />
                        <span>{['editor', 'admin'].includes(currentUser.role) ? 'Studio Redaksi' : 'Studio Penulis'}</span>
                      </button>
                    )}

                    {currentUser && currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveSection('admin');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold text-left transition-all ${
                          activeSection === 'admin'
                            ? `${themeAccent.bgLight} font-black border border-neutral-800/40`
                            : 'text-neutral-300 hover:bg-neutral-900/40 hover:text-white'
                        }`}
                      >
                        <Shield size={14} className="shrink-0" />
                        <span>Panel Admin</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* User Info inside Drawer */}
                <div className="border-t border-neutral-900 pt-5">
                  {currentUser ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-neutral-900/45 border border-neutral-900 p-2.5 rounded-lg">
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.name}
                          className={`h-9 w-9 rounded-full object-cover border-2 ${
                            currentUser.isPremium ? 'border-amber-400' : 'border-neutral-500'
                          }`}
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <h4 className="text-xs font-bold truncate text-white">{currentUser.name}</h4>
                          <p className="text-[9px] text-neutral-400 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2 bg-red-650/10 border border-red-950/40 hover:bg-red-500/20 text-red-400 rounded text-center text-xs font-bold cursor-pointer transition-colors"
                      >
                        Keluar Akun
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <h4 className="text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold mb-1">Akses Akun</h4>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onOpenAuth) onOpenAuth(false);
                        }}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r ${themeAccent.badgeGrad} hover:opacity-90 text-white rounded font-bold text-xs transition-opacity cursor-pointer`}
                      >
                        <LogIn size={13} />
                        <span>MASUK AKSES</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onOpenAuth) onOpenAuth(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 hover:text-white rounded font-bold text-xs transition-colors cursor-pointer"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.08H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.92l2.85-2.22.81-.6z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.08l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z" />
                        </svg>
                        <span>DAFTAR VIA GMAIL</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-neutral-900 bg-neutral-950 text-center text-[10px] text-neutral-500">
                <p className="font-extrabold text-neutral-400">FAKTA FAKTUAL TV</p>
                <p className="mt-0.5">Layanan Informasi Terpercaya 24 Jam</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
