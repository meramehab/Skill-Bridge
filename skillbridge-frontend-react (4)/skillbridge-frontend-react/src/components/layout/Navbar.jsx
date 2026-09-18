import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import {
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Briefcase,
  BookOpen,
  ShieldCheck,
  Award,
  ChevronDown,
} from 'lucide-react';

export function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#13161e" stroke="#222634" strokeWidth="1.5" />
      <path d="M12 28L20 12L28 28" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 23H25" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="12" r="2.5" fill="#10B981" />
    </svg>
  );
}

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  // إغلاق القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'client') return '/client-dashboard';
    return '/dashboard';
  };

  const navLinkStyle = ({ isActive }) =>
    `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
      isActive
        ? 'bg-white/10 text-white shadow-sm border border-white/10'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f1117]/90 backdrop-blur-xl border-b border-[#222634] text-white" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <LogoMark size={38} />
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1 font-display font-black text-xl tracking-tight">
              <span className="text-white group-hover:text-emerald-400 transition">Skill</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Bridge
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase mt-0.5">
              Academic & Freelance AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#13161e]/80 p-1.5 rounded-full border border-[#222634]">
          <NavLink to="/marketplace" className={navLinkStyle}>
            سوق المشاريع
          </NavLink>
          <NavLink to="/learning" className={navLinkStyle}>
            مسار التعلم
          </NavLink>
          <NavLink to="/cv-analysis" className={navLinkStyle}>
            تحليل الـ CV
          </NavLink>
          <NavLink to="/skill-verification" className={navLinkStyle}>
            توثيق المهارات
          </NavLink>
          <NavLink to="/courses" className={navLinkStyle}>
            الكورسات
          </NavLink>
          <NavLink to="/community" className={navLinkStyle}>
            المجتمع
          </NavLink>
          {user && (
            <NavLink to={getDashboardRoute()} className={navLinkStyle}>
              {user.role === 'admin' ? 'لوحة الإدارة' : user.role === 'client' ? 'لوحة العميل' : 'لوحة الطالب'}
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin/courses" className={navLinkStyle}>
              إدارة الكورسات
            </NavLink>
          )}
        </nav>

        {/* Right CTA / Search / User Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="بحث عن مشاريع أو مهارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 focus:w-60 transition-all duration-300 bg-[#13161e] border border-[#222634] text-xs rounded-full px-4 py-2 pr-9 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
          </form>

          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Link
                to={getDashboardRoute()}
                className="relative p-2.5 rounded-full bg-[#13161e] border border-[#222634] text-gray-300 hover:text-white hover:border-emerald-500/50 transition"
                title="الإشعارات"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0f1117]" />
              </Link>

              {/* Profile Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#13161e] border border-[#222634] hover:border-emerald-500/50 transition"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-gray-200 block leading-tight">
                      {user.fullName || 'مستخدم SkillBridge'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium block">
                      {user.role === 'admin' ? 'مدير النظام' : user.role === 'client' ? 'عميل / صاحب عمل' : 'طالب جامعي'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow">
                    {getInitials(user.fullName)}
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-[#13161e] border border-[#262c3d] rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#222634] sm:hidden">
                      <p className="text-xs font-bold text-white">{user.fullName}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{user.email}</p>
                    </div>

                    <Link
                      to={getDashboardRoute()}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5 hover:text-emerald-400 transition"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>{user.role === 'admin' ? 'لوحة الإدارة' : user.role === 'client' ? 'لوحة تحكم العميل' : 'لوحة تحكم الطالب'}</span>
                    </Link>

                    <Link
                      to="/cv-analysis"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5 hover:text-emerald-400 transition"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>تحليل السيرة الذاتية (CV)</span>
                    </Link>

                    <Link
                      to="/skill-verification"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-200 hover:bg-white/5 hover:text-emerald-400 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>توثيق المهارات</span>
                    </Link>

                    <div className="my-1 border-t border-[#222634]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 text-right transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-gray-300 hover:text-white transition"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition"
              >
                انضم الآن مجاناً
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-2 rounded-xl bg-[#13161e] border border-[#222634] text-gray-300 hover:text-white"
            aria-label="القائمة"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#13161e] border-b border-[#222634] px-6 py-5 space-y-3 animate-fadeIn">
          <nav className="flex flex-col gap-1.5">
            <Link
              to="/marketplace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              سوق المشاريع
            </Link>
            <Link
              to="/learning"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              مسار التعلم
            </Link>
            <Link
              to="/cv-analysis"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              تحليل الـ CV الذكي
            </Link>
            <Link
              to="/skill-verification"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              توثيق المهارات
            </Link>
            <Link
              to="/courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              الكورسات
            </Link>
            <Link
              to="/community"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-sm font-bold text-gray-200 hover:text-emerald-400"
            >
              المجتمع
            </Link>
            {user && (
              <Link
                to={getDashboardRoute()}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 text-sm font-bold text-emerald-400"
              >
                {user.role === 'admin' ? 'لوحة الإدارة' : user.role === 'client' ? 'لوحة العميل' : 'لوحة الطالب'}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
