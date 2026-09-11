/**
 * @file NavbarLogic.jsx
 * @description Logic wrapper & modern SkillBridge presentation for the Navbar component.
 * Features the SkillBridge dual-gradient logo mark, responsive drawer, search bar, and notifications.
 */
import React, { useState, useCallback, useRef } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  Sparkles,
  ChevronDown
} from "lucide-react";

/* ─── SkillBridge Logo Mark (SVG) ─── */
export function LogoMark({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="sbGradNav" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <line x1="22" y1="55" x2="50" y2="28" stroke="url(#sbGradNav)" strokeWidth="3" strokeLinecap="round" />
      <line x1="22" y1="55" x2="50" y2="72" stroke="url(#sbGradNav)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="28" x2="78" y2="40" stroke="url(#sbGradNav)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="72" x2="78" y2="60" stroke="url(#sbGradNav)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="28" x2="50" y2="72" stroke="url(#sbGradNav)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <polygon points="50,62 34,70 50,76 66,70" fill="url(#sbGradNav)" />
      <circle cx="22" cy="55" r="5" fill="url(#sbGradNav)" />
      <circle cx="50" cy="28" r="5" fill="url(#sbGradNav)" />
      <circle cx="78" cy="40" r="4" fill="url(#sbGradNav)" />
      <circle cx="78" cy="60" r="4" fill="url(#sbGradNav)" />
      <circle cx="50" cy="72" r="4" fill="url(#sbGradNav)" />
    </svg>
  );
}

export function NavbarLogic({
  user = null,
  notificationsCount = 0,
  onSearch = () => {},
  onLogout = () => {},
  renderNavbar
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const searchDebounceRef = useRef(null);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        onSearch(query);
      }, 300);
    },
    [onSearch]
  );

  const isAuthenticated = Boolean(user);

  const navLinks = isAuthenticated
    ? [
        { label: "الرئيسية", href: "/" },
        { label: "سوق العمل", href: "/marketplace" },
        { label: "مسار التعلم", href: "/learning" },
        { label: "المجتمع", href: "/community" },
        { label: "الفرق (Squads)", href: "/squad" },
        { label: "لوحة المتصدرين", href: "/leaderboard" }
      ]
    : [
        { label: "الرئيسية", href: "/" },
        { label: "سوق العمل", href: "/marketplace" },
        { label: "مسار التعلم", href: "/learning" },
        { label: "عن المنصة", href: "/#about" }
      ];

  const logicProps = {
    user,
    isAuthenticated,
    notificationsCount,
    navLinks,
    searchQuery,
    isMobileMenuOpen,
    handleSearchChange,
    toggleMobileMenu,
    closeMobileMenu
  };

  if (typeof renderNavbar === "function") {
    return renderNavbar(logicProps);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f1117]/85 backdrop-blur-xl border-b border-[#222634] text-white">
      <div className="container-custom flex items-center justify-between h-20">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <LogoMark size={38} />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5 font-display font-extrabold text-xl tracking-tight">
              <span className="text-white group-hover:text-emerald-400 transition">Skill</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Bridge
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">
              Academic & Freelance AI
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#13161e]/70 px-3 py-1.5 rounded-full border border-[#222634]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA / User controls */}
        <div className="flex items-center gap-3">
          {/* Search trigger */}
          <div className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="بحث عن مشاريع أو مهارات..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-48 focus:w-64 transition-all duration-300 bg-[#13161e] border border-[#222634] text-xs rounded-full px-4 py-2 pr-9 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <a
                href="/student"
                className="relative p-2.5 rounded-full bg-[#13161e] border border-[#222634] text-gray-300 hover:text-white hover:border-emerald-500/50 transition"
              >
                <Bell className="w-4 h-4" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0f1117]" />
                )}
              </a>

              {/* Profile Avatar / Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#13161e] border border-[#222634] hover:border-emerald-500/50 transition"
                >
                  <span className="text-xs font-bold text-gray-200 hidden md:inline">
                    {user?.name || "طالب مميز"}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow">
                    {user?.name ? user.name[0] : "S"}
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#13161e] border border-[#262c3d] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <a
                      href="/student"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      لوحة تحكم الطالب
                    </a>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      الملف الشخصي
                    </a>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <a
                href="/login"
                className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition"
              >
                تسجيل الدخول
              </a>
              <a
                href="/register"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 hover:brightness-105 transition"
              >
                انضم الآن مجاناً
              </a>
            </div>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#13161e] border border-[#222634] text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#13161e] border-b border-[#222634] px-6 py-5 animate-fadeIn">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="py-2.5 text-base font-bold text-gray-200 hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default NavbarLogic;
