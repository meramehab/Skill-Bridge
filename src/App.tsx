import { useState, useRef, useEffect, createContext, useContext } from "react";

/* ─── Theme context ─── */
type ThemeMode = "Dark" | "Light" | "System";
const ThemeCtx = createContext<{ theme: ThemeMode; setTheme: (t: ThemeMode) => void }>({
  theme: "Dark",
  setTheme: () => {},
});

function applyThemeClass(t: ThemeMode) {
  const el = document.documentElement;
  el.classList.remove("theme-light", "theme-dark");
  el.classList.add(t === "Light" ? "theme-light" : "theme-dark");
}

/** Returns semantic color tokens resolved from the active theme.
 *  Components use these for inline styles that CSS can't override. */
function useT() {
  const { theme } = useContext(ThemeCtx);
  const L = theme === "Light";
  return {
    L,
    bg:      L ? "#F5E6CA"              : "var(--sb-bg)",
    card:    L ? "#FFFFFF"              : "var(--sb-card)",
    card2:   L ? "#FBF5EC"             : "var(--sb-card2)",
    inset:   L ? "#F0E8D8"             : "var(--sb-inset)",
    border:  L ? "#D4C4A8"             : "var(--sb-border)",
    border2: L ? "#BFB09A"             : "var(--sb-border2)",
    text:    L ? "#1A1D24"             : "var(--sb-text)",
    muted:   L ? "#52504B"             : "#9ca3af",
    faint:   L ? "rgba(26,29,36,0.38)" : "rgba(255,255,255,0.28)",
    inputBg: L ? "#FBF5EC"             : "var(--sb-input-bg)",
    inputBd: L ? "#BFB09A"             : "var(--sb-input-border)",
  };
}

/* ─── SkillBridge Logo Mark (SVG) ─── */
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Green (left) → Blue (right) horizontal gradient */}
        <linearGradient id="sbGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Network node connection lines */}
      <line x1="22" y1="55" x2="50" y2="28" stroke="url(#sbGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="55" x2="50" y2="72" stroke="url(#sbGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="28" x2="78" y2="40" stroke="url(#sbGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="72" x2="78" y2="60" stroke="url(#sbGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="28" x2="50" y2="72" stroke="url(#sbGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="78" y1="40" x2="78" y2="60" stroke="url(#sbGrad)" strokeWidth="2" strokeLinecap="round" />

      {/* Graduation cap base */}
      <ellipse cx="50" cy="82" rx="18" ry="5" fill="url(#sbGrad)" opacity="0.5" />
      <polygon points="50,70 32,78 50,84 68,78" fill="url(#sbGrad)" opacity="0.7" />
      <polygon points="50,67 34,75 50,81 66,75" fill="none" stroke="url(#sbGrad)" strokeWidth="1.5" />
      {/* Cap top */}
      <polygon points="50,62 34,70 50,76 66,70" fill="url(#sbGrad)" />

      {/* Network nodes */}
      <circle cx="22" cy="55" r="5" fill="url(#sbGrad)" />
      <circle cx="50" cy="28" r="5" fill="url(#sbGrad)" />
      <circle cx="78" cy="40" r="4" fill="url(#sbGrad)" />
      <circle cx="78" cy="60" r="4" fill="url(#sbGrad)" />
      <circle cx="50" cy="72" r="4" fill="url(#sbGrad)" />

    </svg>
  );
}

/* ─── SkillBridge Logo Text ─── */
function LogoText({ size = "xl" }: { size?: string }) {
  const sizeMap: Record<string, { skill: string; bridge: string; ai: string }> = {
    xl: { skill: "1.25rem", bridge: "1.25rem", ai: "0.65rem" },
    "2xl": { skill: "1.5rem", bridge: "1.5rem", ai: "0.75rem" },
  };
  const s = sizeMap[size] ?? sizeMap["xl"];
  return (
    <div className="flex flex-col leading-none" style={{ gap: 0 }}>
      <span
        className="font-display font-bold"
        style={{ fontSize: s.skill, lineHeight: 1.1, color: "var(--sb-logo-skill, #ffffff)" }}
      >
        Skill
      </span>
      <div className="flex items-end" style={{ gap: 2 }}>
        <span
          className="font-display font-bold"
          style={{
            fontSize: s.bridge,
            lineHeight: 1.1,
            background: "linear-gradient(90deg, #10B981 0%, #2563EB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Bridge
        </span>
      </div>
    </div>
  );
}

/* ─── Confetti Button ─── */
function ConfettiBtn({
  children,
  className = "",
  color = "#2563EB",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  onClick?: () => void;
}) {
  const [active, setActive] = useState(false);
  const dots = [
    { top: "-8px", left: "10%", color: "#2563EB", delay: "0ms" },
    { top: "-8px", left: "30%", color: "#F59E0B", delay: "60ms" },
    { top: "-8px", left: "55%", color: "#10B981", delay: "30ms" },
    { top: "-8px", left: "75%", color: "#DC2626", delay: "90ms" },
    { top: "-8px", left: "90%", color: "#2563EB", delay: "20ms" },
    { top: "-8px", left: "50%", color: "#F59E0B", delay: "70ms" },
  ];

  return (
    <button
      className={`btn-confetti ${className}`}
      style={{ background: color }}
      onClick={onClick}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      {dots.map((d, i) =>
        active ? (
          <span
            key={i}
            className="confetti-dot"
            style={{
              top: d.top,
              left: d.left,
              background: d.color,
              animationDelay: d.delay,
            }}
          />
        ) : null
      )}
    </button>
  );
}

/* ─── Nav ─── */
function Nav({ onLogin, onSignUp, onDashboard, onNavigate, onApply }: { onLogin: () => void; onSignUp: () => void; onDashboard: () => void; onNavigate: (p: DashPage) => void; onApply?: () => void }) {
  const [homeOpen, setHomeOpen] = useState(false);
  const homeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (homeRef.current && !homeRef.current.contains(e.target as Node)) {
        setHomeOpen(false);
      }
    }
    if (homeOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [homeOpen]);
  const navLinks: { label: string; dest?: DashPage; isApply?: boolean }[] = [
    { label: "Learning Paths", dest: "Learning Paths" },
    { label: "Projects", dest: "Squad Projects" },
    { label: "Community", dest: "Community" },
    { label: "Apply", dest: "Job Application", isApply: true },
  ];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: "#1A1D24", borderBottom: "2px solid #2a2f3a" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <LogoMark size={38} />
        <LogoText size="xl" />
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {/* Home dropdown */}
        <div className="relative" ref={homeRef}>
          <button
            onClick={() => setHomeOpen(o => !o)}
            className="font-mono text-xs font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Home
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              style={{ transform: homeOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {homeOpen && (
            <div
              className="absolute top-full left-0 rounded-2xl overflow-hidden z-50"
              style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border2)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", minWidth: 180 }}
            >
              <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#10B981,#2563EB)" }} />

              {/* Profile option */}
              <button
                onClick={() => { setHomeOpen(false); onNavigate("Profile"); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
                style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--sb-border)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#ffffff06")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase tracking-widest">Profile</div>
                  <div className="font-body text-xs text-white/30 mt-0.5">View your public profile</div>
                </div>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              {/* Dashboard option */}
              <button
                onClick={() => { setHomeOpen(false); onNavigate("Dashboard"); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
                style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--sb-border)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#ffffff06")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#2563EB18", color: "#2563EB", border: "1px solid #2563EB33" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase tracking-widest">Dashboard</div>
                  <div className="font-body text-xs text-white/30 mt-0.5">Go to student dashboard</div>
                </div>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              {/* Settings option */}
              <button
                onClick={() => { setHomeOpen(false); onNavigate("Settings"); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
                style={{ background: "transparent", border: "none", borderBottom: "1px solid var(--sb-border)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#ffffff06")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F59E0B18", color: "#F59E0B", border: "1px solid #F59E0B33" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase tracking-widest">Settings</div>
                  <div className="font-body text-xs text-white/30 mt-0.5">Manage account and theme preferences</div>
                </div>
                <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>

              <div className="px-4 py-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10B981" }} />
                <span className="font-mono text-white/20" style={{ fontSize: "0.6rem" }}>SKILLBRIDGE · MEMBER AREA</span>
              </div>
            </div>
          )}
        </div>

        {/* Other nav links */}
        {navLinks.map(({ label, dest, isApply }) =>
          isApply && dest ? (
            <button
              key={label}
              onClick={() => onNavigate(dest)}
              className="font-mono text-xs font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-lg"
              style={{ background: "linear-gradient(135deg, #10B981, #2563EB)", color: "#ffffff", border: "none", cursor: "pointer" }}
            >
              {label}
            </button>
          ) : dest ? (
            <button
              key={label}
              onClick={() => onNavigate(dest)}
              className="font-mono text-xs font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {label}
            </button>
          ) : (
            <a key={label} href="#" className="font-mono text-xs font-bold text-white/70 hover:text-white transition-colors uppercase tracking-widest">
              {label}
            </a>
          )
        )}
      </div>

      {/* Search + CTA */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "#252a35", border: "1.5px solid #333" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="bg-transparent text-white/60 text-xs font-mono w-32 outline-none placeholder-white/30"
            placeholder="Search skills..."
          />
        </div>
        <button
          onClick={onLogin}
          className="font-mono text-xs font-bold text-white/60 hover:text-white px-4 py-2 rounded-lg uppercase tracking-widest transition-colors"
          style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}

/* ─── Login Modal ─── */
function LoginModal({ onClose, onSwitchToSignUp, onForgotPassword }: { onClose: () => void; onSwitchToSignUp: () => void; onForgotPassword: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(10,12,18,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border2)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors"
            style={{ background: "var(--sb-inset)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Logo + heading */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <LogoMark size={52} />
            <div className="text-center">
              <h2 className="font-display text-white text-2xl leading-tight">Welcome back</h2>
              <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">Sign in to your account</p>
            </div>
          </div>

          {/* Social buttons */}
          <div className="mb-6">
            <SocialButtons />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "#2a2f3a" }} />
            <span className="font-mono text-xs text-white/25 uppercase tracking-widest">or continue with email</span>
            <div className="flex-1 h-px" style={{ background: "#2a2f3a" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Email</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#10B981")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Password</label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-mono text-xs hover:underline"
                  style={{ color: "#10B981", background: "none", border: "none", cursor: "pointer" }}
                >
                  Forgot password?
                </button>
              </div>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#2563EB")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white uppercase tracking-widest mt-2 transition-all hover:-translate-y-0.5"
              style={{
                background: loading
                  ? "#1e2330"
                  : "linear-gradient(90deg, #10B981, #2563EB)",
                border: loading ? "1.5px solid #2a2f3a" : "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Switch to sign up */}
          <p className="text-center font-mono text-xs text-white/30 mt-6">
            No account yet?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="font-bold hover:underline"
              style={{ color: "#10B981", background: "none", border: "none", cursor: "pointer" }}
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Forgot Password Modal ─── */
function ForgotPasswordModal({ onClose, onBackToLogin }: { onClose: () => void; onBackToLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1600);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(10,12,18,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border2)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors"
            style={{ background: "var(--sb-inset)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Logo + heading */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="url(#fpGrad)" strokeWidth="2">
                <defs>
                  <linearGradient id="fpGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1.5" fill="#10B981" stroke="none" />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="font-display text-white text-2xl leading-tight">Forgot password?</h2>
              <p className="font-body text-sm text-white/40 mt-2 leading-relaxed max-w-xs mx-auto">
                Enter your email to receive a password reset link
              </p>
            </div>
          </div>

          {sent ? (
            /* Success state */
            <div
              className="flex flex-col items-center gap-4 py-6 rounded-2xl"
              style={{ background: "#10B98118", border: "1.5px solid #10B98144" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "#10B98122" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="font-mono text-sm font-bold text-white">Reset link sent!</p>
                <p className="font-body text-xs text-white/40 mt-1">
                  Check your inbox at <span style={{ color: "#10B981" }}>{email}</span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Email address</label>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                  style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                  onFocusCapture={e => (e.currentTarget.style.borderColor = "#10B981")}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                  />
                </div>
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white uppercase tracking-widest mt-2 transition-all hover:-translate-y-0.5"
                style={{
                  background: loading ? "#1e2330" : "linear-gradient(90deg, #10B981, #2563EB)",
                  border: loading ? "1.5px solid #2a2f3a" : "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                    </svg>
                    Sending…
                  </span>
                ) : "Send Reset Link →"}
              </button>
            </form>
          )}

          {/* Back to login */}
          <p className="text-center font-mono text-xs text-white/30 mt-6">
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 hover:underline"
              style={{ color: "#10B981", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared social buttons ─── */
function SocialButtons() {
  return (
    <div className="flex gap-3">
      <button
        className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-mono text-xs font-bold text-white/70 hover:text-white transition-all"
        style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#10B981")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.26 9.77A7.2 7.2 0 0 1 12 4.8c1.73 0 3.29.62 4.51 1.64l3.36-3.36A11.93 11.93 0 0 0 12 .8C7.61.8 3.81 3.26 1.82 6.93l3.44 2.84Z"/>
          <path fill="#34A853" d="M16.04 18.01A7.15 7.15 0 0 1 12 19.2a7.2 7.2 0 0 1-6.74-4.62L1.8 17.4A11.96 11.96 0 0 0 12 23.2c3.16 0 6.18-1.15 8.43-3.27l-4.39-1.92Z"/>
          <path fill="#FBBC05" d="M19.2 12c0-.6-.07-1.17-.18-1.73H12v3.27h4.02a3.5 3.5 0 0 1-1.49 2.3l4.38 1.91A11.92 11.92 0 0 0 19.2 12Z"/>
          <path fill="#4285F4" d="M5.26 14.58A7.2 7.2 0 0 1 4.8 12c0-.9.16-1.77.46-2.58L1.82 6.58A11.93 11.93 0 0 0 .8 12c0 1.92.45 3.73 1.24 5.34l3.22-2.76Z"/>
        </svg>
        Google
      </button>
      <button
        className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl font-mono text-xs font-bold text-white/70 hover:text-white transition-all"
        style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#2563EB")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>
        </svg>
        GitHub
      </button>
    </div>
  );
}

/* ─── Sign Up Modal ─── */
function SignUpModal({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(10,12,18,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border2)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors"
            style={{ background: "var(--sb-inset)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Logo + heading */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <LogoMark size={52} />
            <div className="text-center">
              <h2 className="font-display text-white text-2xl leading-tight">Create your account</h2>
              <p className="font-mono text-xs text-white/40 mt-1 uppercase tracking-widest">Start bridging the gap today</p>
            </div>
          </div>

          {/* Social buttons */}
          <SocialButtons />

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "#2a2f3a" }} />
            <span className="font-mono text-xs text-white/25 uppercase tracking-widest">or sign up with email</span>
            <div className="flex-1 h-px" style={{ background: "#2a2f3a" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Full Name</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#10B981")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Email</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#10B981")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-white/40 uppercase tracking-widest">Password</label>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)" }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#2563EB")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPass ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {/* Strength hint */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{
                        background: password.length >= i * 3
                          ? i <= 1 ? "#DC2626" : i === 2 ? "#F59E0B" : i === 3 ? "#10B981" : "#2563EB"
                          : "#2a2f3a"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Create account button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white uppercase tracking-widest mt-2 transition-all hover:-translate-y-0.5"
              style={{
                background: loading
                  ? "#1e2330"
                  : "linear-gradient(90deg, #10B981, #2563EB)",
                border: loading ? "1.5px solid #2a2f3a" : "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                  </svg>
                  Creating account…
                </span>
              ) : "Create Account →"}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center font-mono text-xs text-white/30 mt-6">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="font-bold hover:underline"
              style={{ color: "#10B981", background: "none", border: "none", cursor: "pointer" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Circuit SVG connecting badges ─── */
function CircuitLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 700 500"
      fill="none"
    >
      {/* Lines from center to badges */}
      <line x1="350" y1="250" x2="120" y2="120" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      <line x1="350" y1="250" x2="580" y2="120" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      <line x1="350" y1="250" x2="100" y2="380" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      <line x1="350" y1="250" x2="600" y2="390" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      {/* Dots at junctions */}
      <circle cx="120" cy="120" r="4" fill="#2563EB" opacity="0.8" />
      <circle cx="580" cy="120" r="4" fill="#10B981" opacity="0.8" />
      <circle cx="100" cy="380" r="4" fill="#DC2626" opacity="0.8" />
      <circle cx="600" cy="390" r="4" fill="#F59E0B" opacity="0.8" />
      <circle cx="350" cy="250" r="6" fill="#fff" opacity="0.1" />
      {/* Extra circuit corners */}
      <polyline points="120,120 120,80 200,80" stroke="#2563EB" strokeWidth="1" opacity="0.3" />
      <polyline points="580,120 580,80 500,80" stroke="#10B981" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ─── Skill Badge ─── */
function SkillBadge({
  label,
  icon,
  color,
  style,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="badge-hover absolute flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl"
      style={{
        ...style,
        background: "var(--sb-inset)",
        border: `2px solid ${color}`,
        boxShadow: `0 0 16px ${color}33`,
        minWidth: 110,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22` }}
      >
        {icon}
      </div>
      <span className="font-mono text-white text-xs font-bold uppercase tracking-wide text-center leading-tight">
        {label}
      </span>
      <span
        className="tag-pill"
        style={{ background: `${color}33`, color }}
      >
        Live
      </span>
    </div>
  );
}

/* ─── Flat Illustration: Stylized Screen + Student ─── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 420 320" className="w-full h-full" fill="none">
      {/* Monitor stand */}
      <rect x="188" y="264" width="44" height="14" rx="4" fill="#2a2f3a" />
      <rect x="168" y="276" width="84" height="8" rx="4" fill="#252a35" />
      {/* Monitor body */}
      <rect x="60" y="60" width="300" height="200" rx="16" fill="#252a35" stroke="#2563EB" strokeWidth="3" />
      {/* Screen */}
      <rect x="76" y="76" width="268" height="168" rx="10" fill="#0d1117" />
      {/* Screen glow */}
      <rect x="76" y="76" width="268" height="168" rx="10" fill="url(#screenGrad)" opacity="0.6" />
      {/* Code lines on screen */}
      <rect x="92" y="96" width="80" height="6" rx="3" fill="#2563EB" opacity="0.8" />
      <rect x="92" y="110" width="120" height="6" rx="3" fill="#10B981" opacity="0.7" />
      <rect x="92" y="124" width="60" height="6" rx="3" fill="#F59E0B" opacity="0.7" />
      <rect x="92" y="138" width="100" height="6" rx="3" fill="#DC2626" opacity="0.6" />
      <rect x="92" y="152" width="80" height="6" rx="3" fill="#2563EB" opacity="0.5" />
      <rect x="92" y="166" width="140" height="6" rx="3" fill="#10B981" opacity="0.5" />
      {/* Progress bar */}
      <rect x="92" y="186" width="236" height="10" rx="5" fill="#1e2330" />
      <rect x="92" y="186" width="148" height="10" rx="5" fill="#2563EB" />
      {/* Star/badge on screen */}
      <polygon points="280,115 284,127 297,127 287,134 291,146 280,139 269,146 273,134 263,127 276,127" fill="#F59E0B" opacity="0.9" />
      {/* Student character */}
      {/* Body */}
      <ellipse cx="316" cy="240" rx="28" ry="18" fill="#10B981" />
      {/* Head */}
      <circle cx="316" cy="212" r="22" fill="#F5E6CA" stroke="#1A1D24" strokeWidth="2" />
      {/* Hair */}
      <ellipse cx="316" cy="196" rx="20" ry="10" fill="#1A1D24" />
      {/* Eyes */}
      <circle cx="309" cy="212" r="3" fill="#1A1D24" />
      <circle cx="323" cy="212" r="3" fill="#1A1D24" />
      <circle cx="310" cy="211" r="1" fill="white" />
      <circle cx="324" cy="211" r="1" fill="white" />
      {/* Smile */}
      <path d="M309 220 Q316 226 323 220" stroke="#1A1D24" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Arm holding tablet */}
      <path d="M290 232 Q276 240 270 248" stroke="#F5E6CA" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Tablet */}
      <rect x="252" y="244" width="36" height="26" rx="4" fill="#2563EB" stroke="#1A1D24" strokeWidth="2" />
      <rect x="256" y="248" width="28" height="18" rx="2" fill="#0d1117" />
      <rect x="258" y="252" width="18" height="3" rx="1.5" fill="#10B981" opacity="0.8" />
      <rect x="258" y="258" width="12" height="3" rx="1.5" fill="#F59E0B" opacity="0.8" />
      {/* Floating sparkles */}
      <circle cx="100" cy="90" r="4" fill="#F59E0B" opacity="0.6" />
      <circle cx="360" cy="80" r="3" fill="#10B981" opacity="0.5" />
      <circle cx="80" cy="220" r="3" fill="#DC2626" opacity="0.5" />
      <circle cx="380" cy="200" r="5" fill="#2563EB" opacity="0.4" />
      {/* Gradients */}
      <defs>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.08" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Hero Section ─── */
function Hero({ onDashboard, onSignUp }: { onDashboard: () => void; onSignUp: () => void }) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
      style={{ background: "#1A1D24" }}
    >
      {/* BG grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Central illustration container */}
      <div className="relative w-full max-w-3xl mx-auto" style={{ height: 500 }}>
        <CircuitLines />

        {/* Monitor illustration — floating */}
        <div
          className="float-anim absolute"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 340, height: 280 }}
        >
          <HeroIllustration />
        </div>

        {/* Skill badges */}
        <SkillBadge
          label="CV Matching"
          color="#2563EB"
          style={{ top: 30, left: 10 }}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          }
        />
        <SkillBadge
          label="Skill Badges"
          color="#10B981"
          style={{ top: 30, right: 10 }}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
              <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          }
        />
        <SkillBadge
          label="Leaderboard"
          color="#DC2626"
          style={{ bottom: 30, left: 10 }}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          }
        />
        <SkillBadge
          label="Squad Projects"
          color="#F59E0B"
          style={{ bottom: 30, right: 10 }}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          }
        />
      </div>

      {/* Headline */}
      <div className="text-center mt-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest" style={{ background: "#2563EB22", border: "1px solid #2563EB44", color: "#60a5fa" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
          Now open for enrollment
        </div>
        <h1
          className="font-display text-white leading-none mb-4"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.01em" }}
        >
          BRIDGE THE GAP{" "}
          <span style={{ color: "#F59E0B" }}>TO YOUR</span>
          <br />
          <span style={{ color: "#2563EB" }}>CAREER!</span>
        </h1>
        <p className="font-body text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Learn verified skills, match with top employers, and collaborate globally — all from one platform designed for the next generation of professionals.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <ConfettiBtn
            className="font-mono text-sm font-bold text-white px-8 py-3.5 rounded-xl uppercase tracking-widest"
            color="#2563EB"
            onClick={onSignUp}
          >
            Start Learning Free
          </ConfettiBtn>
          <ConfettiBtn
            className="font-mono text-sm font-bold text-white px-8 py-3.5 rounded-xl uppercase tracking-widest"
            color="#10B981"
            onClick={onDashboard}
          >
            View Dashboard →
          </ConfettiBtn>
        </div>

        {/* Stats strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {[
            { n: "48K+", label: "Active Learners", color: "#2563EB" },
            { n: "320+", label: "Skill Paths", color: "#10B981" },
            { n: "1.2K", label: "Hiring Partners", color: "#F59E0B" },
            { n: "96%", label: "Job Match Rate", color: "#DC2626" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl" style={{ color: s.color }}>{s.n}</div>
              <div className="font-mono text-white/40 text-xs uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Panel Illustration ─── */
function PanelIlloJourney() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full shimmer-art">
      {/* Road/path illustration */}
      <rect x="0" y="0" width="200" height="140" rx="10" fill="transparent" />
      {/* Path */}
      <path d="M20 120 Q60 80 100 70 Q140 60 180 30" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="8 4" />
      {/* Steps/nodes */}
      {[
        { cx: 30, cy: 115, c: "#F59E0B" },
        { cx: 72, cy: 86, c: "#10B981" },
        { cx: 112, cy: 70, c: "#2563EB" },
        { cx: 155, cy: 46, c: "#DC2626" },
        { cx: 182, cy: 28, c: "#F59E0B" },
      ].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="12" fill={p.c} />
          <circle cx={p.cx} cy={p.cy} r="6" fill="white" opacity="0.5" />
        </g>
      ))}
      {/* Device (phone) */}
      <rect x="148" y="68" width="30" height="50" rx="6" fill="#1e2330" stroke="#2563EB" strokeWidth="2" />
      <rect x="152" y="74" width="22" height="34" rx="3" fill="#0d1117" />
      <rect x="154" y="78" width="14" height="4" rx="2" fill="#10B981" opacity="0.9" />
      <rect x="154" y="86" width="10" height="3" rx="1.5" fill="#F59E0B" opacity="0.7" />
      {/* Match icon */}
      <rect x="8" y="44" width="8" height="40" rx="3" fill="#F59E0B" />
      <rect x="8" y="72" width="8" height="8" rx="2" fill="#DC2626" />
      {/* Stars */}
      <circle cx="60" cy="20" r="3" fill="#F59E0B" opacity="0.8" />
      <circle cx="130" cy="100" r="4" fill="#10B981" opacity="0.5" />
      <circle cx="185" cy="90" r="2" fill="#2563EB" opacity="0.6" />
    </svg>
  );
}

function PanelIlloVerified() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full shimmer-art">
      {/* Badge main */}
      <polygon points="100,18 116,40 142,36 138,62 158,76 142,92 148,118 122,110 100,126 78,110 52,118 58,92 42,76 62,62 58,36 84,40" fill="#F59E0B" />
      <polygon points="100,30 113,48 135,44 131,66 148,78 134,90 140,112 118,105 100,118 82,105 60,112 66,90 52,78 69,66 65,44 87,48" fill="#F5E6CA" />
      {/* Check */}
      <path d="M82 78 L94 90 L118 66" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Stars around */}
      <circle cx="28" cy="36" r="6" fill="#10B981" opacity="0.7" />
      <circle cx="170" cy="106" r="5" fill="#DC2626" opacity="0.6" />
      <circle cx="170" cy="30" r="4" fill="#2563EB" opacity="0.5" />
      <circle cx="30" cy="110" r="4" fill="#F59E0B" opacity="0.6" />
      {/* Ribbon */}
      <path d="M86 118 L80 135 L100 126 L120 135 L114 118" fill="#DC2626" />
      {/* Skill bars */}
      <rect x="12" y="70" width="22" height="6" rx="3" fill="#2563EB" opacity="0.8" />
      <rect x="12" y="80" width="16" height="6" rx="3" fill="#10B981" opacity="0.7" />
      <rect x="12" y="90" width="20" height="6" rx="3" fill="#F59E0B" opacity="0.6" />
    </svg>
  );
}

function PanelIlloCV() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full shimmer-art">
      {/* CV page */}
      <rect x="28" y="12" width="80" height="116" rx="6" fill="#252a35" stroke="#2563EB" strokeWidth="2" />
      <rect x="36" y="24" width="40" height="8" rx="4" fill="#2563EB" opacity="0.9" />
      <rect x="36" y="38" width="60" height="4" rx="2" fill="#fff" opacity="0.2" />
      <rect x="36" y="46" width="52" height="4" rx="2" fill="#fff" opacity="0.2" />
      <rect x="36" y="54" width="58" height="4" rx="2" fill="#fff" opacity="0.15" />
      {/* Match lines */}
      <line x1="108" y1="42" x2="142" y2="42" stroke="#10B981" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="108" y1="62" x2="142" y2="62" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
      <line x1="108" y1="82" x2="142" y2="82" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 3" />
      {/* Job posting */}
      <rect x="142" y="20" width="48" height="110" rx="6" fill="#252a35" stroke="#10B981" strokeWidth="2" />
      <rect x="148" y="30" width="28" height="6" rx="3" fill="#10B981" opacity="0.9" />
      <rect x="148" y="42" width="34" height="3" rx="1.5" fill="#fff" opacity="0.2" />
      <rect x="148" y="50" width="30" height="3" rx="1.5" fill="#fff" opacity="0.15" />
      <rect x="148" y="58" width="32" height="3" rx="1.5" fill="#fff" opacity="0.2" />
      {/* Score badge */}
      <circle cx="125" cy="72" r="22" fill="#1A1D24" stroke="#2563EB" strokeWidth="3" />
      <text x="125" y="78" textAnchor="middle" fill="#2563EB" fontSize="13" fontWeight="700" fontFamily="monospace">87%</text>
      {/* small dots */}
      <circle cx="20" cy="30" r="4" fill="#F59E0B" opacity="0.7" />
      <circle cx="195" cy="18" r="3" fill="#DC2626" opacity="0.5" />
    </svg>
  );
}

function PanelIlloSquads() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full shimmer-art">
      {/* Globe */}
      <circle cx="100" cy="70" r="52" fill="#1e2330" stroke="#2563EB" strokeWidth="2" />
      <ellipse cx="100" cy="70" rx="28" ry="52" fill="none" stroke="#2563EB" strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="100" cy="70" rx="52" ry="20" fill="none" stroke="#2563EB" strokeWidth="1.5" opacity="0.4" />
      <line x1="48" y1="70" x2="152" y2="70" stroke="#2563EB" strokeWidth="1" opacity="0.3" />
      <line x1="100" y1="18" x2="100" y2="122" stroke="#2563EB" strokeWidth="1" opacity="0.3" />
      {/* Avatars on globe */}
      {[
        { cx: 72, cy: 46, c: "#10B981" },
        { cx: 130, cy: 50, c: "#DC2626" },
        { cx: 62, cy: 94, c: "#F59E0B" },
        { cx: 138, cy: 98, c: "#2563EB" },
      ].map((a, i) => (
        <g key={i}>
          <circle cx={a.cx} cy={a.cy} r="10" fill={a.c} />
          <circle cx={a.cx} cy={a.cy - 2} r="4" fill="#F5E6CA" opacity="0.8" />
          <path d={`M${a.cx - 5} ${a.cy + 6} Q${a.cx} ${a.cy + 10} ${a.cx + 5} ${a.cy + 6}`} fill="#F5E6CA" opacity="0.6" />
        </g>
      ))}
      {/* Connection lines */}
      <line x1="72" y1="46" x2="130" y2="50" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
      <line x1="72" y1="46" x2="62" y2="94" stroke="#10B981" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
      <line x1="130" y1="50" x2="138" y2="98" stroke="#DC2626" strokeWidth="1.5" opacity="0.5" strokeDasharray="3 3" />
    </svg>
  );
}

const panels: { tag: string; title: string; body: string; color: string; borderClass: string; IlloComp: () => React.ReactElement; btn: string; dest: DashPage }[] = [
  {
    tag: "A NEW JOURNEY",
    title: "Your Learning Path,\nPersonalized",
    body: "AI-curated skill tracks based on your goals, experience, and the roles you want. Learn at your own pace, earn badges along the way.",
    color: "#2563EB",
    borderClass: "card-border-blue",
    IlloComp: PanelIlloJourney,
    btn: "Start Your Path",
    dest: "Learning Paths",
  },
  {
    tag: "VERIFIED SKILLS",
    title: "Earn Badges\nThat Matter",
    body: "Every completed module earns a cryptographically verified skill badge, instantly shareable to your portfolio and LinkedIn profile.",
    color: "#10B981",
    borderClass: "card-border-green",
    IlloComp: PanelIlloVerified,
    btn: "See All Certifications",
    dest: "Skill Badges",
  },
  {
    tag: "CV MATCHING",
    title: "Get Matched With\nTop Employers",
    body: "Our AI reads your skills and projects, then matches you to live job postings with a transparency score — no more black-box applications.",
    color: "#DC2626",
    borderClass: "card-border-red",
    IlloComp: PanelIlloCV,
    btn: "Check My Match Score",
    dest: "CV Matching",
  },
  {
    tag: "GLOBAL SQUADS",
    title: "Build Real Things\nWith Real People",
    body: "Join project squads with learners from 90+ countries. Real deadlines. Real teamwork. Real portfolio pieces that employers trust.",
    color: "#F59E0B",
    borderClass: "card-border-yellow",
    IlloComp: PanelIlloSquads,
    btn: "Find Your Squad",
    dest: "Squad Projects",
  },
];

function FeaturePanels({ onNavigate }: { onNavigate: (p: DashPage) => void }) {
  return (
    <section className="cream-section rough-edge-top py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="tag-pill mb-4 inline-block"
            style={{ background: "#2563EB22", color: "#2563EB", border: "1px solid #2563EB44" }}
          >
            PLATFORM FEATURES
          </span>
          <h2
            className="font-display leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#1A1D24" }}
          >
            Everything You Need To{" "}
            <span style={{ color: "#2563EB" }}>Level Up</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {panels.map((p, i) => (
            <div
              key={i}
              className={`panel-hover rounded-2xl p-6 ${p.borderClass} cursor-pointer`}
              style={{
                background: i % 2 === 0 ? "#fff" : "#fdf6e8",
                boxShadow: `4px 4px 0 ${p.color}33`,
              }}
              onClick={() => onNavigate(p.dest)}
            >
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className="tag-pill"
                      style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44` }}
                    >
                      {p.tag}
                    </span>
                    <h3
                      className="font-display mt-3 leading-tight"
                      style={{ fontSize: "1.5rem", color: "#1A1D24", whiteSpace: "pre-line" }}
                    >
                      {p.title}
                    </h3>
                  </div>
                </div>

                {/* Illustration */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ height: 160, background: "#1A1D2411", padding: "8px" }}
                >
                  <p.IlloComp />
                </div>

                <p className="font-body text-sm leading-relaxed" style={{ color: "#4a3f2f" }}>
                  {p.body}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-2">
                  <ConfettiBtn
                    className="font-mono text-xs font-bold text-white px-5 py-2.5 rounded-xl uppercase tracking-widest"
                    color={p.color}
                    onClick={() => onNavigate(p.dest)}
                  >
                    {p.btn}
                  </ConfettiBtn>
                  <button
                    onClick={() => onNavigate(p.dest)}
                    className="font-mono text-xs uppercase tracking-widest hover:underline"
                    style={{ color: p.color, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Advanced Feature Cards ─── */
function CVAnalysisCard() {
  return (
    <div className="flex flex-col gap-3">
      {/* Resume bars */}
      {[
        { label: "React", pct: 92, color: "#2563EB" },
        { label: "Python", pct: 78, color: "#10B981" },
        { label: "SQL", pct: 85, color: "#F59E0B" },
        { label: "Design", pct: 60, color: "#DC2626" },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/50 w-12 shrink-0">{s.label}</span>
          <div className="flex-1 h-2 rounded-full" style={{ background: "#ffffff18" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${s.pct}%`, background: s.color }}
            />
          </div>
          <span className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.pct}%</span>
        </div>
      ))}
      <div
        className="mt-2 rounded-xl p-3 flex items-center justify-between"
        style={{ background: "#2563EB22", border: "1px solid #2563EB44" }}
      >
        <span className="font-mono text-xs text-white/60">ATS Compatibility</span>
        <span className="font-display text-2xl" style={{ color: "#2563EB" }}>94%</span>
      </div>
    </div>
  );
}

function LeaderboardCard() {
  const leaders = [
    { rank: 1, name: "Priya S.", pts: "9,842", country: "🇮🇳", color: "#F59E0B" },
    { rank: 2, name: "Marcus L.", pts: "9,210", country: "🇧🇷", color: "var(--sb-text-muted)" },
    { rank: 3, name: "Amina K.", pts: "8,994", country: "🇳🇬", color: "#cd7f32" },
    { rank: 4, name: "Jonas R.", pts: "8,340", country: "🇩🇪", color: "var(--sb-text-muted)" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {leaders.map((l) => (
        <div
          key={l.rank}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: l.rank === 1 ? "#F59E0B18" : "#ffffff08" }}
        >
          <span className="font-display text-lg w-6 text-center" style={{ color: l.color }}>
            {l.rank}
          </span>
          <span className="font-body text-sm text-white/80 flex-1">{l.name} {l.country}</span>
          <span className="font-mono text-xs font-bold" style={{ color: l.color }}>{l.pts} pts</span>
        </div>
      ))}
      <div className="text-center mt-1">
        <span className="font-mono text-xs text-white/30">Updated every 24h · 48,320 participants</span>
      </div>
    </div>
  );
}

function PortfolioCard() {
  const projects = [
    { name: "E-Commerce API", tags: ["Node.js", "MongoDB"], color: "#10B981", views: "2.4K" },
    { name: "ML Sentiment Tool", tags: ["Python", "BERT"], color: "#2563EB", views: "1.8K" },
    { name: "Dashboard UI", tags: ["React", "D3"], color: "#F59E0B", views: "3.1K" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {projects.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ background: "#ffffff08", border: `1px solid ${p.color}33` }}
        >
          <div className="w-2 h-10 rounded-full shrink-0" style={{ background: p.color }} />
          <div className="flex-1 min-w-0">
            <div className="font-body text-sm text-white font-semibold truncate">{p.name}</div>
            <div className="flex gap-1 mt-0.5 flex-wrap">
              {p.tags.map((t) => (
                <span key={t} className="tag-pill" style={{ background: `${p.color}22`, color: p.color, fontSize: 9 }}>{t}</span>
              ))}
            </div>
          </div>
          <span className="font-mono text-xs text-white/40">{p.views} views</span>
        </div>
      ))}
    </div>
  );
}

function JobMatchCard() {
  const jobs = [
    { title: "Frontend Engineer", co: "Stripe", match: 93, color: "#2563EB" },
    { title: "Data Analyst", co: "Spotify", match: 87, color: "#10B981" },
    { title: "UX Engineer", co: "Figma", match: 79, color: "#F59E0B" },
  ];
  return (
    <div className="flex flex-col gap-3">
      {jobs.map((j) => (
        <div
          key={j.title}
          className="flex items-center gap-3 px-3 py-3 rounded-xl"
          style={{ background: "#ffffff08" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display text-xs"
            style={{ background: `${j.color}22`, color: j.color, border: `1px solid ${j.color}44` }}
          >
            {j.co.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-body text-sm text-white font-semibold truncate">{j.title}</div>
            <div className="font-mono text-xs text-white/40">{j.co}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-xl leading-none" style={{ color: j.color }}>{j.match}%</div>
            <div className="font-mono text-xs text-white/30">match</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const advancedCards = [
  {
    tag: "CV ANALYSIS",
    title: "Know Your Edge",
    color: "#2563EB",
    Content: CVAnalysisCard,
  },
  {
    tag: "LEADERBOARD",
    title: "Rise to the Top",
    color: "#F59E0B",
    Content: LeaderboardCard,
  },
  {
    tag: "PORTFOLIO",
    title: "Show Your Work",
    color: "#10B981",
    Content: PortfolioCard,
  },
  {
    tag: "JOB MATCHES",
    title: "Your Next Role",
    color: "#DC2626",
    Content: JobMatchCard,
  },
];

const cardDestinations: Record<string, DashPage> = {
  "CV ANALYSIS": "CV Matching",
  "LEADERBOARD": "Leaderboard",
  "PORTFOLIO":   "Profile",
  "JOB MATCHES": "Job Matches",
};

function AdvancedCards({ onNavigate }: { onNavigate: (p: DashPage) => void }) {
  return (
    <section className="py-20 px-6" style={{ background: "#1A1D24" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className="tag-pill mb-4 inline-block"
            style={{ background: "#F59E0B22", color: "#F59E0B", border: "1px solid #F59E0B44" }}
          >
            ADVANCED FEATURES
          </span>
          <h2
            className="font-display text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Built For the{" "}
            <span style={{ color: "#10B981" }}>Ambitious</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {advancedCards.map((c, i) => {
            const dest = cardDestinations[c.tag];
            return (
              <div
                key={i}
                className="panel-hover rounded-2xl p-5 flex flex-col gap-4 cursor-pointer"
                style={{
                  background: "var(--sb-card)",
                  border: `2px solid ${c.color}55`,
                  boxShadow: `0 0 24px ${c.color}18`,
                }}
                onClick={() => onNavigate(dest)}
              >
                <div>
                  <span className="tag-pill" style={{ background: `${c.color}22`, color: c.color }}>
                    {c.tag}
                  </span>
                  <h3 className="font-display mt-2 leading-tight" style={{ fontSize: "1.2rem", color: "var(--sb-text)" }}>
                    {c.title}
                  </h3>
                </div>
                <c.Content />
                <ConfettiBtn
                  className="font-mono text-xs font-bold text-white w-full py-2.5 rounded-xl uppercase tracking-widest mt-auto"
                  color={c.color}
                  onClick={() => onNavigate(dest)}
                >
                  Explore →
                </ConfettiBtn>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const platformDestinations: Record<string, DashPage> = {
  "Learning Paths": "Learning Paths",
  "Skill Badges":   "Skill Badges",
  "CV Matching":    "CV Matching",
  "Squad Projects": "Squad Projects",
};

/* ─── Footer ─── */
function Footer({ onNavigate, onAdmin }: { onNavigate: (p: DashPage) => void; onAdmin?: () => void }) {
  return (
    <footer className="pt-16 pb-8 px-8" style={{ background: "var(--sb-card)", borderTop: "2px solid #252a35" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <LogoMark size={44} />
              <LogoText size="2xl" />
            </div>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "var(--sb-text-muted)" }}>
              Closing the gap between education and employment — one verified skill at a time.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { label: "X", icon: "𝕏" },
                { label: "Li", icon: "in" },
                { label: "Gh", icon: "⟨/⟩" },
                { label: "Dc", icon: "▶" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs text-white/50 hover:text-white transition-colors"
                  style={{ background: "var(--sb-inset)", border: "1px solid var(--sb-border2)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Platform",
              links: ["Learning Paths", "Skill Badges", "CV Matching", "Squad Projects"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Blog", "Press Kit"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookie Policy", "Accessibility"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">{col.title}</div>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => {
                  const dest = col.title === "Platform" ? platformDestinations[l] : undefined;
                  return (
                    <li key={l}>
                      {dest ? (
                        <button
                          onClick={() => onNavigate(dest)}
                          className="font-body text-sm text-white/50 hover:text-white transition-colors text-left"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        >
                          {l}
                        </button>
                      ) : (
                        <a href="#" className="font-body text-sm text-white/50 hover:text-white transition-colors">{l}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid #252a35" }}
        >
          <span className="font-mono text-xs text-white/30">
            © 2026 SkillBridge Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {onAdmin && (
              <button
                onClick={onAdmin}
                className="font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#DC262666", transition: "color 0.2s", letterSpacing: "0.12em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#DC2626")}
                onMouseLeave={e => (e.currentTarget.style.color = "#DC262666")}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Admin Portal
              </button>
            )}
            <div className="flex items-center gap-2">
              {["#2563EB", "#10B981", "#DC2626", "#F59E0B"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.4 }} />
              ))}
              <span className="font-mono text-xs text-white/20 ml-1">Built for humans.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Dashboard ─── */
function CVGauge({ score }: { score: number }) {
  const r = 70;
  const circ = Math.PI * r; // half-circle circumference
  const filled = (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#DC2626";
  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="110" viewBox="0 0 180 110">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none" stroke="#1e2330" strokeWidth="14" strokeLinecap="butt"
        />
        {/* Fill */}
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
        {/* Score text */}
        <text x="90" y="82" textAnchor="middle" fill="white" fontSize="28" fontFamily="Caveat" fontWeight="700">{score}%</text>
        <text x="90" y="100" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Space Mono">MATCH SCORE</text>
        {/* Needle */}
        {(() => {
          const angle = -180 + (score / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const nx = 90 + 58 * Math.cos(rad);
          const ny = 95 + 58 * Math.sin(rad);
          return <line x1="90" y1="95" x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />;
        })()}
        <circle cx="90" cy="95" r="5" fill={color} />
      </svg>
      <div className="flex gap-4 mt-1">
        {[["Poor", "#DC2626"], ["Fair", "#F59E0B"], ["Good", "#10B981"]].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="font-mono text-xs" style={{ color: "var(--sb-text-muted)" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page: Learning Paths ─── */
function PageLearningPaths() {
  const t = useT();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "In Progress", "Not Started", "Completed"];
  const paths = [
    { title: "Full-Stack Development", progress: 68, total: 24, done: 16, color: "#2563EB", tag: "In Progress", desc: "Master React, Node.js, databases, and deployment pipelines.", modules: ["HTML & CSS Foundations","JavaScript Core","React & State","Node.js & REST APIs","Databases & ORM","Deployment & CI/CD"] },
    { title: "Data Science & ML", progress: 34, total: 18, done: 6, color: "#10B981", tag: "In Progress", desc: "From pandas to neural networks — a practical ML track.", modules: ["Python for Data","NumPy & Pandas","Data Viz","Scikit-Learn","Neural Nets","MLOps Basics"] },
    { title: "UX Design Fundamentals", progress: 91, total: 12, done: 11, color: "#F59E0B", tag: "Almost done", desc: "User research, wireframing, Figma, and design systems.", modules: ["Design Thinking","User Research","Wireframing","Figma Mastery","Design Systems","Handoff & Specs"] },
    { title: "Cloud Architecture", progress: 10, total: 20, done: 2, color: "#DC2626", tag: "Just started", desc: "AWS, GCP, and Azure fundamentals for modern engineers.", modules: ["Cloud Concepts","IAM & Security","Compute Services","Storage Solutions","Networking","Serverless"] },
    { title: "Cybersecurity Essentials", progress: 0, total: 16, done: 0, color: "#8B5CF6", tag: "Not started", desc: "Ethical hacking, threat modelling, and secure code.", modules: ["Threat Landscape","Network Security","Cryptography","Pen Testing","Incident Response","Compliance"] },
    { title: "Mobile Dev with React Native", progress: 55, total: 14, done: 8, color: "#EC4899", tag: "In Progress", desc: "Cross-platform apps for iOS and Android with React Native.", modules: ["RN Foundations","Navigation","State Management","Native APIs","Animations","Publishing"] },
  ];
  const visible = filter === "All" ? paths : paths.filter(p => p.tag.includes(filter === "Not Started" ? "Not started" : filter === "Completed" ? "done" : filter));
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>LEARNING PATHS</span>
          <h2 className="font-display text-white mt-1" style={{ fontSize: "2rem" }}>Your Journeys</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all"
              style={{ background: filter === f ? "#2563EB" : "#1e2330", color: filter === f ? "white" : "var(--sb-text-muted)", border: `1px solid ${filter === f ? "#2563EB" : "#2a2f3a"}` }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map(p => (
          <div key={p.title} className="panel-hover rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: `1.5px solid ${p.color}33` }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="tag-pill" style={{ background: `${p.color}22`, color: p.color }}>{p.tag}</span>
                <h3 className="font-display text-white mt-2" style={{ fontSize: "1.25rem" }}>{p.title}</h3>
                <p className="font-body text-xs text-white/40 mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(${p.color} ${p.progress * 3.6}deg, #1e2330 0deg)` }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold" style={{ background: "var(--sb-card)", color: p.color }}>{p.progress}%</div>
              </div>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "var(--sb-inset)" }}>
              <div className="h-1.5 rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {p.modules.map((m, i) => (
                <div key={m} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center" style={{ background: i < p.done ? p.color : "#1e2330" }}>
                    {i < p.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-body text-xs truncate" style={{ color: i < p.done ? "var(--sb-text-muted)" : "var(--sb-text-faint)" }}>{m}</span>
                </div>
              ))}
            </div>
            <ConfettiBtn className="font-mono text-xs font-bold text-white w-full py-2.5 rounded-xl uppercase tracking-widest mt-auto" color={p.color}>
              {p.progress === 0 ? "Start Path" : p.progress === 100 ? "Review Path" : "Continue →"}
            </ConfettiBtn>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page: Skill Badges ─── */
function PageSkillBadges() {
  const t = useT();
  const [tab, setTab] = useState("Earned");
  const earned = [
    { label: "React Pro", color: "#2563EB", date: "Aug 12, 2026", xp: 320 },
    { label: "SQL Master", color: "#10B981", date: "Jul 28, 2026", xp: 280 },
    { label: "API Builder", color: "#F59E0B", date: "Jul 14, 2026", xp: 260 },
    { label: "Git Expert", color: "#DC2626", date: "Jun 30, 2026", xp: 200 },
    { label: "CSS Wizard", color: "#8B5CF6", date: "Jun 10, 2026", xp: 180 },
    { label: "Docker Basics", color: "#EC4899", date: "May 22, 2026", xp: 220 },
  ];
  const locked = [
    { label: "TypeScript Ace", color: "#2563EB", req: "Complete TS module", pct: 60 },
    { label: "Cloud Architect", color: "#DC2626", req: "Finish Cloud Path", pct: 10 },
    { label: "ML Engineer", color: "#10B981", req: "Complete ML Track", pct: 34 },
    { label: "Security Pro", color: "#8B5CF6", req: "Start CyberSec Path", pct: 0 },
  ];
  const show = tab === "Earned" ? earned : locked;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>SKILL BADGES</span>
          <h2 className="font-display text-white mt-1" style={{ fontSize: "2rem" }}>Your Credentials</h2>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--sb-inset)" }}>
          {["Earned","In Progress"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="font-mono text-xs px-4 py-2 rounded-lg uppercase tracking-widest transition-all"
              style={{ background: tab === t ? "#10B981" : "transparent", color: tab === t ? "var(--sb-text)" : "var(--sb-text-muted)" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {[{v:"6",l:"Badges Earned",c:"#10B981"},{v:"4",l:"In Progress",c:"#F59E0B"},{v:"1,460",l:"Total XP",c:"#2563EB"},{v:"Top 8%",l:"Global Rank",c:"#DC2626"}].map(s=>(
          <div key={s.l} className="rounded-2xl p-4" style={{ background: "var(--sb-card)", border: `1.5px solid ${s.c}33` }}>
            <div className="font-display text-3xl" style={{ color: s.c }}>{s.v}</div>
            <div className="font-mono text-xs text-white/30 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tab === "Earned" ? earned.map(b => (
          <div key={b.label} className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center panel-hover" style={{ background: "var(--sb-card)", border: `1.5px solid ${b.color}44` }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: `${b.color}22`, border: `3px solid ${b.color}` }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="1.8">
                <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-white text-xl">{b.label}</div>
              <div className="font-mono text-xs text-white/30 mt-0.5">Earned {b.date}</div>
            </div>
            <div className="tag-pill" style={{ background: `${b.color}22`, color: b.color }}>+{b.xp} XP</div>
            <button className="font-mono text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">Share →</button>
          </div>
        )) : locked.map(b => (
          <div key={b.label} className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{ background: "var(--sb-inset)", border: "3px solid #2a2f3a" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-white/40 text-xl">{b.label}</div>
              <div className="font-body text-xs text-white/25 mt-1">{b.req}</div>
            </div>
            <div className="w-full">
              <div className="h-1.5 rounded-full" style={{ background: "var(--sb-inset)" }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${b.pct}%`, background: b.color }} />
              </div>
              <div className="font-mono text-xs text-white/30 mt-1">{b.pct}% complete</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page: CV Matching ─── */
function PageCVMatching({ onNavigate }: { onNavigate?: (p: DashPage) => void }) {
  const t = useT();
  const skills = [
    { label: "React",       pct: 92, color: "#2563EB", demand: "Very High" },
    { label: "TypeScript",  pct: 78, color: "#10B981", demand: "High" },
    { label: "Node.js",     pct: 81, color: "#F59E0B", demand: "High" },
    { label: "SQL",         pct: 85, color: "#DC2626", demand: "Very High" },
    { label: "Python",      pct: 55, color: "#8B5CF6", demand: "High" },
    { label: "Docker",      pct: 60, color: "#EC4899", demand: "Medium" },
  ];

  const atsCategories = [
    { label: "Contact Info",      score: 100, color: "#10B981", note: "Complete" },
    { label: "Work Experience",   score: 90,  color: "#10B981", note: "Strong" },
    { label: "Education",         score: 95,  color: "#10B981", note: "Complete" },
    { label: "Skills Section",    score: 72,  color: "#F59E0B", note: "Missing keywords" },
    { label: "Summary / Objective", score: 58, color: "#F59E0B", note: "Too generic" },
    { label: "Action Verbs",      score: 40,  color: "#DC2626", note: "Needs improvement" },
    { label: "Quantified Results",score: 35,  color: "#DC2626", note: "Add metrics" },
  ];

  const keywords = [
    { word: "REST API",       found: true  },
    { word: "CI/CD",          found: true  },
    { word: "Agile",          found: true  },
    { word: "GraphQL",        found: false },
    { word: "Microservices",  found: false },
    { word: "AWS / Cloud",    found: false },
    { word: "System Design",  found: true  },
    { word: "Testing / Jest", found: false },
  ];

  const insights = [
    { icon: "⚡", color: "#DC2626", title: "Weak Summary",      body: "Your summary reads as a list of tools. Rewrite it as a 2-sentence value statement focused on outcomes." },
    { icon: "📊", color: "#F59E0B", title: "No Metrics",        body: "Only 1 of 6 bullet points contains a quantified result. Add numbers — percentages, team size, time saved." },
    { icon: "🔑", color: "#F59E0B", title: "Missing Keywords",  body: "3 high-demand keywords not detected: GraphQL, AWS, Microservices. Add them to match ATS filters." },
    { icon: "✅", color: "#10B981", title: "Strong Experience",  body: "Your work history is well-structured with clear progression. Bullet verbs are mostly active." },
  ];

  const quickJobs = [
    { title: "Frontend Engineer", co: "Stripe", match: 93, color: "#2563EB" },
    { title: "Full-Stack Dev",    co: "Notion", match: 88, color: "#10B981" },
    { title: "UI Engineer",       co: "Figma",  match: 82, color: "#F59E0B" },
  ];

  const atsOverall = 74;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>CV ANALYSIS</span>
          <h2 className="font-display text-white mt-1" style={{ fontSize: "2rem" }}>Resume Insights</h2>
          <p className="font-body text-sm mt-1" style={{ color: "var(--sb-text-muted)" }}>Last analysed: <span style={{ color: "var(--sb-text-muted)" }}>29 Aug 2026 · Jamie_Rivera_CV.pdf</span></p>
        </div>
        <ConfettiBtn className="font-mono text-xs font-bold text-white px-4 py-2.5 rounded-xl uppercase tracking-widest" color="#2563EB">
          Upload New CV →
        </ConfettiBtn>
      </div>

      {/* ── Row 1: ATS Score + Category Breakdown ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "220px 1fr" }}>

        {/* ATS Score dial */}
        <div
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3"
          style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
        >
          <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>ATS SCORE</span>
          {/* Arc gauge */}
          <svg width="160" height="100" viewBox="0 0 160 100">
            <defs>
              <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            {/* Track */}
            <path d="M 16 88 A 68 68 0 0 1 144 88" fill="none" stroke="#1e2330" strokeWidth="13" strokeLinecap="butt" />
            {/* Fill — atsOverall/100 of the arc (circumference of half-circle ≈ 213.6) */}
            <path
              d="M 16 88 A 68 68 0 0 1 144 88"
              fill="none"
              stroke="url(#atsGrad)"
              strokeWidth="13"
              strokeLinecap="butt"
              strokeDasharray={`${(atsOverall / 100) * 213.6} 213.6`}
            />
            <text x="80" y="76" textAnchor="middle" fill="white" fontSize="26" fontFamily="Caveat" fontWeight="700">{atsOverall}%</text>
            <text x="80" y="90" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Space Mono">ATS COMPATIBLE</text>
          </svg>
          <div className="flex gap-3">
            {[["#DC2626","Weak"],["#F59E0B","Fair"],["#10B981","Good"]].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                <span className="font-mono" style={{ fontSize: "0.55rem", color: "var(--sb-text-muted)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section-by-section ATS breakdown */}
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
          <span className="tag-pill self-start" style={{ background: "#2563EB22", color: "#2563EB" }}>SECTION BREAKDOWN</span>
          <div className="flex flex-col gap-2.5">
            {atsCategories.map(cat => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/40 shrink-0" style={{ width: 160 }}>{cat.label}</span>
                <div className="flex-1 h-2.5 rounded-full" style={{ background: "var(--sb-card2)" }}>
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{ width: `${cat.score}%`, background: cat.color }}
                  />
                </div>
                <span className="font-mono text-xs font-bold shrink-0 w-8 text-right" style={{ color: cat.color }}>{cat.score}</span>
                <span className="tag-pill shrink-0" style={{ background: `${cat.color}18`, color: cat.color, fontSize: 9, minWidth: 100 }}>{cat.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Skill Chart + Keywords + Insights ── */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* Skill demand chart */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
          <span className="tag-pill self-start" style={{ background: "#F59E0B22", color: "#F59E0B" }}>SKILL BREAKDOWN</span>
          {skills.map(s => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-body text-xs text-white/60 font-semibold">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="tag-pill" style={{ background: "#ffffff08", color: "var(--sb-text-muted)", fontSize: 8 }}>{s.demand}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
              </div>
              <div className="h-2 rounded-full" style={{ background: "var(--sb-card2)" }}>
                <div className="h-2 rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Keyword detection */}
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
          <div className="flex items-center justify-between">
            <span className="tag-pill" style={{ background: "#8B5CF622", color: "#8B5CF6" }}>KEYWORD SCAN</span>
            <span className="font-mono text-xs text-white/30">{keywords.filter(k => k.found).length}/{keywords.length} found</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {keywords.map(kw => (
              <div
                key={kw.word}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: kw.found ? "#10B98110" : "#DC262610",
                  border: `1px solid ${kw.found ? "#10B98133" : "#DC262633"}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: kw.found ? "#10B981" : "#DC2626" }}
                >
                  {kw.found
                    ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                    : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  }
                </div>
                <span className="font-body text-xs leading-tight" style={{ color: kw.found ? "#d1fae5" : "#fca5a5" }}>{kw.word}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mt-auto" style={{ background: "#8B5CF610", border: "1px solid #8B5CF633" }}>
            <p className="font-body text-xs leading-snug" style={{ color: "#c4b5fd" }}>
              Add <strong>GraphQL</strong>, <strong>AWS</strong>, and <strong>Microservices</strong> to your skills section to pass more ATS filters.
            </p>
          </div>
        </div>

        {/* Resume insights */}
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
          <span className="tag-pill self-start" style={{ background: "#DC262622", color: "#DC2626" }}>RESUME INSIGHTS</span>
          {insights.map((ins, i) => (
            <div
              key={i}
              className="rounded-xl p-3 flex gap-3"
              style={{ background: `${ins.color}0c`, border: `1px solid ${ins.color}30` }}
            >
              <span className="text-base shrink-0 mt-0.5">{ins.icon}</span>
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: ins.color }}>{ins.title}</div>
                <p className="font-body text-xs mt-1 leading-snug" style={{ color: "var(--sb-text-muted)" }}>{ins.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Job Suggestions (compact) ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--sb-card)", border: "1.5px solid #2563EB33" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>QUICK JOB SUGGESTIONS</span>
            <span className="font-body text-xs" style={{ color: "var(--sb-text-muted)" }}>Based on your CV score</span>
          </div>
          <button
            onClick={() => onNavigate?.("Job Matches")}
            className="font-mono text-xs font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#2563EB", padding: 0 }}
          >
            View all matches →
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {quickJobs.map(j => (
            <div
              key={j.title}
              className="panel-hover rounded-xl p-4 flex items-center gap-3"
              style={{ background: "var(--sb-card2)", border: `1.5px solid ${j.color}33` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display text-base text-white"
                style={{ background: `${j.color}22`, border: `1.5px solid ${j.color}44` }}
              >
                {j.co.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-white leading-snug" style={{ fontSize: "0.95rem" }}>{j.title}</div>
                <div className="font-mono text-xs text-white/30 mt-0.5">{j.co}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-lg" style={{ color: j.color }}>{j.match}%</div>
                <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--sb-text-muted)" }}>MATCH</div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onNavigate?.("Job Matches")}
          className="w-full mt-4 py-2.5 rounded-xl font-mono text-xs font-bold text-white uppercase tracking-widest transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(90deg,#2563EB,#10B981)", border: "none", cursor: "pointer" }}
        >
          See Full Job Matches Page →
        </button>
      </div>

    </div>
  );
}

/* ─── Page: Squad Projects ─── */
function PageSquadProjects() {
  const t = useT();
  const squads = [
    {
      name: "DevBridge Alpha", color: "#2563EB", members: 6, role: "Lead Dev",
      project: "CampusConnect API", deadline: "Sep 15, 2026",
      tasks: [
        { t: "Review pull request #42 — auth module", done: false, priority: "High" },
        { t: "Write API documentation for endpoints", done: true, priority: "Normal" },
        { t: "Set up CI/CD pipeline on GitHub Actions", done: false, priority: "Normal" },
        { t: "Deploy staging environment to AWS", done: false, priority: "High" },
      ],
    },
    {
      name: "UX Collective", color: "#F59E0B", members: 4, role: "Designer",
      project: "CampusLink App — Redesign", deadline: "Aug 31, 2026",
      tasks: [
        { t: "Submit wireframes for CampusLink app", done: false, priority: "Urgent" },
        { t: "Create component library in Figma", done: true, priority: "High" },
        { t: "User testing session with 5 participants", done: false, priority: "Normal" },
      ],
    },
    {
      name: "DataForge Team", color: "#10B981", members: 5, role: "ML Analyst",
      project: "Predictive Skill Recommender", deadline: "Oct 1, 2026",
      tasks: [
        { t: "Present ML model demo to the squad", done: false, priority: "Normal" },
        { t: "Clean and label dataset — 10K rows", done: true, priority: "High" },
        { t: "Integrate model API with frontend", done: false, priority: "Normal" },
      ],
    },
  ];
  const priorityColor: Record<string, string> = { Urgent: "#DC2626", High: "#F59E0B", Normal: "#2563EB" };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="tag-pill" style={{ background: "#F59E0B22", color: "#F59E0B" }}>SQUAD PROJECTS</span>
          <h2 className="font-display mt-1" style={{ fontSize: "2rem", color: t.text }}>Active Squads</h2>
        </div>
        <ConfettiBtn className="font-mono text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-widest" style={{ color: t.L ? "#0f1117" : "#ffffff" }} color="#10B981">
          + Find a Squad
        </ConfettiBtn>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {squads.map(s => (
          <div key={s.name} className="rounded-2xl flex flex-col overflow-hidden" style={{ background: "var(--sb-card)", border: `1.5px solid ${s.color}44` }}>
            {/* Squad header */}
            <div className="px-5 py-4" style={{ background: t.L ? `${s.color}10` : `${s.color}12`, borderBottom: `1px solid ${s.color}33` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display" style={{ fontSize: "1.15rem", color: t.text }}>{s.name}</span>
                <span className="tag-pill font-bold" style={{ background: t.L ? `${s.color}18` : `${s.color}22`, color: t.L ? "#1A1D24" : s.color, border: t.L ? `1px solid ${s.color}55` : "none" }}>{s.role}</span>
              </div>
              <div className="font-body text-xs" style={{ color: t.muted }}>{s.project}</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex -space-x-1.5">
                  {Array.from({ length: Math.min(s.members, 5) }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold" style={{ borderColor: t.L ? "#D4C4A8" : "#13161e", background: [s.color,"#10B981","#F59E0B","#DC2626","#8B5CF6"][i], color: t.L ? "#1A1D24" : "#ffffff" }}>
                      {["J","P","M","A","K"][i]}
                    </div>
                  ))}
                </div>
                <span className="font-mono text-xs" style={{ color: t.muted }}>{s.members} members · Due {s.deadline}</span>
              </div>
            </div>
            {/* Tasks */}
            <div className="flex flex-col gap-2 p-4 flex-1">
              {s.tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: task.done ? (t.L ? "#00000008" : "#ffffff05") : (t.L ? t.inset : "#0f1117"), opacity: task.done ? 0.6 : 1 }}>
                  <div className="w-4 h-4 rounded-md shrink-0 mt-0.5 flex items-center justify-center" style={{ background: task.done ? s.color : "transparent", border: `1.5px solid ${task.done ? s.color : (t.L ? t.border : "#2a2f3a")}` }}>
                    {task.done && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                  </div>
                  <span className="font-body text-xs flex-1 leading-snug" style={{ color: t.muted, textDecoration: task.done ? "line-through" : "none" }}>{task.t}</span>
                  <span className="tag-pill shrink-0 font-bold" style={{ background: t.L ? `${priorityColor[task.priority]}18` : `${priorityColor[task.priority]}22`, color: t.L ? "#1A1D24" : priorityColor[task.priority], border: t.L ? `1px solid ${priorityColor[task.priority]}55` : "none", fontSize: 8 }}>{task.priority}</span>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <ConfettiBtn className="font-mono text-xs font-bold w-full py-2 rounded-xl uppercase tracking-widest" style={{ color: t.L ? "#0f1117" : "#ffffff" }} color={s.color}>
                Open Board →
              </ConfettiBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page: Leaderboard ─── */
function PageLeaderboard() {
  const t = useT();
  const [period, setPeriod] = useState("This Week");
  const all = [
    { rank: 1, name: "Priya S.", country: "🇮🇳", pts: "9,842", badges: 14, paths: 5, you: false },
    { rank: 2, name: "Marcus L.", country: "🇧🇷", pts: "9,210", badges: 12, paths: 4, you: false },
    { rank: 3, name: "Jamie R.", country: "🇺🇸", pts: "8,994", badges: 12, paths: 4, you: true },
    { rank: 4, name: "Amina K.", country: "🇳🇬", pts: "8,340", badges: 10, paths: 3, you: false },
    { rank: 5, name: "Jonas R.", country: "🇩🇪", pts: "7,900", badges: 9, paths: 3, you: false },
    { rank: 6, name: "Sofia M.", country: "🇪🇸", pts: "7,450", badges: 9, paths: 3, you: false },
    { rank: 7, name: "Chen W.", country: "🇨🇳", pts: "7,120", badges: 8, paths: 3, you: false },
    { rank: 8, name: "Fatima A.", country: "🇸🇦", pts: "6,880", badges: 8, paths: 2, you: false },
  ];
  const rankColors: Record<number, string> = { 1: "#F59E0B", 2: "#9ca3af", 3: "#cd7f32" };
  const podium = all.slice(0, 3);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="tag-pill" style={{ background: "#F59E0B22", color: "#F59E0B" }}>LEADERBOARD</span>
          <h2 className="font-display mt-1" style={{ fontSize: "2rem", color: t.text }}>Global Rankings</h2>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--sb-inset)" }}>
          {["This Week","This Month","All Time"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all"
              style={{ background: period === p ? "#F59E0B" : "transparent", color: period === p ? "#1A1D24" : "var(--sb-text-muted)" }}>
              {p}
            </button>
          ))}
        </div>
      </div>
      {/* Podium */}
      <div className="rounded-2xl p-6 flex items-end justify-center gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)", minHeight: 180 }}>
        {[podium[1], podium[0], podium[2]].map((l, i) => {
          const heights = [120, 160, 100];
          const c = rankColors[l.rank];
          return (
            <div key={l.name} className="flex flex-col items-center gap-2">
              <div className="font-display text-sm" style={{ color: t.muted }}>{l.name} {l.country}</div>
              <div className="font-display text-lg font-bold" style={{ color: c }}>{l.pts} pts</div>
              <div className="w-20 rounded-t-xl flex items-center justify-center" style={{ height: heights[i], background: `${c}22`, border: `2px solid ${c}44` }}>
                <span className="font-display text-3xl" style={{ color: c }}>#{l.rank}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Full table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
        <div className="grid px-5 py-3 font-mono text-xs uppercase tracking-widest" style={{ gridTemplateColumns: "40px 1fr 80px 80px 80px", borderBottom: "1px solid var(--sb-border)", color: t.muted }}>
          <span>#</span><span>Learner</span><span className="text-right">XP</span><span className="text-right">Badges</span><span className="text-right">Paths</span>
        </div>
        {all.map(l => {
          const c = rankColors[l.rank] ?? (l.you ? "#2563EB" : t.muted);
          return (
            <div key={l.rank} className="grid items-center px-5 py-3.5 transition-all" style={{ gridTemplateColumns: "40px 1fr 80px 80px 80px", background: l.you ? "#2563EB0d" : "transparent", borderBottom: `1px solid ${t.border}` }}>
              <span className="font-display text-lg" style={{ color: c }}>{l.rank}</span>
              <span className="font-body text-sm" style={{ color: t.text }}>
                {l.name} {l.country} {l.you && <span className="tag-pill ml-1" style={{ background: "#2563EB33", color: "#2563EB", fontSize: 9 }}>YOU</span>}
              </span>
              <span className="font-mono text-sm text-right font-bold" style={{ color: c }}>{l.pts}</span>
              <span className="font-mono text-sm text-right" style={{ color: t.muted }}>{l.badges}</span>
              <span className="font-mono text-sm text-right" style={{ color: t.muted }}>{l.paths}</span>
            </div>
          );
        })}
      </div>
      <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "#2563EB0d", border: "1px solid #2563EB33" }}>
        <span className="font-body text-sm" style={{ color: t.muted }}>You are <span className="font-semibold" style={{ color: t.text }}>216 XP</span> away from rank #2</span>
        <ConfettiBtn className="font-mono text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-widest" style={{ color: t.L ? "#0f1117" : "#ffffff" }} color="#2563EB">Keep Earning →</ConfettiBtn>
      </div>
    </div>
  );
}

/* ─── Page: Portfolio ─── */
function PagePortfolio() {
  const projects = [
    { name: "E-Commerce REST API", desc: "A production-grade API built with Node.js, Express, and MongoDB. Includes auth, payments, and admin dashboard.", tags: ["Node.js","MongoDB","JWT","Stripe"], color: "#10B981", views: "2.4K", stars: 38, date: "Aug 2026" },
    { name: "ML Sentiment Analyzer", desc: "Fine-tuned BERT model for real-time sentiment analysis on product reviews. Deployed via FastAPI.", tags: ["Python","BERT","FastAPI","Docker"], color: "#2563EB", views: "1.8K", stars: 27, date: "Jul 2026" },
    { name: "Analytics Dashboard UI", desc: "High-fidelity React dashboard with D3 charts, real-time websocket data, and dark theme.", tags: ["React","D3.js","WebSockets","TypeScript"], color: "#F59E0B", views: "3.1K", stars: 54, date: "Jun 2026" },
    { name: "CampusConnect Mobile App", desc: "Cross-platform React Native app for university students. Push notifications, event feed, and maps.", tags: ["React Native","Expo","Firebase"], color: "#DC2626", views: "900", stars: 15, date: "May 2026" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>PORTFOLIO</span>
          <h2 className="font-display text-white mt-1" style={{ fontSize: "2rem" }}>Your Projects</h2>
        </div>
        <ConfettiBtn className="font-mono text-xs font-bold text-white px-4 py-2.5 rounded-xl uppercase tracking-widest" color="#10B981">
          + Add Project
        </ConfettiBtn>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[{v:"4",l:"Projects",c:"#10B981"},{v:"8.2K",l:"Total Views",c:"#2563EB"},{v:"134",l:"Stars",c:"#F59E0B"},{v:"3",l:"Squads Used",c:"#DC2626"}].map(s=>(
          <div key={s.l} className="rounded-2xl p-4" style={{ background: "var(--sb-card)", border: `1.5px solid ${s.c}33` }}>
            <div className="font-display text-3xl" style={{ color: s.c }}>{s.v}</div>
            <div className="font-mono text-xs text-white/30 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map(p => (
          <div key={p.name} className="panel-hover rounded-2xl overflow-hidden flex flex-col" style={{ background: "var(--sb-card)", border: `1.5px solid ${p.color}33` }}>
            {/* Preview banner */}
            <div className="h-28 flex items-center justify-center relative" style={{ background: `${p.color}12` }}>
              <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                <rect x="4" y="6" width="72" height="48" rx="6" fill="#1e2330" stroke={p.color} strokeWidth="1.5"/>
                <rect x="10" y="14" width="30" height="5" rx="2.5" fill={p.color} opacity="0.8"/>
                <rect x="10" y="23" width="50" height="3" rx="1.5" fill="white" opacity="0.12"/>
                <rect x="10" y="30" width="42" height="3" rx="1.5" fill="white" opacity="0.1"/>
                <rect x="10" y="37" width="48" height="3" rx="1.5" fill="white" opacity="0.08"/>
                <circle cx="62" cy="22" r="10" fill={p.color} opacity="0.2"/>
                <circle cx="62" cy="22" r="6" fill={p.color} opacity="0.5"/>
              </svg>
              <span className="absolute top-3 right-3 tag-pill" style={{ background: `${p.color}33`, color: p.color }}>{p.date}</span>
            </div>
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div>
                <h3 className="font-display text-white" style={{ fontSize: "1.2rem" }}>{p.name}</h3>
                <p className="font-body text-xs text-white/40 mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {p.tags.map(t => <span key={t} className="tag-pill" style={{ background: `${p.color}18`, color: p.color, fontSize: 9 }}>{t}</span>)}
              </div>
              <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid #1e2330" }}>
                <div className="flex gap-4">
                  <span className="font-mono text-xs text-white/30">👁 {p.views}</span>
                  <span className="font-mono text-xs text-white/30">⭐ {p.stars}</span>
                </div>
                <div className="flex gap-2">
                  <button className="font-mono text-xs px-3 py-1.5 rounded-lg text-white/40 hover:text-white transition-colors" style={{ background: "var(--sb-inset)" }}>Edit</button>
                  <ConfettiBtn className="font-mono text-xs font-bold text-white px-3 py-1.5 rounded-lg uppercase tracking-widest" color={p.color}>View →</ConfettiBtn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page: Settings ─── */
function PageSettings({ onAdmin }: { onAdmin?: () => void } = {}) {
  const [name, setName] = useState("Jamie Rivera");
  const [email, setEmail] = useState("jamie@example.com");
  const [bio, setBio] = useState("Full-stack learner & ML enthusiast. Building in public.");
  const [notifs, setNotifs] = useState({ squad: true, badges: true, jobs: false, digest: true });
  const { theme, setTheme } = useContext(ThemeCtx);
  const isLight = theme === "Light";
  const fieldStyle = {
    background: isLight ? "#EDE8DF" : "#1e2330",
    border: `1.5px solid ${isLight ? "#C8BEB0" : "#2a2f3a"}`,
  } as React.CSSProperties;
  const focusGreen = (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = "#10B981"; };
  const blurReset  = (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = isLight ? "#C8BEB0" : "#2a2f3a"; };

  const cardBg     = isLight ? "#FFFFFF"  : "#13161e";
  const cardBorder = isLight ? "#D6CBBB"  : "#1e2330";
  const dividerCol = isLight ? "#E0D8CE"  : "#1e2330";
  const textMain   = isLight ? "#1A1D24"  : "white";
  const textMuted  = isLight ? "#6B6560"  : "rgba(255,255,255,0.4)";
  const btnSecBg   = isLight ? "#EDE8DF"  : "#1e2330";
  const btnSecBor  = isLight ? "#C8BEB0"  : "#2a2f3a";
  const btnSecText = isLight ? "#4B4540"  : "white";

  const themeOptions: { value: ThemeMode; icon: string; desc: string }[] = [
    { value: "Dark",   icon: "◑", desc: "Default dark palette" },
    { value: "Light",  icon: "○", desc: "Cream & white surfaces" },
    { value: "System", icon: "◐", desc: "Follows dark theme" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <span className="tag-pill" style={{ background: "#6b728022", color: isLight ? "#4B4540" : "#9ca3af" }}>SETTINGS</span>
        <h2 className="font-display mt-1" style={{ fontSize: "2rem", color: textMain }}>Account Settings</h2>
      </div>

      {/* Profile */}
      <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
        <div className="font-display text-lg border-b pb-3" style={{ color: textMain, borderColor: dividerCol }}>Profile</div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-3xl text-white" style={{ background: "linear-gradient(135deg, #10B981, #2563EB)" }}>J</div>
          <div>
            <button className="font-mono text-xs px-4 py-2 rounded-xl uppercase tracking-widest" style={{ background: btnSecBg, border: `1px solid ${btnSecBor}`, color: btnSecText }}>Change Photo</button>
            <div className="font-mono text-xs mt-1" style={{ color: textMuted }}>JPG, PNG · max 2 MB</div>
          </div>
        </div>
        {[{ label: "Full Name", val: name, set: setName, type: "text" }, { label: "Email", val: email, set: setEmail, type: "email" }].map(f => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="font-mono text-xs uppercase tracking-widest" style={{ color: textMuted }}>{f.label}</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={fieldStyle} onFocus={focusGreen} onBlur={blurReset}>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                className="flex-1 bg-transparent font-mono text-sm outline-none" style={{ color: textMain }} />
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-xs uppercase tracking-widest" style={{ color: textMuted }}>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none transition-all"
            style={{ ...fieldStyle, color: textMain }} onFocus={focusGreen} onBlur={blurReset} />
        </div>
        <ConfettiBtn className="font-mono text-xs font-bold text-white px-6 py-2.5 rounded-xl uppercase tracking-widest self-start" color="#10B981">
          Save Changes
        </ConfettiBtn>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
        <div className="font-display text-lg border-b pb-3" style={{ color: textMain, borderColor: dividerCol }}>Notifications</div>
        {([["squad","Squad task reminders","#2563EB"],["badges","New badge unlocked","#10B981"],["jobs","New job matches","#F59E0B"],["digest","Weekly digest email","#DC2626"]] as [keyof typeof notifs, string, string][]).map(([k, label, c]) => (
          <div key={k} className="flex items-center justify-between">
            <div className="font-body text-sm" style={{ color: textMain }}>{label}</div>
            <button onClick={() => setNotifs(n => ({ ...n, [k]: !n[k] }))}
              className="w-11 h-6 rounded-full transition-all relative"
              style={{ background: notifs[k] ? c : (isLight ? "#D6CBBB" : "#1e2330"), border: `1.5px solid ${notifs[k] ? c : (isLight ? "#C8BEB0" : "#2a2f3a")}` }}>
              <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{ left: notifs[k] ? "calc(100% - 1.25rem)" : "2px", background: isLight && !notifs[k] ? "#8a8075" : "white" }} />
            </button>
          </div>
        ))}
      </div>

      {/* Appearance */}
      <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
        <div className="font-display text-lg border-b pb-3" style={{ color: textMain, borderColor: dividerCol }}>Appearance</div>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(opt => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all"
                style={{
                  background: active ? (isLight ? "#2563EB12" : "#10B98118") : (isLight ? "#F0EAE0" : "#0f1117"),
                  border: `2px solid ${active ? (opt.value === "Light" ? "#2563EB" : "#10B981") : (isLight ? "#D6CBBB" : "#2a2f3a")}`,
                  cursor: "pointer",
                }}
              >
                {/* Mini preview swatch */}
                <div className="w-full rounded-xl overflow-hidden" style={{ height: 56, background: opt.value === "Light" ? "#F5EFE6" : "#0f1117", border: `1.5px solid ${opt.value === "Light" ? "#D6CBBB" : "#1e2330"}` }}>
                  <div className="w-full h-full flex gap-1 p-2">
                    <div className="rounded-lg shrink-0" style={{ width: 14, background: opt.value === "Light" ? "#FFFFFF" : "#13161e", border: `1px solid ${opt.value === "Light" ? "#D6CBBB" : "#1e2330"}` }} />
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="h-2 rounded-sm" style={{ background: opt.value === "Light" ? "#FFFFFF" : "#13161e", border: `1px solid ${opt.value === "Light" ? "#D6CBBB" : "#1e2330"}` }} />
                      <div className="h-2 rounded-sm" style={{ background: opt.value === "Light" ? "#EDE8DF" : "#1e2330" }} />
                      <div className="h-2 rounded-sm" style={{ background: opt.value === "Light" ? "#EDE8DF" : "#1e2330", width: "70%" }} />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: active ? (opt.value === "Light" ? "#2563EB" : "#10B981") : textMuted }}>
                    {opt.icon} {opt.value}
                  </div>
                  <div className="font-body mt-0.5" style={{ fontSize: "0.6rem", color: textMuted }}>{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Live preview banner */}
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: isLight ? "#2563EB0f" : "#10B98112", border: `1px solid ${isLight ? "#2563EB33" : "#10B98133"}` }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: isLight ? "#2563EB" : "#10B981" }} />
          <span className="font-mono text-xs" style={{ color: isLight ? "#2563EB" : "#10B981" }}>
            {theme === "Light" ? "Light theme active — cream & white surfaces" : theme === "Dark" ? "Dark theme active — default charcoal palette" : "System theme active — using dark palette"}
          </span>
        </div>
      </div>

      {/* Admin Portal access */}
      {onAdmin && (
        <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: cardBg, border: "1.5px solid #DC262622" }}>
          <div className="font-display text-lg border-b pb-3" style={{ color: textMain, borderColor: dividerCol }}>Platform Administration</div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-body text-sm font-semibold" style={{ color: textMain }}>Admin Portal</div>
              <div className="font-mono text-xs mt-0.5" style={{ color: "#DC2626", opacity: 0.7 }}>Restricted · Administrator access only</div>
            </div>
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest shrink-0"
              style={{ background: "#DC262618", border: "1.5px solid #DC262644", color: "#DC2626", cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.1em" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#DC262228"; e.currentTarget.style.borderColor = "#DC2626"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#DC262618"; e.currentTarget.style.borderColor = "#DC262644"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Enter Admin →
            </button>
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: cardBg, border: "1.5px solid #DC262633" }}>
        <div className="font-display text-lg border-b pb-3" style={{ color: textMain, borderColor: dividerCol }}>Danger Zone</div>
        <button className="font-mono text-xs px-4 py-2.5 rounded-xl text-left uppercase tracking-widest transition-all hover:brightness-110" style={{ background: "#DC262618", border: "1px solid #DC262644", color: "#DC2626" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─── Dashboard shell shared by all pages ─── */
/* ─── Page: Job Application ─── */
function PageJobApplication({ onBack }: { onBack?: () => void }) {
  const t = useT();
  const [autoFilled, setAutoFilled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvAttached, setCvAttached] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set(["SkillBridge Analytics Dashboard"]));
  const [coverNote, setCoverNote] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin]   = useState("");

  const job = {
    title: "Junior Frontend Developer",
    co: "TechCorp Solutions",
    coInitials: "TC",
    loc: "Remote",
    type: "Full-Time",
    salary: "$90K – $110K",
    match: 95,
    color: "#2563EB",
    posted: "1d ago",
    desc: "Building responsive user interfaces using modern web technologies and the React framework. Join a team of 12 engineers shipping features used by 2M+ users.",
    requirements: ["2+ years React experience", "TypeScript proficiency", "REST API integration", "Git & CI/CD familiarity"],
    perks: ["Fully remote", "Health + dental", "$3K learning budget", "Equity options"],
  };

  const profileProjects = [
    { name: "SkillBridge Analytics Dashboard", stack: "React · D3.js · Node.js", relevant: true },
    { name: "ML Price Predictor",              stack: "Python · FastAPI · scikit-learn", relevant: false },
    { name: "DevCollab CLI Tool",              stack: "TypeScript · Node.js · GitHub API", relevant: true },
  ];

  function handleAutoFill() {
    setFirstName("Jamie");
    setLastName("Rivera");
    setEmail("jamie.rivera@email.com");
    setPhone("+1 415 555 0192");
    setPortfolio("https://jamierivera.dev");
    setLinkedin("linkedin.com/in/jamierivera");
    setCoverNote("I'm a full-stack learner with strong React and TypeScript skills, currently ranked in the top 8% on SkillBridge. I've shipped production-grade projects including a real-time analytics dashboard and a collaborative CLI tool. I'm excited by TechCorp's mission and confident I can contribute from day one.");
    setCvAttached(true);
    setAutoFilled(true);
  }

  const inp = {
    background: "var(--sb-card2)",
    border: "1.5px solid var(--sb-border2)",
    borderRadius: "0.75rem",
    color: "var(--sb-text)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  const lbl = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--sb-text-muted)",
    marginBottom: "0.35rem",
    display: "block",
  };

  function fg(e: React.FocusEvent<HTMLElement>) { (e.currentTarget as HTMLElement).style.borderColor = "#10B981"; }
  function br(e: React.FocusEvent<HTMLElement>) { (e.currentTarget as HTMLElement).style.borderColor = "#2a2f3a"; }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#10B981,#2563EB)", boxShadow: "0 0 48px #10B98155" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <div>
          <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>APPLICATION SENT</span>
          <h2 className="font-display text-white mt-2" style={{ fontSize: "2.2rem" }}>You've Applied!</h2>
          <p className="font-body mt-2" style={{ color: "var(--sb-text-muted)" }}>
            Your application for <strong style={{ color: "var(--sb-text)" }}>Junior Frontend Developer</strong> at{" "}
            <strong style={{ color: "#2563EB" }}>TechCorp Solutions</strong> has been submitted.
          </p>
          <p className="font-mono text-xs mt-3" style={{ color: "#4b5563" }}>You'll receive a confirmation email at jamie.rivera@email.com</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="font-mono text-xs font-bold px-6 py-3 rounded-2xl uppercase tracking-widest transition-all hover:-translate-y-0.5"
            style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)", color: "var(--sb-text-muted)", cursor: "pointer" }}
          >
            ← Back to Job Matches
          </button>
          <ConfettiBtn className="font-mono text-xs font-bold text-white px-6 py-3 rounded-2xl uppercase tracking-widest" color="#10B981">
            View My Applications
          </ConfettiBtn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header breadcrumb ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="font-mono text-xs text-white/30 hover:text-white/70 transition-colors uppercase tracking-widest"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          ← Job Matches
        </button>
        <span className="font-mono text-xs text-white/20">/</span>
        <span className="font-mono text-xs text-white/50 uppercase tracking-widest">Apply</span>
      </div>

      {/* ── Job Details Summary ── */}
      <div
        className="rounded-3xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#13161e 0%,#1a2035 60%,#0f1117 100%)", border: `1.5px solid ${job.color}44` }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(${job.color}08 1px,transparent 1px),linear-gradient(90deg,${job.color}08 1px,transparent 1px)`,
          backgroundSize: "32px 32px",
        }}/>
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${job.color}18 0%,transparent 70%)` }}/>

        <div className="relative p-7 flex flex-col md:flex-row gap-6">
          {/* Company logo area */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-2xl text-white shrink-0"
              style={{ background: `${job.color}22`, border: `2px solid ${job.color}55` }}
            >
              {job.coInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="font-display" style={{ fontSize: "1.7rem", lineHeight: 1.1, color: "#ffffff" }}>{job.title}</h1>
                <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981", border: "1px solid #10B98144" }}>
                  {job.match}% Match
                </span>
              </div>
              <p className="font-body text-sm mb-3" style={{ color: "var(--sb-text-muted)" }}>{job.co}</p>
              {/* Meta chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "📍", val: job.loc },
                  { icon: "💼", val: job.type },
                  { icon: "💰", val: job.salary },
                  { icon: "🕐", val: `Posted ${job.posted}` },
                ].map(m => (
                  <span key={m.val} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-body text-xs" style={{ background: "#ffffff0a", border: "1px solid var(--sb-border2)", color: "var(--sb-text-muted)" }}>
                    {m.icon} {m.val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Match gauge + perks */}
          <div className="md:ml-auto flex flex-col gap-3 shrink-0 md:items-end">
            {/* Circular match badge */}
            <div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
              style={{ background: `conic-gradient(${job.color} ${job.match * 3.6}deg,#1e2330 0deg)`, padding: 3 }}
            >
              <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: "var(--sb-card)" }}>
                <span className="font-display text-xl leading-none" style={{ color: job.color }}>{job.match}%</span>
                <span className="font-mono" style={{ fontSize: "0.5rem", color: "var(--sb-text-muted)" }}>MATCH</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {job.perks.map(p => (
                <div key={p} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981" }}/>
                  <span className="font-body text-xs" style={{ color: "var(--sb-text-muted)" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements strip */}
        <div className="px-7 pb-6 flex flex-wrap gap-2">
          {job.requirements.map(r => (
            <span key={r} className="flex items-center gap-1.5 tag-pill" style={{ background: `${job.color}12`, color: job.color, border: `1px solid ${job.color}33` }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* ── Auto-Fill & CV Attach ── */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>SKILLBRIDGE PROFILE</span>
            <h3 className="font-display text-white mt-1" style={{ fontSize: "1.1rem" }}>Auto-Fill from Your Profile</h3>
          </div>
          <button
            onClick={handleAutoFill}
            className="font-mono text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5 flex items-center gap-2"
            style={{
              background: autoFilled ? "#10B98122" : "linear-gradient(135deg,#10B981,#2563EB)",
              border: autoFilled ? "1.5px solid #10B98155" : "none",
              color: autoFilled ? "#10B981" : "white",
              cursor: "pointer",
            }}
          >
            {autoFilled ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> Auto-Filled</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg> Auto-Fill from Profile</>
            )}
          </button>
        </div>

        {/* CV attach */}
        <div className="grid gap-3 md:grid-cols-2">
          <div
            className="rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all"
            style={{
              background: cvAttached ? "#10B98110" : "#0f1117",
              border: `1.5px solid ${cvAttached ? "#10B98155" : "#2a2f3a"}`,
            }}
            onClick={() => setCvAttached(!cvAttached)}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: cvAttached ? "#10B98122" : "#1e2330", border: `1px solid ${cvAttached ? "#10B98144" : "#2a2f3a"}` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cvAttached ? "#10B981" : "#6b7280"} strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-sm font-semibold" style={{ color: cvAttached ? "var(--sb-text)" : "var(--sb-text-muted)" }}>
                {cvAttached ? "Jamie_Rivera_CV.pdf" : "Attach CV"}
              </div>
              <div className="font-mono" style={{ fontSize: "0.6rem", color: cvAttached ? "#10B981" : "#4b5563" }}>
                {cvAttached ? "✓ ATS Score: 74% · Analysed 29 Aug 2026" : "Click to attach your SkillBridge CV"}
              </div>
            </div>
            {cvAttached && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            )}
          </div>

          {/* Profile preview card */}
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "var(--sb-card2)", border: "1.5px solid var(--sb-border2)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg text-white shrink-0" style={{ background: "linear-gradient(135deg,#10B981,#2563EB)" }}>J</div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-sm text-white font-semibold">Jamie Rivera</div>
              <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--sb-text-muted)" }}>Level 12 · Top 8% · 4,820 XP</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>Pro Member</span>
              <span className="font-mono" style={{ fontSize: "0.55rem", color: "#10B981" }}>12 Badges Earned</span>
            </div>
          </div>
        </div>

        {autoFilled && (
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: "#10B98110", border: "1px solid #10B98133" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }}/>
            <span className="font-body text-xs" style={{ color: "#10B981" }}>Profile data applied — review and edit below before submitting</span>
          </div>
        )}
      </div>

      {/* ── Application Form ── */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Main form */}
        <div className="md:col-span-2 flex flex-col gap-5">

          {/* Personal info */}
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#2563EB22", color: "#2563EB" }}>PERSONAL INFO</span>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label style={lbl}>First Name *</label>
                <input type="text" placeholder="Jamie" value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
              <div>
                <label style={lbl}>Last Name *</label>
                <input type="text" placeholder="Rivera" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label style={lbl}>Email Address *</label>
                <input type="email" placeholder="jamie@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
              <div>
                <label style={lbl}>Phone Number</label>
                <input type="tel" placeholder="+1 415 000 0000" value={phone} onChange={e => setPhone(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label style={lbl}>Portfolio URL</label>
                <input type="url" placeholder="https://yoursite.dev" value={portfolio} onChange={e => setPortfolio(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
              <div>
                <label style={lbl}>LinkedIn</label>
                <input type="url" placeholder="linkedin.com/in/yourname" value={linkedin} onChange={e => setLinkedin(e.target.value)} style={inp} onFocus={fg} onBlur={br}/>
              </div>
            </div>
          </div>

          {/* Cover note */}
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <div className="flex items-center justify-between">
              <span className="tag-pill self-start" style={{ background: "#8B5CF622", color: "#8B5CF6" }}>COVER NOTE</span>
              <span className="font-mono text-xs text-white/20">{coverNote.length} / 800</span>
            </div>
            <textarea
              placeholder="Introduce yourself. Why do you want this role? What makes you a great fit? What projects demonstrate your skills?"
              rows={6}
              value={coverNote}
              onChange={e => { if (e.target.value.length <= 800) setCoverNote(e.target.value); }}
              style={{ ...inp, resize: "vertical" }}
              onFocus={fg}
              onBlur={br}
            />
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--sb-inset)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(coverNote.length / 800) * 100}%`, background: coverNote.length > 700 ? "#F59E0B" : "#10B981" }}/>
            </div>
          </div>

          {/* Relevant projects */}
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#F59E0B22", color: "#F59E0B" }}>RELEVANT PROJECTS</span>
            <p className="font-body text-xs" style={{ color: "var(--sb-text-muted)" }}>Select projects from your profile to showcase with this application</p>
            <div className="flex flex-col gap-2">
              {profileProjects.map(proj => {
                const sel = selectedProjects.has(proj.name);
                return (
                  <div
                    key={proj.name}
                    className="rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all"
                    style={{ background: sel ? "#10B98110" : t.inset, border: `1.5px solid ${sel ? "#10B98155" : t.border}` }}
                    onClick={() => setSelectedProjects(s => { const n = new Set(s); n.has(proj.name) ? n.delete(proj.name) : n.add(proj.name); return n; })}
                  >
                    <div
                      className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center"
                      style={{ background: sel ? "#10B981" : "transparent", border: `2px solid ${sel ? "#10B981" : "#2a2f3a"}` }}
                    >
                      {sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-sm font-semibold" style={{ color: t.text }}>{proj.name}</div>
                      <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--sb-text-muted)" }}>{proj.stack}</div>
                    </div>
                    {proj.relevant && (
                      <span className="tag-pill shrink-0" style={{ background: "#10B98115", color: "#10B981", fontSize: 8 }}>Relevant</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: summary + actions */}
        <div className="flex flex-col gap-4">

          {/* Application summary */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 sticky top-6" style={{ background: "var(--sb-card)", border: `1.5px solid ${job.color}44` }}>
            <span className="tag-pill self-start" style={{ background: `${job.color}22`, color: job.color }}>APPLICATION SUMMARY</span>

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Role",     val: job.title,  ok: true },
                { label: "Company",  val: job.co,     ok: true },
                { label: "CV",       val: cvAttached ? "Attached ✓" : "Not attached", ok: cvAttached },
                { label: "Profile",  val: autoFilled ? "Auto-filled ✓" : "Manual entry", ok: autoFilled },
                { label: "Projects", val: `${selectedProjects.size} selected`, ok: selectedProjects.size > 0 },
                { label: "Cover",    val: coverNote.length > 50 ? `${coverNote.length} chars` : "Not written", ok: coverNote.length > 50 },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-white/30 uppercase tracking-widest shrink-0">{r.label}</span>
                  <span className="font-body text-xs truncate" style={{ color: r.ok ? "#10B981" : "var(--sb-text-muted)" }}>{r.val}</span>
                </div>
              ))}
            </div>

            <div className="h-px w-full" style={{ background: "var(--sb-inset)" }}/>

            {/* Match score reminder */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: `${job.color}0f`, border: `1px solid ${job.color}33` }}>
              <div className="font-display text-2xl shrink-0" style={{ color: job.color }}>{job.match}%</div>
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: t.text }}>SkillBridge Match</div>
                <div className="font-body text-xs" style={{ color: "var(--sb-text-muted)" }}>Strong fit for this role</div>
              </div>
            </div>

            {/* Action buttons */}
            <ConfettiBtn
              className="font-mono text-sm font-bold text-white w-full py-3.5 rounded-2xl uppercase tracking-widest"
              color="#10B981"
              onClick={() => setSubmitted(true)}
            >
              Submit Application ✦
            </ConfettiBtn>

            <button
              className="w-full py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5"
              style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)", color: "var(--sb-text-muted)", cursor: "pointer" }}
            >
              ⌷ Save for Later
            </button>

            <p className="font-mono text-center" style={{ fontSize: "0.55rem", color: "#4b5563" }}>
              Applications are sent directly to the employer via SkillBridge. Your data is never shared without consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page: Job Matches ─── */
function PageJobMatches({ onNavigate }: { onNavigate?: (p: DashPage) => void } = {}) {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const jobs = [
    {
      title: "Junior Frontend Developer",
      co: "TechCorp Solutions",
      coInitials: "TC",
      match: 95,
      loc: "Remote",
      type: "Full-Time",
      desc: "Building responsive user interfaces using modern web technologies and React framework.",
      tags: ["Remote", "Full-Time", "React"],
      borderColor: "#93C5FD",
      btnColor: "#2563EB",
      matchBg: "#ECFDF5",
      matchColor: "#059669",
      salary: "$90K – $110K",
      posted: "1d ago",
    },
    {
      title: "Biomedical Data Analyst",
      co: "Health AI Labs",
      coInitials: "HA",
      match: 88,
      loc: "Hybrid",
      type: "Hybrid",
      desc: "Analyzing healthcare data pipelines and optimizing clinical models using Python & SQL.",
      tags: ["Hybrid", "Python", "SQL"],
      borderColor: "#A7F3D0",
      btnColor: "#059669",
      matchBg: "#ECFDF5",
      matchColor: "#059669",
      salary: "$85K – $105K",
      posted: "2d ago",
    },
    {
      title: "Full-Stack Developer",
      co: "Notion",
      coInitials: "No",
      match: 82,
      loc: "New York, NY",
      type: "Full-Time",
      desc: "Build and maintain core product features across the entire stack using Node.js and React.",
      tags: ["Node.js", "React", "PostgreSQL"],
      borderColor: "#93C5FD",
      btnColor: "#2563EB",
      matchBg: "#ECFDF5",
      matchColor: "#059669",
      salary: "$120K – $150K",
      posted: "3d ago",
    },
    {
      title: "UI Engineer",
      co: "Figma",
      coInitials: "Fi",
      match: 79,
      loc: "San Francisco, CA",
      type: "Full-Time",
      desc: "Craft pixel-perfect UI components and contribute to the design system used by millions.",
      tags: ["React", "CSS", "Design Systems"],
      borderColor: "#FDE68A",
      btnColor: "#D97706",
      matchBg: "#FFFBEB",
      matchColor: "#D97706",
      salary: "$130K – $160K",
      posted: "4d ago",
    },
    {
      title: "React Developer",
      co: "Vercel",
      coInitials: "Ve",
      match: 76,
      loc: "Remote · EU / USA",
      type: "Contract",
      desc: "Build high-performance web apps on the Vercel platform with Next.js and Edge Functions.",
      tags: ["Next.js", "React", "Edge Functions"],
      borderColor: "#A7F3D0",
      btnColor: "#059669",
      matchBg: "#ECFDF5",
      matchColor: "#059669",
      salary: "$100K – $130K",
      posted: "5d ago",
    },
    {
      title: "Data Engineer",
      co: "Spotify",
      coInitials: "Sp",
      match: 67,
      loc: "Stockholm / Remote",
      type: "Full-Time",
      desc: "Design and maintain large-scale data pipelines powering music recommendation systems.",
      tags: ["Python", "Apache Spark", "Kafka"],
      borderColor: "#93C5FD",
      btnColor: "#2563EB",
      matchBg: "#ECFDF5",
      matchColor: "#059669",
      salary: "$95K – $125K",
      posted: "6d ago",
    },
  ];

  const filters = ["All", "Full-Time", "Hybrid", "Contract", "Remote"];
  const visible = filter === "All" ? jobs : jobs.filter(j =>
    filter === "Remote" ? j.loc.toLowerCase().includes("remote") : j.type === filter
  );

  function toggleSave(i: number) {
    setSaved(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }

  const t = useT();
  /* Palette tokens — theme-aware */
  const bg      = t.bg;
  const cardBg  = t.card;
  const textDark = t.text;
  const textMid  = t.muted;
  const tagBg    = t.inset;
  const tagText  = t.muted;

  return (
    <div className="rounded-3xl p-8 min-h-full" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3"
              style={{ background: t.L ? "#DBEAFE" : "#2563EB18", color: "#2563EB", fontFamily: "'Space Mono', monospace" }}
            >
              Recommended For You
            </span>
            <h1 className="font-display" style={{ fontSize: "2.4rem", fontWeight: 800, color: textDark, margin: 0, lineHeight: 1.1 }}>
              Your Top <span style={{ color: "#2563EB" }}>Job Matches</span>
            </h1>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.9rem", color: textMid, marginTop: 6 }}>
              Based on your skill profile · updated today
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${filter === f ? "#2563EB" : t.border}`,
                  background: filter === f ? "#2563EB" : cardBg,
                  color: filter === f ? "white" : textMid,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: `${visible.length}`, l: "Roles Found", accent: "#2563EB", light: t.L ? "#DBEAFE" : "#2563EB18" },
            { v: "82%", l: "Avg Match Score", accent: "#059669", light: t.L ? "#D1FAE5" : "#05966918" },
            { v: "$115K", l: "Median Salary", accent: "#D97706", light: t.L ? "#FEF3C7" : "#D9770618" },
            { v: "3", l: "Applied This Week", accent: "#7C3AED", light: t.L ? "#EDE9FE" : "#7C3AED18" },
          ].map(s => (
            <div key={s.l} className="rounded-2xl p-4 flex flex-col gap-1"
              style={{ background: cardBg, border: `1.5px solid ${s.light}`, boxShadow: t.L ? "0 2px 8px rgba(0,0,0,0.04)" : "none" }}>
              <div className="font-display" style={{ fontSize: "2rem", fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.v}</div>
              <div className="font-body" style={{ fontSize: "0.75rem", color: textMid }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Job cards grid */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {visible.map((j, i) => {
            const isSaved = saved.has(i);
            return (
              <div
                key={i}
                className="flex flex-col justify-between"
                style={{
                  background: cardBg,
                  borderRadius: 20,
                  padding: 24,
                  border: `2px solid ${j.borderColor}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div>
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex items-start gap-3">
                      {/* Logo */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                        style={{ background: t.L ? j.matchBg : `${j.matchColor}18`, color: j.matchColor, fontFamily: "'Plus Jakarta Sans', sans-serif", border: `1.5px solid ${j.borderColor}` }}
                      >
                        {j.coInitials}
                      </div>
                      <div>
                        <h2 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 700, color: textDark, margin: 0, lineHeight: 1.2 }}>
                          {j.title}
                        </h2>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.8rem", color: textMid, marginTop: 2 }}>
                          {j.co} · {j.loc}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {/* Match badge */}
                      <span style={{
                        background: t.L ? j.matchBg : `${j.matchColor}18`,
                        color: j.matchColor,
                        border: `1px solid ${j.matchColor}44`,
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        whiteSpace: "nowrap",
                      }}>
                        {j.match}% Match
                      </span>
                      {/* Save */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleSave(i); }}
                        style={{
                          background: isSaved ? j.matchBg : t.inset,
                          border: `1px solid ${isSaved ? j.matchColor : t.border}`,
                          borderRadius: 8,
                          width: 30,
                          height: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill={isSaved ? j.matchColor : "none"} stroke={isSaved ? j.matchColor : "#94A3B8"} strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.85rem", color: textMid, lineHeight: 1.6, marginBottom: 14 }}>
                    {j.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {j.tags.map(t => (
                      <span key={t} style={{
                        background: tagBg,
                        color: tagText,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Salary + posted */}
                  <div className="flex items-center justify-between mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: j.btnColor }}>{j.salary}</span>
                    <span style={{ fontSize: "0.75rem", color: textMid }}>{j.posted}</span>
                  </div>
                </div>

                {/* Apply button */}
                <button
                  onClick={() => onNavigate?.("Job Application")}
                  style={{
                    background: j.btnColor,
                    color: "#fff",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    textAlign: "center",
                    display: "block",
                    width: "100%",
                    marginTop: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Apply Now →
                </button>
              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="rounded-2xl p-12 flex flex-col items-center gap-3 text-center"
            style={{ background: cardBg, border: `2px dashed ${t.border}` }}>
            <span className="text-4xl">🔍</span>
            <div className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: textDark }}>No roles found</div>
            <div className="font-body" style={{ fontSize: "0.85rem", color: textMid }}>
              Try a different filter or update your skill profile
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page: Profile ─── */
/* ─── Page: Community ─── */
/* ─── Page: Marketplace ─── */
function PageMarketplace() {
  const t = useT();
  const [tab, setTab] = useState<"listings" | "offerings">("listings");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("All");
  const [drawer, setDrawer] = useState<number | null>(null);
  const [bidSent, setBidSent] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [offeringSearch, setOfferingSearch] = useState("");

  const categories = ["All", "Freelance", "Internship", "Full-Time", "Micro-Task"];
  const budgets = ["All", "< $500", "$500–$2K", "$2K–$10K", "$10K+", "Stipend"];

  const listings = [
    {
      id: 1,
      title: "React Dashboard UI",
      type: "Freelance",
      client: "NovaLabs",
      clientInitials: "NL",
      clientColor: "#2563EB",
      budget: "$1,200",
      budgetType: "Fixed",
      deadline: "12 days",
      posted: "2h ago",
      desc: "Build a responsive analytics dashboard using React + Recharts. Pixel-perfect from provided Figma specs. Clean component structure required.",
      skills: ["React", "TypeScript", "Recharts", "CSS"],
      deliverables: ["Source code repo", "Storybook docs", "Responsive across 3 breakpoints"],
      scope: "Medium",
      border: "#2563EB",
      accent: "#2563EB",
      proposals: 4,
      featured: true,
    },
    {
      id: 2,
      title: "ML Model Integration",
      type: "Freelance",
      client: "HealthAI",
      clientInitials: "HA",
      clientColor: "#10B981",
      budget: "$2,800",
      budgetType: "Fixed",
      deadline: "21 days",
      posted: "5h ago",
      desc: "Integrate a pre-trained BERT classification model into a Flask REST API. Write unit tests and deploy to a staging server.",
      skills: ["Python", "Flask", "BERT", "Docker"],
      deliverables: ["REST API endpoints", "Test suite (>80% coverage)", "Docker compose file"],
      scope: "Large",
      border: "#10B981",
      accent: "#10B981",
      proposals: 7,
      featured: true,
    },
    {
      id: 3,
      title: "UI/UX Bug Fixes",
      type: "Micro-Task",
      client: "StreamApp",
      clientInitials: "SA",
      clientColor: "#F59E0B",
      budget: "$180",
      budgetType: "Fixed",
      deadline: "3 days",
      posted: "1d ago",
      desc: "Fix 8 reported UI bugs across mobile & desktop. Issues tracked in Linear. Reproduce, patch, and PR against the dev branch.",
      skills: ["CSS", "React", "Bug Fixing"],
      deliverables: ["Merged PRs for all 8 issues", "Screenshots before/after"],
      scope: "Small",
      border: "#F59E0B",
      accent: "#F59E0B",
      proposals: 12,
      featured: false,
    },
    {
      id: 4,
      title: "Summer Data Analyst Intern",
      type: "Internship",
      client: "Accenture",
      clientInitials: "Ac",
      clientColor: "#8B5CF6",
      budget: "$22/hr",
      budgetType: "Hourly stipend",
      deadline: "Rolling",
      posted: "2d ago",
      desc: "3-month paid internship. Analyze user behaviour datasets, build Tableau dashboards, and present weekly insights to stakeholders.",
      skills: ["SQL", "Python", "Tableau", "Excel"],
      deliverables: ["Weekly insight decks", "Final analysis report", "Clean dataset"],
      scope: "3 months",
      border: "#8B5CF6",
      accent: "#8B5CF6",
      proposals: 31,
      featured: true,
    },
    {
      id: 5,
      title: "Backend Node.js API",
      type: "Freelance",
      client: "Launchpad",
      clientInitials: "LP",
      clientColor: "#EC4899",
      budget: "$950",
      budgetType: "Fixed",
      deadline: "10 days",
      posted: "3d ago",
      desc: "Build 12 REST endpoints for a SaaS product. Auth with JWT, rate limiting, Postgres integration, and full API docs via Swagger.",
      skills: ["Node.js", "PostgreSQL", "JWT", "Swagger"],
      deliverables: ["API source + tests", "Swagger docs", "Deployment guide"],
      scope: "Medium",
      border: "#EC4899",
      accent: "#EC4899",
      proposals: 9,
      featured: false,
    },
    {
      id: 6,
      title: "Junior Frontend Developer",
      type: "Full-Time",
      client: "Figma",
      clientInitials: "Fi",
      clientColor: "#2563EB",
      budget: "$95K/yr",
      budgetType: "Salary",
      deadline: "Open",
      posted: "4d ago",
      desc: "Join Figma's core editor team. Build highly performant UI components, contribute to the design system, and ship features used by millions.",
      skills: ["React", "TypeScript", "CSS", "Design Systems"],
      deliverables: ["Component library contributions", "Feature ownership", "Code reviews"],
      scope: "Full-Time",
      border: "#60a5fa",
      accent: "#60a5fa",
      proposals: 88,
      featured: false,
    },
  ];

  const offerings = [
    { id: 1, student: "Priya S.", avatar: "P", color: "#2563EB", title: "Custom React Components", category: "Frontend Dev", price: "$120", rating: 4.9, reviews: 23, skills: ["React", "TypeScript", "Tailwind"], badge: "Top Rated", badgeColor: "#F59E0B" },
    { id: 2, student: "Marcus L.", avatar: "M", color: "#10B981", title: "Full UI Design (Figma → Code)", category: "UI/UX Design", price: "$280", rating: 4.7, reviews: 11, skills: ["Figma", "CSS", "React"], badge: "Rising Star", badgeColor: "#8B5CF6" },
    { id: 3, student: "Aisha O.", avatar: "A", color: "#F59E0B", title: "Python Data Scripts & Automation", category: "Data / ML", price: "$90", rating: 5.0, reviews: 7, skills: ["Python", "Pandas", "Automation"], badge: "New", badgeColor: "#10B981" },
    { id: 4, student: "Devon C.", avatar: "D", color: "#EC4899", title: "Bug Hunt & Fix (Frontend)", category: "QA / Bugs", price: "$60", rating: 4.5, reviews: 18, skills: ["CSS", "JavaScript", "Debugging"], badge: null, badgeColor: "" },
    { id: 5, student: "Lena M.", avatar: "L", color: "#8B5CF6", title: "PostgreSQL Schema Design", category: "Backend / DB", price: "$150", rating: 4.8, reviews: 9, skills: ["PostgreSQL", "SQL", "ERD"], badge: "Top Rated", badgeColor: "#F59E0B" },
    { id: 6, student: "Raj P.", avatar: "R", color: "#2563EB", title: "Landing Page in 48h", category: "Frontend Dev", price: "$200", rating: 4.6, reviews: 5, skills: ["HTML", "CSS", "React"], badge: "Fast Delivery", badgeColor: "#10B981" },
  ];

  const filteredListings = listings.filter(l => {
    const matchCat = categoryFilter === "All" || l.type === categoryFilter;
    const matchSearch = search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const filteredOfferings = offerings.filter(o =>
    offeringSearch === "" ||
    o.title.toLowerCase().includes(offeringSearch.toLowerCase()) ||
    o.category.toLowerCase().includes(offeringSearch.toLowerCase())
  );

  const drawerItem = listings.find(l => l.id === drawer);

  const typeColors: Record<string, string> = {
    Freelance: "#2563EB", Internship: "#8B5CF6", "Full-Time": "#10B981", "Micro-Task": "#F59E0B",
  };

  return (
    <div className="flex flex-col gap-0 relative" style={{ color: t.text }}>

      {/* ── Project Detail Drawer ── */}
      {drawerItem && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          {/* Backdrop */}
          <div
            onClick={() => setDrawer(null)}
            style={{ flex: 1, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          />
          {/* Panel */}
          <div style={{
            width: "min(480px, 92vw)", background: t.card,
            borderLeft: `2px solid ${drawerItem.border}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
            overflowY: "auto", display: "flex", flexDirection: "column",
          }}>
            {/* Top accent */}
            <div style={{ height: 5, background: `repeating-linear-gradient(90deg,${drawerItem.accent} 0,${drawerItem.accent} 8px,transparent 8px,transparent 14px)` }} />

            <div style={{ padding: "28px 28px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest"
                      style={{ background: `${typeColors[drawerItem.type]}18`, color: typeColors[drawerItem.type] }}>
                      {drawerItem.type}
                    </span>
                    {drawerItem.featured && (
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: "#F59E0B18", color: "#F59E0B" }}>★ Featured</span>
                    )}
                  </div>
                  <h2 className="font-display font-bold" style={{ fontSize: "1.4rem", color: t.text, lineHeight: 1.15 }}>{drawerItem.title}</h2>
                  <div className="font-body text-sm mt-1" style={{ color: t.muted }}>{drawerItem.client} · Posted {drawerItem.posted}</div>
                </div>
                <button onClick={() => setDrawer(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, fontSize: "1.3rem", lineHeight: 1, padding: 4 }}>×</button>
              </div>

              {/* Budget + deadline row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Budget", val: drawerItem.budget, color: drawerItem.accent },
                  { label: "Deadline", val: drawerItem.deadline, color: "#F59E0B" },
                  { label: "Proposals", val: String(drawerItem.proposals), color: "#8B5CF6" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: t.inset, border: `1px solid ${t.border}` }}>
                    <div className="font-display font-bold" style={{ fontSize: "1.2rem", color: stat.color }}>{stat.val}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: t.muted }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.muted }}>Task Scope</div>
                <p className="font-body text-sm leading-relaxed" style={{ color: t.text }}>{drawerItem.desc}</p>
              </div>

              {/* Deliverables */}
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: t.muted }}>Deliverables</div>
                <div className="flex flex-col gap-2">
                  {drawerItem.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-sm mt-1.5 shrink-0" style={{ background: drawerItem.accent }} />
                      <span className="font-body text-sm" style={{ color: t.text }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required skills */}
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: t.muted }}>Required Skills</div>
                <div className="flex flex-wrap gap-2">
                  {drawerItem.skills.map(s => (
                    <span key={s} className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: t.inset, color: t.text, border: `1px solid ${t.border}` }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Client info */}
              <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: t.inset, border: `1px solid ${t.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: `${drawerItem.clientColor}20`, color: drawerItem.clientColor, border: `1.5px solid ${drawerItem.clientColor}44` }}>
                  {drawerItem.clientInitials}
                </div>
                <div>
                  <div className="font-body text-sm font-semibold" style={{ color: t.text }}>{drawerItem.client}</div>
                  <div className="font-mono text-xs" style={{ color: t.muted }}>Verified Client · Member since 2024</div>
                </div>
                <div className="ml-auto font-mono text-xs font-bold" style={{ color: "#10B981" }}>✓ Verified</div>
              </div>

              {/* CTA */}
              <button
                onClick={() => { setBidSent(prev => { const n = new Set(prev); n.add(drawerItem.id); return n; }); setDrawer(null); }}
                className="w-full py-4 rounded-2xl font-mono font-bold uppercase tracking-widest"
                style={{
                  background: bidSent.has(drawerItem.id) ? "#10B98133" : "#10B981",
                  color: bidSent.has(drawerItem.id) ? "#10B981" : "#0f1117",
                  border: bidSent.has(drawerItem.id) ? "2px solid #10B981" : "none",
                  fontSize: "0.9rem", letterSpacing: "0.14em", cursor: "pointer",
                  boxShadow: bidSent.has(drawerItem.id) ? "none" : "0 6px 24px #10B98144",
                  transition: "all 0.2s",
                }}>
                {bidSent.has(drawerItem.id) ? "✓ Bid Submitted" : "Apply / Place Bid →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
            style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133" }}>
            Live · 247 opportunities
          </span>
        </div>
        <h1 className="font-display font-bold" style={{ fontSize: "2.2rem", color: t.text, lineHeight: 1.1 }}>
          Skill<span style={{ color: "#10B981" }}>Bridge</span> Marketplace
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: t.muted }}>
          Find freelance projects, internships, and full-time roles — or offer your own skills for hire.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-2xl self-start" style={{ background: t.inset, border: `1px solid ${t.border}` }}>
        {(["listings", "offerings"] as const).map(tabId => (
          <button key={tabId} onClick={() => setTab(tabId)}
            className="font-mono text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: tab === tabId ? "#10B981" : "transparent",
              color: tab === tabId ? "#0f1117" : t.muted,
              border: "none", cursor: "pointer",
              boxShadow: tab === tabId ? "0 4px 14px #10B98133" : "none",
            }}>
            {tabId === "listings" ? "⬡ Browse Listings" : "◍ My Offerings"}
          </button>
        ))}
      </div>

      {/* ══ LISTINGS TAB ══ */}
      {tab === "listings" && <>

        {/* Search + filters */}
        <div className="rounded-2xl p-5 mb-6 flex flex-col gap-4" style={{ background: t.card, border: `1.5px solid ${t.border}` }}>
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by project title or required skill…"
              className="w-full rounded-xl pl-11 pr-4 py-3.5 font-body text-sm outline-none"
              style={{ background: t.inset, border: `1.5px solid ${t.border}`, color: t.text, transition: "border-color 0.2s" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#10B981")}
              onBlur={e => (e.currentTarget.style.borderColor = t.border as string)}
            />
          </div>

          {/* Filter rows */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: t.muted }}>Type:</span>
            {categories.map(c => (
              <button key={c} onClick={() => setCategoryFilter(c)}
                className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: categoryFilter === c ? (typeColors[c] ?? "#10B981") : t.inset,
                  color: categoryFilter === c ? "#ffffff" : t.muted,
                  border: `1.5px solid ${categoryFilter === c ? (typeColors[c] ?? "#10B981") : t.border}`,
                  cursor: "pointer",
                }}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold uppercase tracking-widest shrink-0" style={{ color: t.muted }}>Budget:</span>
            {budgets.map(b => (
              <button key={b} onClick={() => setBudgetFilter(b)}
                className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                style={{
                  background: budgetFilter === b ? "#F59E0B" : t.inset,
                  color: budgetFilter === b ? "#0f1117" : t.muted,
                  border: `1.5px solid ${budgetFilter === b ? "#F59E0B" : t.border}`,
                  cursor: "pointer",
                }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Featured banner */}
        {categoryFilter === "All" && search === "" && (
          <div className="rounded-2xl p-5 mb-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #10B98112, #2563EB10)", border: "1.5px solid #10B98133" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#10B98120", border: "1px solid #10B98144" }}>
              <span style={{ fontSize: "1.2rem" }}>★</span>
            </div>
            <div>
              <div className="font-display font-bold text-base" style={{ color: t.text }}>Featured This Week</div>
              <div className="font-body text-sm" style={{ color: t.muted }}>Hand-picked high-quality opportunities matching your top skills</div>
            </div>
            <div className="ml-auto font-mono text-xs font-bold shrink-0" style={{ color: "#10B981" }}>{listings.filter(l => l.featured).length} featured</div>
          </div>
        )}

        {/* Listings grid */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {filteredListings.map(l => {
            const isSaved = saved.has(l.id);
            const hasBid = bidSent.has(l.id);
            return (
              <div key={l.id}
                onClick={() => setDrawer(l.id)}
                className="flex flex-col rounded-2xl cursor-pointer transition-all"
                style={{ background: t.card, border: `2px solid ${l.featured ? l.border : t.border}`, boxShadow: l.featured ? `0 0 0 1px ${l.border}18` : "none" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = l.border; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = l.featured ? l.border : t.border; }}
              >
                {/* Top accent stripe */}
                <div style={{ height: 4, background: `repeating-linear-gradient(90deg,${l.accent} 0,${l.accent} 6px,transparent 6px,transparent 10px)`, borderRadius: "10px 10px 0 0" }} />

                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ background: `${l.clientColor}18`, color: l.clientColor, border: `1.5px solid ${l.clientColor}33` }}>
                        {l.clientInitials}
                      </div>
                      <div>
                        <div className="font-body text-xs font-semibold" style={{ color: t.muted }}>{l.client}</div>
                        <div className="font-mono text-xs" style={{ color: t.faint }}>{l.posted}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {l.featured && <span className="font-mono" style={{ fontSize: "0.6rem", color: "#F59E0B" }}>★</span>}
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: `${typeColors[l.type]}18`, color: typeColors[l.type] }}>
                        {l.type}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <div className="font-display font-bold" style={{ fontSize: "1.05rem", color: t.text, lineHeight: 1.2 }}>{l.title}</div>
                    <p className="font-body text-xs leading-relaxed mt-1.5" style={{ color: t.muted, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {l.desc}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {l.skills.slice(0, 3).map(s => (
                      <span key={s} className="font-mono text-xs px-2 py-0.5 rounded-lg"
                        style={{ background: t.inset, color: t.muted, border: `1px solid ${t.border}` }}>{s}</span>
                    ))}
                    {l.skills.length > 3 && <span className="font-mono text-xs px-2 py-0.5 rounded-lg" style={{ background: t.inset, color: t.faint }}>+{l.skills.length - 3}</span>}
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: `1px solid ${t.border}` }}>
                    <div>
                      <div className="font-display font-bold" style={{ color: l.accent, fontSize: "1.05rem" }}>{l.budget}</div>
                      <div className="font-mono text-xs" style={{ color: t.faint }}>{l.budgetType} · {l.deadline}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setSaved(prev => { const n = new Set(prev); isSaved ? n.delete(l.id) : n.add(l.id); return n; }); }}
                        style={{ background: isSaved ? "#F59E0B18" : t.inset, border: `1px solid ${isSaved ? "#F59E0B55" : t.border}`, borderRadius: 10, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={isSaved ? "#F59E0B" : "none"} stroke={isSaved ? "#F59E0B" : t.muted} strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                      </button>
                      <div className="font-mono text-xs" style={{ color: t.faint }}>{l.proposals} bids</div>
                    </div>
                  </div>

                  {hasBid && (
                    <div className="font-mono text-xs font-bold text-center py-1.5 rounded-xl" style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133" }}>
                      ✓ Bid Submitted
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredListings.length === 0 && (
          <div className="rounded-2xl p-14 text-center" style={{ background: t.card, border: `2px dashed ${t.border}` }}>
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-display font-bold text-lg" style={{ color: t.text }}>No listings found</div>
            <div className="font-body text-sm mt-1" style={{ color: t.muted }}>Try a different search term or filter</div>
          </div>
        )}
      </>}

      {/* ══ OFFERINGS TAB ══ */}
      {tab === "offerings" && <>
        {/* Intro + post button */}
        <div className="rounded-2xl p-5 mb-6 flex items-center justify-between gap-4" style={{ background: "linear-gradient(135deg, #2563EB10, #8B5CF610)", border: "1.5px solid #2563EB33" }}>
          <div>
            <div className="font-display font-bold text-base" style={{ color: t.text }}>List Your Skills for Hire</div>
            <div className="font-body text-sm mt-0.5" style={{ color: t.muted }}>Offer services to the community and get paid for your expertise</div>
          </div>
          <button className="font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl shrink-0"
            style={{ background: "#2563EB", color: "#fff", border: "none", cursor: "pointer", letterSpacing: "0.12em", boxShadow: "0 4px 16px #2563EB44", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
            + Post Offering
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={offeringSearch} onChange={e => setOfferingSearch(e.target.value)}
            placeholder="Search student offerings…"
            className="w-full rounded-xl pl-10 pr-4 py-3 font-body text-sm outline-none"
            style={{ background: t.card, border: `1.5px solid ${t.border}`, color: t.text }}
            onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
            onBlur={e => (e.currentTarget.style.borderColor = t.border as string)}
          />
        </div>

        {/* Offerings grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filteredOfferings.map(o => (
            <div key={o.id} className="rounded-2xl flex flex-col transition-all cursor-pointer"
              style={{ background: t.card, border: `1.5px solid ${t.border}` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = o.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = t.border; }}
            >
              {/* Color bar */}
              <div style={{ height: 4, background: o.color, borderRadius: "10px 10px 0 0", opacity: 0.8 }} />

              <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Student info */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: `linear-gradient(135deg, ${o.color}, ${o.color}99)`, color: "#fff" }}>
                    {o.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-sm font-semibold truncate" style={{ color: t.text }}>{o.student}</div>
                    <div className="font-mono text-xs" style={{ color: t.muted }}>{o.category}</div>
                  </div>
                  {o.badge && (
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg shrink-0"
                      style={{ background: `${o.badgeColor}18`, color: o.badgeColor, border: `1px solid ${o.badgeColor}33` }}>
                      {o.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="font-display font-bold" style={{ fontSize: "0.95rem", color: t.text, lineHeight: 1.3 }}>{o.title}</div>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < Math.round(o.rating) ? "#F59E0B" : t.inset} stroke="#F59E0B" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  <span className="font-mono text-xs font-bold" style={{ color: "#F59E0B" }}>{o.rating}</span>
                  <span className="font-mono text-xs" style={{ color: t.faint }}>({o.reviews})</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {o.skills.map(s => (
                    <span key={s} className="font-mono text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: t.inset, color: t.muted, border: `1px solid ${t.border}` }}>{s}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
                  <div className="font-display font-bold" style={{ color: o.color, fontSize: "1rem" }}>From {o.price}</div>
                  <button
                    onClick={e => e.stopPropagation()}
                    className="font-mono text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-widest"
                    style={{ background: `${o.color}18`, color: o.color, border: `1.5px solid ${o.color}44`, cursor: "pointer", transition: "all 0.15s", letterSpacing: "0.1em" }}
                    onMouseEnter={e => { e.currentTarget.style.background = o.color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${o.color}18`; e.currentTarget.style.color = o.color; }}
                  >
                    Hire →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function PageCommunity() {
  const t = useT();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const tabs = ["All", "Questions", "Showcases", "Resources", "Off-topic"];

  const posts = [
    {
      id: 1,
      author: "Priya S.", avatar: "P", avatarColor: "#2563EB",
      role: "AI/ML Guild · Level 18", badge: "Top Contributor",
      time: "2h ago", topic: "Questions", tag: "Machine Learning",
      title: "How do you handle class imbalance in a multi-label classification task?",
      body: "I've been working on a medical NLP project and I'm seeing severe class imbalance across 12 labels. Tried SMOTE but it's not effective here. Any suggestions?",
      upvotes: 84, comments: 23, views: "1.2K", tagColor: "#8B5CF6",
    },
    {
      id: 2,
      author: "Marcus L.", avatar: "M", avatarColor: "#10B981",
      role: "Web Dev Squad · Level 14", badge: "Helper",
      time: "4h ago", topic: "Showcases", tag: "React",
      title: "Built a real-time collaborative whiteboard using CRDTs + WebSockets — demo inside!",
      body: "After 3 weeks of building, I finally shipped it. No external state sync library — pure conflict-free replicated data types. Handles 50 concurrent users stress-free.",
      upvotes: 142, comments: 37, views: "3.4K", tagColor: "#2563EB",
    },
    {
      id: 3,
      author: "Amina K.", avatar: "A", avatarColor: "#F59E0B",
      role: "Data Guild · Level 11", badge: "Rising Star",
      time: "6h ago", topic: "Resources", tag: "SQL",
      title: "My SQL interview prep cheat sheet — 40 patterns with worked examples",
      body: "Spent 2 months compiling this. Covers window functions, CTEs, recursive queries, and optimisation patterns. Free to download — link in comments.",
      upvotes: 201, comments: 58, views: "5.1K", tagColor: "#DC2626",
    },
    {
      id: 4,
      author: "Jonas R.", avatar: "J", avatarColor: "#EC4899",
      role: "DevOps Crew · Level 9", badge: "Explorer",
      time: "Yesterday", topic: "Questions", tag: "Docker",
      title: "Docker Compose vs Kubernetes for a 3-service side project — overkill?",
      body: "Just 3 services: a React frontend, FastAPI backend, and Postgres. Starting with Compose but my team says we should go Kubernetes from the start. Thoughts?",
      upvotes: 56, comments: 41, views: "890", tagColor: "#EC4899",
    },
    {
      id: 5,
      author: "Sofia M.", avatar: "S", avatarColor: "#10B981",
      role: "UX Circle · Level 7", badge: "Helper",
      time: "Yesterday", topic: "Showcases", tag: "Design",
      title: "Redesigned the SkillBridge onboarding flow — before/after comparison",
      body: "Reduced the onboarding steps from 9 to 4 and bumped completion rate by 34% in our A/B test. Sharing the Figma file for feedback.",
      upvotes: 93, comments: 19, views: "2.1K", tagColor: "#F59E0B",
    },
  ];

  const guilds = [
    { name: "AI / ML Guild", icon: "🤖", color: "#8B5CF6", members: 1284, posts: 3420, desc: "Deep dives into neural networks, NLP, computer vision, and production ML systems.", tags: ["PyTorch", "Transformers", "MLOps"] },
    { name: "Web Dev Squad", icon: "⚡", color: "#2563EB", members: 2891, posts: 7810, desc: "Frontend, backend, and full-stack discussions. React, Node, databases and beyond.", tags: ["React", "Node.js", "TypeScript"] },
    { name: "Data Guild", icon: "📊", color: "#DC2626", members: 967, posts: 2140, desc: "SQL, analytics, data engineering, and visualisation. Power BI to dbt to Spark.", tags: ["SQL", "Python", "dbt"] },
    { name: "DevOps Crew", icon: "🛠", color: "#F59E0B", members: 741, posts: 1560, desc: "CI/CD pipelines, containerisation, cloud infra, and SRE culture.", tags: ["Docker", "K8s", "AWS"] },
    { name: "UX Circle", icon: "🎨", color: "#EC4899", members: 634, posts: 1230, desc: "Design systems, user research, prototyping, and accessibility.", tags: ["Figma", "Research", "A11y"] },
    { name: "Open Source Lab", icon: "🔬", color: "#10B981", members: 512, posts: 980, desc: "Collaborative open-source projects, code reviews, and contribution guides.", tags: ["GitHub", "OSS", "Reviews"] },
  ];

  const contributors = [
    { name: "Priya S.",  country: "🇮🇳", pts: "9,842", badge: "Top Contributor", badgeColor: "#F59E0B", rank: 1, avatarColor: "#2563EB", streak: 42 },
    { name: "Marcus L.", country: "🇧🇷", pts: "9,210", badge: "Guild Master",    badgeColor: "#8B5CF6", rank: 2, avatarColor: "#10B981", streak: 31 },
    { name: "Amina K.",  country: "🇳🇬", pts: "8,340", badge: "Helper Pro",      badgeColor: "#10B981", rank: 3, avatarColor: "#F59E0B", streak: 27 },
    { name: "Jamie R.",  country: "🇺🇸", pts: "8,994", badge: "Rising Star",     badgeColor: "#2563EB", rank: 4, avatarColor: "#EC4899", streak: 14, you: true },
    { name: "Jonas R.",  country: "🇩🇪", pts: "7,900", badge: "Explorer",        badgeColor: "#EC4899", rank: 5, avatarColor: "#DC2626", streak: 9 },
    { name: "Sofia M.",  country: "🇪🇸", pts: "7,450", badge: "Consistent",      badgeColor: "#F59E0B", rank: 6, avatarColor: "#10B981", streak: 21 },
  ];

  const filtered = posts.filter(p =>
    (activeTab === "All" || p.topic === activeTab) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div
        className="rounded-3xl relative overflow-hidden p-7"
        style={{ background: "linear-gradient(135deg, #13161e 0%, #1a1f2e 60%, #0f1117 100%)", border: "1.5px solid var(--sb-border)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #8B5CF618 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #2563EB14 0%, transparent 70%)" }} />
        <div className="relative">
          <span className="tag-pill" style={{ background: "#8B5CF622", color: "#8B5CF6" }}>COMMUNITY HUB</span>
          <h1 className="font-display mt-2" style={{ fontSize: "2.4rem", lineHeight: 1.1, color: "var(--color-white, #ffffff)" }}>Learn Together,<br />Grow Together</h1>
          <p className="font-body mt-2 mb-5" style={{ color: "var(--sb-text-muted)", fontSize: "0.95rem" }}>
            Join <span style={{ color: "#10B981" }}>8,400+ learners</span> discussing ideas, sharing projects, and levelling up together.
          </p>
          <div className="flex gap-3 flex-wrap">
            {[
              { v: "8.4K", l: "Members", c: "#10B981" },
              { v: "24K+", l: "Posts", c: "#2563EB" },
              { v: "6", l: "Guilds", c: "#8B5CF6" },
              { v: "342", l: "Online now", c: "#F59E0B" },
            ].map(s => (
              <div key={s.l} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${s.c}12`, border: `1px solid ${s.c}33` }}>
                <span className="font-display text-lg leading-none" style={{ color: s.c }}>{s.v}</span>
                <span className="font-mono" style={{ fontSize: "0.6rem", color: t.muted }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout: feed + sidebar ── */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 280px" }}>

        {/* ── Left: search + tabs + feed ── */}
        <div className="flex flex-col gap-4">

          {/* Search + Create Post */}
          <div className="flex gap-3">
            <div
              className="flex items-center gap-3 flex-1 px-4 py-2.5 rounded-2xl"
              style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search discussions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-body text-sm text-white outline-none placeholder:text-white/20"
              />
            </div>
            <ConfettiBtn
              className="font-mono text-xs font-bold text-white px-5 py-2.5 rounded-2xl uppercase tracking-widest shrink-0"
              color="#8B5CF6"
            >
              + Create Post
            </ConfettiBtn>
          </div>

          {/* Topic tabs */}
          <div className="flex gap-1 p-1 rounded-2xl flex-wrap" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="font-mono text-xs px-4 py-2 rounded-xl uppercase tracking-widest transition-all"
                style={{
                  background: activeTab === t ? "#8B5CF6" : "transparent",
                  color: activeTab === t ? "white" : "var(--sb-text-muted)",
                  border: "none", cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <div className="rounded-2xl p-10 flex flex-col items-center gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
                <span className="text-3xl">🔍</span>
                <p className="font-body text-sm text-white/40">No posts found. Try a different search or tab.</p>
              </div>
            )}
            {filtered.map(post => {
              const upvoted = votes[post.id] === 1;
              return (
                <div
                  key={post.id}
                  className="rounded-2xl p-5 flex flex-col gap-3 panel-hover"
                  style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
                >
                  {/* Post header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-display text-base text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${post.avatarColor}, ${post.avatarColor}aa)` }}
                      >
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-body text-sm font-semibold" style={{ color: t.text }}>{post.author}</span>
                          <span className="tag-pill" style={{ background: `${post.avatarColor}22`, color: post.avatarColor, fontSize: 8 }}>{post.badge}</span>
                        </div>
                        <span className="font-mono" style={{ fontSize: "0.6rem", color: t.faint }}>{post.role} · {post.time}</span>
                      </div>
                    </div>
                    <span className="tag-pill shrink-0" style={{ background: `${post.tagColor}18`, color: post.tagColor }}>{post.tag}</span>
                  </div>

                  {/* Post content */}
                  <div>
                    <h3 className="font-display leading-snug mb-1" style={{ fontSize: "1.05rem", color: t.text }}>{post.title}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "var(--sb-text-muted)" }}>{post.body}</p>
                  </div>

                  {/* Post footer */}
                  <div className="flex items-center gap-4 pt-1" style={{ borderTop: "1px solid #1e2330" }}>
                    <button
                      onClick={() => setVotes(v => ({ ...v, [post.id]: upvoted ? 0 : 1 }))}
                      className="flex items-center gap-1.5 transition-all hover:scale-105"
                      style={{ background: "none", border: "none", cursor: "pointer", color: upvoted ? "#8B5CF6" : "var(--sb-text-muted)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      <span className="font-mono text-xs font-bold">{post.upvotes + (votes[post.id] ?? 0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sb-text-muted)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="font-mono text-xs font-bold">{post.comments}</span>
                    </button>
                    <span className="font-mono text-xs flex items-center gap-1" style={{ color: t.faint }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {post.views}
                    </span>
                    <button className="ml-auto font-mono text-xs uppercase tracking-widest transition-colors" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: t.muted }}>
                      Reply →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="flex flex-col gap-5">

          {/* Top Contributors */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#F59E0B22", color: "#F59E0B" }}>TOP CONTRIBUTORS</span>
            <div className="flex flex-col gap-2">
              {contributors.map((c, i) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: c.you ? "#2563EB0d" : (i % 2 === 0 ? t.inset : "transparent"),
                    border: c.you ? "1px solid #2563EB33" : "1px solid transparent",
                  }}
                >
                  <span className="font-display text-base w-5 text-center shrink-0" style={{ color: ["#F59E0B","#9ca3af","#cd7f32"][c.rank - 1] ?? "#4b5563" }}>{c.rank}</span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-display text-xs shrink-0"
                    style={{ background: c.avatarColor, color: "#ffffff" }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-body text-xs font-semibold truncate" style={{ color: t.text }}>{c.name} {c.country}</span>
                      {c.you && <span className="tag-pill" style={{ background: "#2563EB33", color: "#60a5fa", fontSize: 7 }}>YOU</span>}
                    </div>
                    <span className="tag-pill" style={{ background: `${c.badgeColor}18`, color: c.badgeColor, fontSize: 7 }}>{c.badge}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold" style={{ color: ["#F59E0B","#9ca3af","#cd7f32"][c.rank - 1] ?? "#4b5563" }}>{c.pts}</div>
                    <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--sb-text-muted)" }}>🔥{c.streak}d</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-2.5 flex items-center justify-between" style={{ background: "#8B5CF612", border: "1px solid #8B5CF633" }}>
              <span className="font-mono text-xs" style={{ color: t.muted }}>Your rank this week</span>
              <span className="font-display text-lg" style={{ color: "#8B5CF6" }}>#4</span>
            </div>
          </div>

          {/* Active now */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <div className="flex items-center justify-between">
              <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>ACTIVE NOW</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
                <span className="font-mono text-xs" style={{ color: t.muted }}>342 online</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Priya S.", "Marcus L.", "Amina K.", "Chen W.", "Fatima A.", "Jonas R.", "Sofia M.", "Yuki T."].map((n, i) => (
                <div
                  key={n}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-display text-xs text-white"
                  style={{ background: ["#2563EB","#10B981","#F59E0B","#DC2626","#8B5CF6","#EC4899","#10B981","#2563EB"][i] }}
                  title={n}
                >
                  {n[0]}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs text-white/40" style={{ background: "var(--sb-inset)", border: "1px solid var(--sb-border2)" }}>
                +334
              </div>
            </div>
          </div>

          {/* Trending tags */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#DC262622", color: "#DC2626" }}>TRENDING TAGS</span>
            <div className="flex flex-wrap gap-2">
              {[
                { t: "#MachineLearning", c: "#8B5CF6" }, { t: "#React", c: "#2563EB" },
                { t: "#SystemDesign", c: "#F59E0B" },   { t: "#SQL", c: "#DC2626" },
                { t: "#OpenSource", c: "#10B981" },      { t: "#Docker", c: "#EC4899" },
                { t: "#TypeScript", c: "#2563EB" },      { t: "#Career", c: "var(--sb-text-muted)" },
              ].map(tag => (
                <button
                  key={tag.t}
                  className="tag-pill transition-all hover:opacity-80"
                  style={{ background: `${tag.c}18`, color: tag.c, border: `1px solid ${tag.c}33`, cursor: "pointer" }}
                >
                  {tag.t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Study Guilds ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>STUDY GUILDS</span>
            <h2 className="font-display mt-1" style={{ fontSize: "1.7rem", color: t.text }}>Find Your Tribe</h2>
          </div>
          <span className="font-body text-sm" style={{ color: "var(--sb-text-muted)" }}>6 active guilds · <span style={{ color: "#10B981" }}>7,029 members</span></span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {guilds.map(g => (
            <div
              key={g.name}
              className="rounded-2xl overflow-hidden panel-hover"
              style={{ background: "var(--sb-card)", border: `1.5px solid ${g.color}44` }}
            >
              {/* Guild header stripe */}
              <div className="px-5 py-4 flex items-start justify-between" style={{ background: `${g.color}10`, borderBottom: `1px solid ${g.color}33` }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: `${g.color}22`, border: `1.5px solid ${g.color}44` }}
                  >
                    {g.icon}
                  </div>
                  <div>
                    <div className="font-display" style={{ fontSize: "1.05rem", color: t.text }}>{g.name}</div>
                    <div className="font-mono" style={{ fontSize: "0.6rem", color: t.faint }}>{g.members.toLocaleString()} members · {g.posts.toLocaleString()} posts</div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 flex flex-col gap-3">
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--sb-text-muted)" }}>{g.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.tags.map(t => (
                    <span key={t} className="tag-pill" style={{ background: `${g.color}12`, color: g.color, border: `1px solid ${g.color}2a` }}>{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => setJoined(s => { const n = new Set(s); n.has(g.name) ? n.delete(g.name) : n.add(g.name); return n; })}
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5"
                  style={{
                    background: joined.has(g.name) ? `${g.color}22` : g.color,
                    color: joined.has(g.name) ? g.color : "white",
                    border: `1.5px solid ${g.color}`,
                    cursor: "pointer",
                  }}
                >
                  {joined.has(g.name) ? "✓ Joined" : "Join Guild"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ─── Page: Submit Project ─── */
function PageSubmitProject({ onBack }: { onBack?: () => void }) {
  const t = useT();
  const inputStyle = {
    background: "var(--sb-card2)",
    border: "1.5px solid var(--sb-border2)",
    borderRadius: "0.75rem",
    color: "var(--sb-text)",
    fontFamily: "'Nunito', sans-serif",
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  const labelStyle = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--sb-text-muted)",
    marginBottom: "0.4rem",
    display: "block",
  };

  function focusGreen(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "#10B981";
  }
  function blurReset(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "#2a2f3a";
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div
        className="rounded-3xl overflow-hidden relative p-8"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #1e2330 100%)", border: "1.5px solid var(--sb-border)" }}
      >
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Blob */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #10B98115 0%, transparent 70%)" }} />

        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>PROJECT SUBMISSION</span>
            <h1 className="font-display mt-2" style={{ fontSize: "2.6rem", lineHeight: 1, color: "#ffffff" }}>Submit a Project</h1>
            <p className="font-body mt-2" style={{ color: "var(--sb-text-muted)", fontSize: "0.9rem" }}>
              Share your work with the SkillBridge community. Projects are reviewed within 48 hours.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="font-mono text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5"
              style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)", color: "var(--sb-text-muted)", cursor: "pointer" }}
            >
              ← Back to Profile
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Main form fields */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#2563EB22", color: "#2563EB" }}>PROJECT DETAILS</span>

            <div>
              <label style={labelStyle}>Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Real-time Collaboration Board"
                style={inputStyle}
                onFocus={focusGreen}
                onBlur={blurReset}
              />
            </div>

            <div>
              <label style={labelStyle}>Short Description *</label>
              <textarea
                placeholder="Describe what your project does and the problem it solves..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={focusGreen}
                onBlur={blurReset}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label style={labelStyle}>Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  style={inputStyle}
                  onFocus={focusGreen}
                  onBlur={blurReset}
                />
              </div>
              <div>
                <label style={labelStyle}>Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://your-project.vercel.app"
                  style={inputStyle}
                  onFocus={focusGreen}
                  onBlur={blurReset}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Tech Stack *</label>
              <input
                type="text"
                placeholder="React, Node.js, PostgreSQL, Docker..."
                style={inputStyle}
                onFocus={focusGreen}
                onBlur={blurReset}
              />
              <p className="font-mono mt-1.5" style={{ fontSize: "0.6rem", color: "#4b5563" }}>Separate technologies with commas</p>
            </div>

            <div>
              <label style={labelStyle}>Full Project Writeup</label>
              <textarea
                placeholder="Walk us through your approach, architecture decisions, challenges overcome, and what you learned..."
                rows={6}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={focusGreen}
                onBlur={blurReset}
              />
            </div>
          </div>

          {/* Media */}
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#F59E0B22", color: "#F59E0B" }}>MEDIA</span>
            <div
              className="rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
              style={{ border: "2px dashed #2a2f3a", padding: "2.5rem 1rem", background: "var(--sb-card2)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#10B981")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#10B98118", border: "1.5px solid #10B98133" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="font-body text-sm text-white/60">Drop screenshots or drag files here</p>
                <p className="font-mono mt-1" style={{ fontSize: "0.6rem", color: "#4b5563" }}>PNG, JPG, GIF up to 10MB each</p>
              </div>
              <button
                className="font-mono text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-widest"
                style={{ background: "var(--sb-inset)", border: "1.5px solid var(--sb-border2)", color: "var(--sb-text-muted)", cursor: "pointer" }}
              >
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar options */}
        <div className="flex flex-col gap-5">

          {/* Category */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#8B5CF622", color: "#8B5CF6" }}>CATEGORY</span>
            {[
              { label: "Web App", color: "#2563EB" },
              { label: "Mobile App", color: "#10B981" },
              { label: "Data / ML", color: "#F59E0B" },
              { label: "CLI Tool", color: "#DC2626" },
              { label: "Open Source Library", color: "#8B5CF6" },
              { label: "Other", color: "var(--sb-text-muted)" },
            ].map((cat, i) => (
              <label
                key={cat.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                  style={{ border: `2px solid ${i === 0 ? cat.color : "#2a2f3a"}`, background: i === 0 ? cat.color : "transparent" }}
                >
                  {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="font-body text-sm group-hover:text-white transition-colors" style={{ color: i === 0 ? "var(--sb-text)" : "var(--sb-text-muted)" }}>{cat.label}</span>
              </label>
            ))}
          </div>

          {/* Visibility */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#DC262622", color: "#DC2626" }}>VISIBILITY</span>
            {[
              { label: "Public", sub: "Anyone can view", active: true },
              { label: "Squad Only", sub: "Only your squad members", active: false },
            ].map(v => (
              <div
                key={v.label}
                className="rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                style={{ background: v.active ? "#10B98112" : t.inset, border: `1.5px solid ${v.active ? "#10B98144" : t.border}` }}
              >
                <div
                  className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                  style={{ border: `2px solid ${v.active ? "#10B981" : "#2a2f3a"}`, background: v.active ? "#10B981" : "transparent" }}
                >
                  {v.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: t.text }}>{v.label}</div>
                  <div className="font-body text-xs mt-0.5" style={{ color: "var(--sb-text-muted)" }}>{v.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Path tag */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#2563EB22", color: "#2563EB" }}>LINK TO PATH</span>
            <select
              style={{ ...inputStyle, appearance: "none" }}
              onFocus={focusGreen}
              onBlur={blurReset}
            >
              <option value="">— Select a learning path —</option>
              <option>Full-Stack Development</option>
              <option>Data Science & ML</option>
              <option>UX Design</option>
              <option>Cloud Architecture</option>
            </select>
            <p className="font-mono" style={{ fontSize: "0.6rem", color: "#4b5563" }}>Tag this project to earn path XP</p>
          </div>

          {/* Submit button */}
          <ConfettiBtn
            className="font-mono text-sm font-bold text-white w-full py-4 rounded-2xl uppercase tracking-widest"
            color="#10B981"
          >
            Submit Project ✦
          </ConfettiBtn>

          <p className="font-mono text-center" style={{ fontSize: "0.6rem", color: "#4b5563" }}>
            Projects are reviewed by the SkillBridge team within 48 hours. You will receive a notification when approved.
          </p>
        </div>
      </div>
    </div>
  );
}

function PageProfile({ onNavigate }: { onNavigate?: (p: DashPage) => void }) {
  const t = useT();
  const skills = [
    { label: "React", pct: 92, color: "#2563EB" },
    { label: "TypeScript", pct: 78, color: "#10B981" },
    { label: "Node.js", pct: 81, color: "#F59E0B" },
    { label: "SQL", pct: 85, color: "#DC2626" },
    { label: "Python", pct: 55, color: "#8B5CF6" },
    { label: "Docker", pct: 60, color: "#EC4899" },
  ];
  const activity = [
    { action: "Earned 'React Pro' badge", time: "2h ago", icon: "◈", color: "#2563EB" },
    { action: "Completed Module 16 — Node.js & REST APIs", time: "Yesterday", icon: "⟳", color: "#10B981" },
    { action: "Joined DevBridge Alpha squad", time: "2d ago", icon: "⊛", color: "#F59E0B" },
    { action: "Submitted PR #42 for review", time: "3d ago", icon: "◉", color: "#DC2626" },
    { action: "Achieved 14-day learning streak", time: "4d ago", icon: "🔥", color: "#F59E0B" },
    { action: "CV matched with Stripe — 93%", time: "5d ago", icon: "⟐", color: "#10B981" },
  ];
  const badges = [
    { label: "React Pro", color: "#2563EB" },
    { label: "SQL Master", color: "#10B981" },
    { label: "API Builder", color: "#F59E0B" },
    { label: "Git Expert", color: "#DC2626" },
    { label: "CSS Wizard", color: "#8B5CF6" },
    { label: "Docker Basics", color: "#EC4899" },
  ];
  const stats = [
    { v: "4,820", l: "XP Points", c: "#F59E0B" },
    { v: "12", l: "Badges", c: "#10B981" },
    { v: "Level 12", l: "Current Level", c: "#2563EB" },
    { v: "14", l: "Day Streak", c: "#DC2626" },
    { v: "Top 8%", l: "Global Rank", c: "#8B5CF6" },
    { v: "87%", l: "CV Match Score", c: "#10B981" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner */}
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #13161e 0%, #1e2330 60%, #0f1117 100%)", border: "1.5px solid var(--sb-border)" }}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        {/* Accent blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #2563EB18 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #10B98118 0%, transparent 70%)" }} />

        <div className="relative p-8 flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center font-display text-5xl text-white"
              style={{ background: "linear-gradient(135deg, #10B981, #2563EB)", boxShadow: "0 0 32px #10B98155" }}
            >
              J
            </div>
            <div
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{ background: "#10B981", borderColor: "#13161e" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-display" style={{ fontSize: "2.4rem", lineHeight: 1, color: "#ffffff" }}>Jamie Rivera</h1>
              <span className="tag-pill" style={{ background: "#2563EB33", color: "#60a5fa" }}>Pro Member</span>
            </div>
            <p className="font-body text-sm mt-1 mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
              Full-stack learner · ML enthusiast · Building in public · San Francisco, CA
            </p>
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Python", "TypeScript"].map(s => (
                <span key={s} className="tag-pill" style={{ background: "#ffffff12", color: "var(--color-white, #ffffff)", border: "1px solid rgba(255,255,255,0.25)" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              className="font-mono text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.65)" }}
            >
              Edit Profile
            </button>
            <ConfettiBtn
              className="font-mono text-xs font-bold text-white px-4 py-2.5 rounded-xl uppercase tracking-widest"
              color="#2563EB"
            >
              Share Profile
            </ConfettiBtn>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.l} className="rounded-2xl p-4 text-center flex flex-col gap-1"
            style={{ background: "var(--sb-card)", border: `1.5px solid ${s.c}33` }}>
            <div className="font-display leading-none" style={{ fontSize: "1.6rem", color: s.c }}>{s.v}</div>
            <div className="font-mono" style={{ fontSize: "0.6rem", color: t.muted }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* Left: Skills + Badges */}
        <div className="flex flex-col gap-4">
          {/* Skill bars */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#2563EB22", color: "#2563EB" }}>SKILL PROFILE</span>
            {skills.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs font-semibold" style={{ color: t.muted }}>{s.label}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "var(--sb-inset)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#10B98122", color: "#10B981" }}>EARNED BADGES</span>
            <div className="grid grid-cols-3 gap-2">
              {badges.map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 p-2 rounded-xl panel-hover"
                  style={{ background: `${b.color}10`, border: `1px solid ${b.color}33` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: `${b.color}22` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="2">
                      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  </div>
                  <span className="font-body text-center leading-tight" style={{ fontSize: "0.6rem", color: t.muted }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle + Right: Activity + Paths */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {/* Learning path progress */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#F59E0B22", color: "#F59E0B" }}>LEARNING PATHS</span>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { title: "Full-Stack Dev", progress: 68, color: "#2563EB" },
                { title: "Data Science & ML", progress: 34, color: "#10B981" },
                { title: "UX Design", progress: 91, color: "#F59E0B" },
                { title: "Cloud Architecture", progress: 10, color: "#DC2626" },
              ].map(p => (
                <div key={p.title} className="rounded-xl p-3" style={{ background: "var(--sb-card2)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-xs font-semibold" style={{ color: t.muted }}>{p.title}</span>
                    <span className="font-mono text-xs font-bold" style={{ color: p.color }}>{p.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--sb-inset)" }}>
                    <div className="h-2 rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <div className="flex items-center justify-between">
              <span className="tag-pill" style={{ background: "#8B5CF622", color: "#8B5CF6" }}>PROJECTS</span>
              <button
                onClick={() => onNavigate?.("Submit Project")}
                className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg,#10B981,#2563EB)", color: "var(--sb-text)", border: "none", cursor: "pointer" }}
              >
                + Submit Project
              </button>
            </div>
            {[
              { title: "SkillBridge Analytics Dashboard", stack: ["React", "D3.js", "Node.js"], status: "Live", statusColor: "#10B981", stars: 48, desc: "Real-time learning metrics dashboard with interactive charts and XP tracking." },
              { title: "ML Price Predictor", stack: ["Python", "scikit-learn", "FastAPI"], status: "In Review", statusColor: "#F59E0B", stars: 31, desc: "Regression model trained on 50k listings to predict market prices with 94% accuracy." },
              { title: "DevCollab CLI Tool", stack: ["TypeScript", "Node.js", "GitHub API"], status: "Live", statusColor: "#10B981", stars: 22, desc: "Command-line tool for syncing squad tasks and GitHub issues across team repos." },
            ].map((proj, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex flex-col gap-3 panel-hover"
                style={{ background: "var(--sb-card2)", border: "1.5px solid var(--sb-border)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display leading-snug" style={{ fontSize: "1.15rem", color: t.text }}>{proj.title}</h3>
                    <p className="font-body text-xs mt-1 leading-snug" style={{ color: "var(--sb-text-muted)" }}>{proj.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="tag-pill" style={{ background: `${proj.statusColor}18`, color: proj.statusColor, border: `1px solid ${proj.statusColor}44` }}>{proj.status}</span>
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <span className="font-mono text-xs font-bold" style={{ color: "#F59E0B" }}>{proj.stars}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {proj.stack.map(s => (
                    <span key={s} className="tag-pill" style={{ background: t.L ? "#00000008" : "#ffffff08", color: t.muted, border: `1px solid ${t.border}` }}>{s}</span>
                  ))}
                  <button
                    onClick={() => onNavigate?.("Submit Project")}
                    className="ml-auto font-mono text-xs uppercase tracking-widest transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: t.muted }}
                  >
                    Edit →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 flex-1" style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}>
            <span className="tag-pill self-start" style={{ background: "#DC262622", color: "#DC2626" }}>RECENT ACTIVITY</span>
            <div className="flex flex-col gap-0">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < activity.length - 1 ? "1px solid #1e2330" : "none" }}>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                    style={{ background: `${a.color}18`, color: a.color, border: `1px solid ${a.color}33` }}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm leading-snug" style={{ color: t.muted }}>{a.action}</p>
                    <span className="font-mono" style={{ fontSize: "0.65rem", color: t.faint }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DashPage = "Dashboard" | "Learning Paths" | "Skill Badges" | "CV Matching" | "Squad Projects" | "Leaderboard" | "Job Matches" | "Community" | "Profile" | "Submit Project" | "Job Application" | "Settings" | "Marketplace";

function Dashboard({ onBack, onAdmin, initialPage = "Dashboard" }: { onBack: () => void; onAdmin?: () => void; initialPage?: DashPage }) {
  const [activePage, setActivePage] = useState<DashPage>(initialPage);
  const [activePath, setActivePath] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("sb-theme") as ThemeMode | null;
    const initial = (saved === "Light" || saved === "Dark" || saved === "System") ? saved : "Dark";
    applyThemeClass(initial);
    return initial;
  });
  const isLight = theme === "Light";

  useEffect(() => {
    localStorage.setItem("sb-theme", theme);
    applyThemeClass(theme);
  }, [theme]);

  const navLabels: Partial<Record<DashPage, string>> = {
    "CV Matching": "CV Analysis",
  };
  const navItems: { icon: string; label: DashPage }[] = [
    { icon: "⊞", label: "Dashboard" },
    { icon: "⟳", label: "Learning Paths" },
    { icon: "◈", label: "Skill Badges" },
    { icon: "⟐", label: "CV Matching" },
    { icon: "⊛", label: "Squad Projects" },
    { icon: "▦", label: "Leaderboard" },
    { icon: "⬡", label: "Job Matches" },
    { icon: "◫", label: "Marketplace" },
    { icon: "⊕", label: "Community" },
    { icon: "◍", label: "Profile" },
    { icon: "⚙", label: "Settings" },
  ];

  const learningPaths = [
    { title: "Full-Stack Development", progress: 68, total: 24, done: 16, color: "#2563EB", tag: "In Progress" },
    { title: "Data Science & ML", progress: 34, total: 18, done: 6, color: "#10B981", tag: "In Progress" },
    { title: "UX Design Fundamentals", progress: 91, total: 12, done: 11, color: "#F59E0B", tag: "Almost done" },
    { title: "Cloud Architecture", progress: 10, total: 20, done: 2, color: "#DC2626", tag: "Just started" },
  ];

  const squadTasks = [
    { title: "Submit wireframes for CampusLink app", squad: "UX Collective", due: "Today, 11:59 PM", color: "#DC2626", priority: "Urgent", done: false },
    { title: "Review pull request #42 — auth module", squad: "DevBridge Alpha", due: "Tomorrow, 9:00 AM", color: "#F59E0B", priority: "High", done: false },
    { title: "Write API documentation for endpoints", squad: "DevBridge Alpha", due: "Aug 31, 2026", color: "#2563EB", priority: "Normal", done: true },
    { title: "Present ML model demo to the squad", squad: "DataForge Team", due: "Sep 2, 2026", color: "#10B981", priority: "Normal", done: false },
  ];

  const recentBadges = [
    { label: "React Pro", color: "#2563EB" },
    { label: "SQL Master", color: "#10B981" },
    { label: "API Builder", color: "#F59E0B" },
    { label: "Git Expert", color: "#DC2626" },
  ];

  const xpHistory = [42, 78, 55, 90, 67, 110, 88, 130, 95, 145, 120, 160];

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
    <div className={`flex min-h-screen ${isLight ? "theme-light" : "theme-dark"}`} style={{ background: isLight ? "#F5EFE6" : "#0f1117" }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: sidebarOpen ? 220 : 64,
          background: isLight ? "#FFFFFF" : "#13161e",
          borderRight: `1.5px solid ${isLight ? "#D6CBBB" : "#1e2330"}`,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5" style={{ borderBottom: `1.5px solid ${isLight ? "#D6CBBB" : "#1e2330"}` }}>
          <LogoMark size={32} />
          {sidebarOpen && <LogoText size="xl" />}
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map((item) => {
            const isActive = activePage === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActivePage(item.label)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                style={{
                  background: isActive ? "#2563EB18" : "transparent",
                  border: isActive ? "1px solid #2563EB33" : "1px solid transparent",
                  color: isActive ? "#2563EB" : (isLight ? "#6B6560" : "#6b7280"),
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isLight ? "#00000008" : "#ffffff08"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-mono text-xs font-bold uppercase tracking-wider truncate">{navLabels[item.label] ?? item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Switch to Admin View */}
        {onAdmin && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="mx-3 mb-2 flex items-center gap-2.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all"
            style={{
              background: "#DC262612",
              border: "1px solid #DC262633",
              color: "#DC2626",
              cursor: "pointer",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              paddingLeft: sidebarOpen ? 14 : 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#DC262622"; e.currentTarget.style.borderColor = "#DC262655"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#DC262612"; e.currentTarget.style.borderColor = "#DC262633"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {sidebarOpen && <span>Admin View</span>}
          </button>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-3 flex items-center justify-center py-2 rounded-xl font-mono text-xs transition-colors"
          style={{ background: isLight ? "#EDE8DF" : "#1e2330", border: `1px solid ${isLight ? "#D6CBBB" : "#2a2f3a"}`, color: isLight ? "#8a8075" : "rgba(255,255,255,0.3)" }}
        >
          {sidebarOpen ? "← Collapse" : "→"}
        </button>

        {/* User profile bottom */}
        <div className="flex items-center gap-3 p-4" style={{ borderTop: `1.5px solid ${isLight ? "#D6CBBB" : "#1e2330"}` }}>
          <div
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-display text-sm text-white"
            style={{ background: "linear-gradient(135deg, #10B981, #2563EB)" }}
          >
            J
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="font-body text-xs font-semibold truncate" style={{ color: isLight ? "#1A1D24" : "white" }}>Jamie Rivera</div>
              <div className="font-mono text-xs truncate" style={{ color: "#10B981" }}>Level 12 · Pro</div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top header */}
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: isLight ? "#FFFFFF" : "#13161e", borderBottom: `1.5px solid ${isLight ? "#D6CBBB" : "#1e2330"}` }}
        >
          <div>
            <h1 className="font-display leading-tight" style={{ fontSize: "1.8rem", color: isLight ? "#1A1D24" : "white" }}>
              Good morning, <span style={{ color: "#10B981" }}>Jamie</span> 👋
            </h1>
            <p className="font-mono text-xs mt-0.5" style={{ color: isLight ? "rgba(26,29,36,0.4)" : "rgba(255,255,255,0.3)" }}>Saturday, 29 Aug 2026 · Week 35</p>
          </div>

          <div className="flex items-center gap-4">
            {/* XP pill */}
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
              style={{ background: "#F59E0B18", border: "1.5px solid #F59E0B44" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <div>
                <div className="font-display text-lg leading-none" style={{ color: "#F59E0B" }}>4,820</div>
                <div className="font-mono text-xs mt-0.5" style={{ fontSize: 9, color: isLight ? "rgba(26,29,36,0.4)" : "rgba(255,255,255,0.3)" }}>XP POINTS</div>
              </div>
            </div>

            {/* Streak */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#DC262618", border: "1.5px solid #DC262633" }}
            >
              <span className="text-base">🔥</span>
              <div>
                <div className="font-display text-lg leading-none" style={{ color: "#DC2626" }}>14</div>
                <div className="font-mono" style={{ fontSize: 9, color: isLight ? "rgba(26,29,36,0.4)" : "rgba(255,255,255,0.3)" }}>DAY STREAK</div>
              </div>
            </div>

            {/* Notification */}
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
              style={{ background: isLight ? "#EDE8DF" : "#1e2330", border: `1.5px solid ${isLight ? "#D6CBBB" : "#2a2f3a"}`, color: isLight ? "#8a8075" : "rgba(255,255,255,0.4)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
            </button>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display text-white text-lg cursor-pointer"
              style={{ background: "linear-gradient(135deg, #10B981, #2563EB)" }}
            >
              J
            </div>

            {/* Back to site */}
            <button
              onClick={onBack}
              className="font-mono text-xs text-white/30 hover:text-white transition-colors px-3 py-2 rounded-xl uppercase tracking-widest"
              style={{ background: "var(--sb-inset)", border: "1px solid var(--sb-border2)" }}
            >
              ← Site
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", background: isLight ? "#F5EFE6" : "#0f1117" }}>
          {activePage === "Learning Paths" && <div className="max-w-6xl mx-auto"><PageLearningPaths /></div>}
          {activePage === "Skill Badges"   && <div className="max-w-6xl mx-auto"><PageSkillBadges /></div>}
          {activePage === "CV Matching"    && <div className="max-w-6xl mx-auto"><PageCVMatching onNavigate={setActivePage} /></div>}
          {activePage === "Squad Projects" && <div className="max-w-6xl mx-auto"><PageSquadProjects /></div>}
          {activePage === "Leaderboard"    && <div className="max-w-6xl mx-auto"><PageLeaderboard /></div>}
          {activePage === "Job Matches"    && <div className="max-w-6xl mx-auto"><PageJobMatches onNavigate={setActivePage} /></div>}
          {activePage === "Job Application" && <div className="max-w-4xl mx-auto"><PageJobApplication onBack={() => setActivePage("Job Matches")} /></div>}
          {activePage === "Marketplace"    && <div className="max-w-7xl mx-auto"><PageMarketplace /></div>}
          {activePage === "Community"      && <div className="max-w-6xl mx-auto"><PageCommunity /></div>}
          {activePage === "Profile"        && <div className="max-w-6xl mx-auto"><PageProfile onNavigate={setActivePage} /></div>}
          {activePage === "Submit Project" && <div className="max-w-5xl mx-auto"><PageSubmitProject onBack={() => setActivePage("Profile")} /></div>}
          {activePage === "Settings"       && <div className="max-w-4xl mx-auto"><PageSettings onAdmin={onAdmin ? () => setShowAdminModal(true) : undefined} /></div>}
          {activePage === "Dashboard" && <div className="max-w-6xl mx-auto flex flex-col gap-6">

            {/* ── Row 1: CV Gauge + XP chart + Badges ── */}
            <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1.5fr 1fr" }}>

              {/* CV Gauge */}
              <div
                className="rounded-2xl p-5 flex flex-col"
                style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>CV MATCHING</span>
                  <span className="font-mono text-xs text-white/30">Updated today</span>
                </div>
                <CVGauge score={87} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: "Skills matched", val: "14/18", color: "#10B981" },
                    { label: "Jobs available", val: "342", color: "#2563EB" },
                    { label: "Top match", val: "Stripe", color: "#F59E0B" },
                    { label: "Salary range", val: "$95K+", color: "#DC2626" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-2.5" style={{ background: "var(--sb-card2)" }}>
                      <div className="font-display text-lg leading-tight" style={{ color: s.color }}>{s.val}</div>
                      <div className="font-mono text-white/30" style={{ fontSize: 9 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* XP Sparkline */}
              <div
                className="rounded-2xl p-5 flex flex-col"
                style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="tag-pill" style={{ background: "#F59E0B22", color: "#F59E0B" }}>XP HISTORY</span>
                  <span className="font-mono text-xs text-white/30">Last 12 sessions</span>
                </div>
                <div className="flex items-end gap-2 mt-auto pt-4 h-28">
                  {xpHistory.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        className="w-full rounded-t-md transition-all group-hover:opacity-100"
                        style={{
                          height: `${(v / 160) * 96}px`,
                          background: i === xpHistory.length - 1
                            ? "linear-gradient(180deg, #F59E0B, #DC2626)"
                            : `rgba(245,158,11,${0.25 + (i / xpHistory.length) * 0.5})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="font-display text-2xl text-white">+160 XP</div>
                    <div className="font-mono text-xs text-white/30">last session</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl" style={{ color: "#10B981" }}>+38%</div>
                    <div className="font-mono text-xs text-white/30">vs last week</div>
                  </div>
                </div>
              </div>

              {/* Recent badges */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
              >
                <span className="tag-pill" style={{ background: "#10B98122", color: "#10B981" }}>SKILL BADGES</span>
                <div className="flex flex-col gap-2 flex-1">
                  {recentBadges.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: `${b.color}12`, border: `1px solid ${b.color}33` }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${b.color}22` }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={b.color} strokeWidth="2.5">
                          <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                        </svg>
                      </div>
                      <span className="font-body text-sm text-white font-semibold">{b.label}</span>
                      <span className="ml-auto tag-pill" style={{ background: `${b.color}22`, color: b.color, fontSize: 9 }}>Verified</span>
                    </div>
                  ))}
                </div>
                <ConfettiBtn
                  className="font-mono text-xs font-bold text-white w-full py-2 rounded-xl uppercase tracking-widest"
                  color="#10B981"
                >
                  View all 12 →
                </ConfettiBtn>
              </div>
            </div>

            {/* ── Row 2: Learning Paths ── */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>ACTIVE LEARNING PATHS</span>
                  <h2 className="font-display text-white mt-1" style={{ fontSize: "1.6rem" }}>Your Progress</h2>
                </div>
                <ConfettiBtn
                  className="font-mono text-xs font-bold text-white px-4 py-2 rounded-xl uppercase tracking-widest"
                  color="#2563EB"
                >
                  + Add Path
                </ConfettiBtn>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {learningPaths.map((p) => (
                  <div
                    key={p.title}
                    className="panel-hover rounded-2xl p-4 cursor-pointer"
                    style={{
                      background: activePath === p.title ? `${p.color}12` : (isLight ? "#F0E8D8" : "#0f1117"),
                      border: `1.5px solid ${activePath === p.title ? p.color + "55" : "#1e2330"}`,
                    }}
                    onClick={() => setActivePath(activePath === p.title ? null : p.title)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="tag-pill" style={{ background: `${p.color}22`, color: p.color }}>{p.tag}</span>
                        <h3 className="font-display mt-2" style={{ fontSize: "1.2rem", color: isLight ? "#1A1D24" : "#ffffff" }}>{p.title}</h3>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display"
                        style={{
                          background: `conic-gradient(${p.color} ${p.progress * 3.6}deg, #1e2330 0deg)`,
                          fontSize: "0.7rem",
                          color: "var(--sb-text)",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                          style={{ background: "var(--sb-card2)", color: p.color }}
                        >
                          {p.progress}%
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 rounded-full mb-2" style={{ background: "var(--sb-inset)" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${p.progress}%`, background: p.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs" style={{ color: isLight ? "#52504B" : "rgba(255,255,255,0.4)" }}>{p.done} of {p.total} modules complete</span>
                      <span className="font-mono text-xs font-bold" style={{ color: p.color }}>{p.total - p.done} left</span>
                    </div>

                    {/* Expanded module list */}
                    {activePath === p.title && (
                      <div className="mt-3 pt-3 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${p.color}33` }}>
                        {["Intro & Setup", "Core Concepts", "Advanced Patterns", "Final Project"].map((m, mi) => (
                          <div key={m} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: mi < Math.round(p.done / p.total * 4) ? p.color : "#1e2330" }}
                            >
                              {mi < Math.round(p.done / p.total * 4) && (
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                              )}
                            </div>
                            <span className="font-body text-xs text-white/50">{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Row 3: Squad Tasks + Leaderboard ── */}
            <div className="grid gap-6 md:grid-cols-3">

              {/* Squad Tasks */}
              <div
                className="md:col-span-2 rounded-2xl p-6"
                style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="tag-pill" style={{ background: "#DC262622", color: "#DC2626" }}>UPCOMING SQUAD TASKS</span>
                    <h2 className="font-display text-white mt-1" style={{ fontSize: "1.6rem" }}>Due Soon</h2>
                  </div>
                  <span className="font-mono text-xs text-white/30">3 pending</span>
                </div>
                <div className="flex flex-col gap-3">
                  {squadTasks.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 px-4 py-3.5 rounded-2xl transition-all"
                      style={{
                        background: t.done ? (isLight ? "#00000008" : "#ffffff05") : (isLight ? "#F0E8D8" : "#0f1117"),
                        border: `1.5px solid ${t.done ? (isLight ? "#D4C4A8" : "#1e2330") : t.color + "33"}`,
                        opacity: t.done ? 0.5 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                          background: t.done ? t.color : "transparent",
                          border: `2px solid ${t.color}`,
                        }}
                      >
                        {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-body text-sm font-semibold"
                          style={{ textDecoration: t.done ? "line-through" : "none", color: isLight ? "#1A1D24" : "#ffffff" }}
                        >
                          {t.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="font-mono text-xs" style={{ color: isLight ? "#52504B" : "rgba(255,255,255,0.4)" }}>{t.squad}</span>
                          <span className="font-mono text-xs" style={{ color: t.color }}>⏰ {t.due}</span>
                        </div>
                      </div>

                      <span
                        className="tag-pill shrink-0"
                        style={{ background: `${t.color}22`, color: t.color }}
                      >
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full mt-4 py-2.5 rounded-xl font-mono text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest"
                  style={{ background: "var(--sb-card2)", border: "1px dashed #1e2330" }}
                >
                  + Add new task
                </button>
              </div>

              {/* Mini leaderboard */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: "var(--sb-card)", border: "1.5px solid var(--sb-border)" }}
              >
                <div>
                  <span className="tag-pill" style={{ background: "#F59E0B22", color: "#F59E0B" }}>LEADERBOARD</span>
                  <h2 className="font-display text-white mt-1" style={{ fontSize: "1.4rem" }}>This Week</h2>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  {[
                    { rank: 1, name: "Priya S.", pts: "9,842", country: "🇮🇳", you: false },
                    { rank: 2, name: "Marcus L.", pts: "9,210", country: "🇧🇷", you: false },
                    { rank: 3, name: "Jamie R.", pts: "8,994", country: "🇺🇸", you: true },
                    { rank: 4, name: "Amina K.", pts: "8,340", country: "🇳🇬", you: false },
                    { rank: 5, name: "Jonas R.", pts: "7,900", country: "🇩🇪", you: false },
                  ].map((l) => {
                    const rankColors: Record<number, string> = { 1: "#F59E0B", 2: "#9ca3af", 3: "#cd7f32" };
                    const c = rankColors[l.rank] ?? "#4b5563";
                    return (
                      <div
                        key={l.rank}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                        style={{
                          background: l.you ? "#2563EB18" : (isLight ? "#F0E8D8" : "#0f1117"),
                          border: l.you ? "1px solid #2563EB44" : "1px solid transparent",
                        }}
                      >
                        <span className="font-display text-base w-5 text-center shrink-0" style={{ color: c }}>{l.rank}</span>
                        <span className="font-body text-xs flex-1 truncate" style={{ color: isLight ? "#1A1D24" : "rgba(255,255,255,0.8)" }}>
                          {l.name} {l.country} {l.you && <span style={{ color: "#2563EB" }}>(you)</span>}
                        </span>
                        <span className="font-mono text-xs font-bold shrink-0" style={{ color: c }}>{l.pts}</span>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: "#2563EB12", border: "1px solid #2563EB33" }}
                >
                  <span className="font-mono text-xs" style={{ color: isLight ? "#52504B" : "rgba(255,255,255,0.5)" }}>Rank up needed</span>
                  <span className="font-display text-lg" style={{ color: "#2563EB" }}>+216 XP</span>
                </div>
              </div>
            </div>

          </div>}
        </div>
      </div>
    </div>
    {showAdminModal && (
      <AdminLoginModal
        onAuth={() => { setShowAdminModal(false); onAdmin?.(); }}
        onClose={() => setShowAdminModal(false)}
      />
    )}
    </ThemeCtx.Provider>
  );
}

/* ─── Admin Login Modal ─── */
function AdminLoginModal({ onAuth, onClose }: { onAuth: () => void; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function close() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) close(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
    >
      {/* Radial glow behind panel */}
      <div style={{ position: "absolute", width: 520, height: 320, background: "radial-gradient(ellipse, #DC262618 0%, transparent 70%)", pointerEvents: "none" }} />

      <div
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: 420,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          style={{
            position: "absolute", top: -12, right: -12, zIndex: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "#1e2330", border: "1.5px solid #2a2f3a",
            color: "#6b7280", fontSize: "1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#DC2626"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#2a2f3a"; }}
        >
          ×
        </button>

        {/* Card */}
        <div style={{
          background: "#13161e",
          border: "2px solid #DC262644",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px #DC262622",
        }}>
          {/* Top accent bar — halftone pop-art stripe */}
          <div style={{ height: 6, background: "repeating-linear-gradient(90deg, #DC2626 0px, #DC2626 8px, #0f1117 8px, #0f1117 14px)" }} />

          {/* Grid background watermark */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
            backgroundImage: "linear-gradient(#1e233008 1px, transparent 1px), linear-gradient(90deg, #1e233008 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />

          <div style={{ position: "relative", padding: "32px 32px 28px" }}>
            {/* Header */}
            <div className="flex flex-col items-center mb-7">
              {/* Icon with pixel corners */}
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: "linear-gradient(135deg, #DC262618, #DC262630)",
                  border: "2px solid #DC262655",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 4px #DC262610, 0 0 30px #DC262633",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                {/* Pixel corner accents */}
                {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(p => (
                  <div key={p} className={`absolute ${p} w-2 h-2`} style={{ background: "#DC2626", borderRadius: 1, opacity: 0.6 }} />
                ))}
              </div>

              {/* Restricted badge */}
              <div className="font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
                style={{ background: "#DC262618", color: "#DC2626", border: "1px solid #DC262633", letterSpacing: "0.22em", fontSize: "0.6rem" }}>
                ⚠ Restricted Access
              </div>

              <h2 className="font-display font-bold text-center" style={{ fontSize: "1.7rem", color: "#ffffff", lineHeight: 1.1, margin: 0 }}>
                Admin Portal
              </h2>
              <p className="font-mono text-xs mt-1 text-center" style={{ color: "#4b5563" }}>
                SkillBridge · Platform Control Center
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #DC262633, transparent)", marginBottom: 24 }} />

            {/* Form */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "#6b7280", letterSpacing: "0.14em" }}>
                  Admin ID
                </label>
                <input
                  autoFocus
                  defaultValue=""
                  placeholder="admin"
                  className="rounded-xl px-4 py-3 font-mono text-sm w-full outline-none"
                  style={{ background: "#0f1117", border: "1.5px solid #2a2f3a", color: "#ffffff", transition: "border-color 0.18s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#DC2626")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "#6b7280", letterSpacing: "0.14em" }}>
                  Password
                </label>
                <input
                  type="password"
                  defaultValue=""
                  placeholder="••••••••••••"
                  className="rounded-xl px-4 py-3 font-mono text-sm w-full outline-none"
                  style={{ background: "#0f1117", border: "1.5px solid #2a2f3a", color: "#ffffff", transition: "border-color 0.18s" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#DC2626")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#2a2f3a")}
                />
              </div>

              <button
                type="button"
                onClick={() => { setVisible(false); setTimeout(onAuth, 220); }}
                className="w-full py-3.5 rounded-xl font-mono text-sm font-bold uppercase tracking-widest mt-1"
                style={{ background: "#DC2626", color: "#ffffff", border: "none", cursor: "pointer", letterSpacing: "0.14em", boxShadow: "0 6px 24px #DC262644", transition: "opacity 0.15s, transform 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Authenticate →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard ─── */
function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "jobs" | "analytics">("overview");
  const [userSearch, setUserSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All");
  const [actionToast, setActionToast] = useState("");

  function toast(msg: string) {
    setActionToast(msg);
    setTimeout(() => setActionToast(""), 2800);
  }

  /* ── Metric data ── */
  const metrics = [
    { label: "Total Students", value: "12,847", delta: "+284 this week", icon: "👥", accent: "#2563EB", glow: "#2563EB" },
    { label: "Active Study Guilds", value: "318", delta: "+12 new guilds", icon: "⊕", accent: "#10B981", glow: "#10B981" },
    { label: "Pending Job Postings", value: "47", delta: "Needs review", icon: "⟐", accent: "#F59E0B", glow: "#F59E0B" },
    { label: "System Health", value: "99.8%", delta: "All systems nominal", icon: "◉", accent: "#10B981", glow: "#10B981" },
  ];

  /* ── Users table ── */
  const [users, setUsers] = useState([
    { id: 1, name: "Priya Sharma", email: "priya@example.com", type: "Student", status: "Active", joined: "Jan 12, 2026", reports: 0, flag: false },
    { id: 2, name: "Marcus Lee", email: "marcus@example.com", type: "Mentor", status: "Pending", joined: "Feb 3, 2026", reports: 0, flag: false },
    { id: 3, name: "Aisha Okonkwo", email: "aisha@example.com", type: "Student", status: "Active", joined: "Mar 8, 2026", reports: 2, flag: true },
    { id: 4, name: "Devon Cho", email: "devon@example.com", type: "Student", status: "Suspended", joined: "Nov 22, 2025", reports: 5, flag: true },
    { id: 5, name: "Lena Müller", email: "lena@example.com", type: "Mentor", status: "Active", joined: "Dec 1, 2025", reports: 0, flag: false },
    { id: 6, name: "Raj Patel", email: "raj@example.com", type: "Student", status: "Pending", joined: "Aug 14, 2026", reports: 0, flag: false },
    { id: 7, name: "Chloe Bennet", email: "chloe@example.com", type: "Student", status: "Active", joined: "Jul 2, 2026", reports: 1, flag: true },
  ]);

  /* ── Community posts flagged ── */
  const [posts, setPosts] = useState([
    { id: 1, author: "Devon Cho", content: "Spam: Buy crypto signals here! 🚀🚀", reason: "Spam", reported: "2h ago", status: "Pending" },
    { id: 2, author: "Aisha Okonkwo", content: "This platform is garbage and the admins...", reason: "Harassment", reported: "5h ago", status: "Pending" },
    { id: 3, author: "Anonymous", content: "Sharing pirated course materials from...", reason: "Copyright", reported: "1d ago", status: "Pending" },
  ]);

  /* ── Job approval queue ── */
  const [jobs, setJobs] = useState([
    { id: 1, title: "Senior React Engineer", co: "StreamlineAI", coInitials: "SA", loc: "Remote", type: "Full-Time", salary: "$140K–$170K", submitted: "3h ago", status: "Pending", tags: ["React", "TypeScript", "GraphQL"] },
    { id: 2, title: "ML Ops Engineer", co: "NeuralPath Labs", coInitials: "NP", loc: "London / Remote", type: "Full-Time", salary: "$120K–$145K", submitted: "6h ago", status: "Pending", tags: ["Python", "Kubernetes", "MLflow"] },
    { id: 3, title: "UX Research Intern", co: "FigmaFlow", coInitials: "FF", loc: "San Francisco", type: "Internship", salary: "$28/hr", submitted: "1d ago", status: "Pending", tags: ["UX Research", "Figma", "Usability"] },
    { id: 4, title: "Backend Developer", co: "CloudCore Inc.", coInitials: "CC", loc: "New York", type: "Contract", salary: "$95K–$115K", submitted: "2d ago", status: "Approved", tags: ["Node.js", "PostgreSQL", "AWS"] },
    { id: 5, title: "Crypto Trading Bot Dev", co: "UnverifiedCo", coInitials: "UC", loc: "Remote", type: "Freelance", salary: "Undisclosed", submitted: "2d ago", status: "Rejected", tags: ["Python", "Crypto", "Bots"] },
  ]);

  /* ── Activity log ── */
  const activityLog = [
    { time: "10:42 AM", event: "User Devon Cho suspended for repeated violations", type: "warn" },
    { time: "09:15 AM", event: "Job posting #204 approved — CloudCore Inc.", type: "ok" },
    { time: "08:50 AM", event: "New mentor application received — Raj Patel", type: "info" },
    { time: "Yesterday", event: "Job posting #198 rejected — UnverifiedCo (policy violation)", type: "err" },
    { time: "Yesterday", event: "System backup completed successfully", type: "ok" },
    { time: "Aug 31", event: "Community report resolved — copyright post removed", type: "ok" },
    { time: "Aug 31", event: "Platform maintenance window: 2:00–3:00 AM UTC", type: "info" },
    { time: "Aug 30", event: "500 new student registrations milestone reached", type: "ok" },
  ];

  /* ── Engagement chart data ── */
  const engagementWeeks = ["Wk 30", "Wk 31", "Wk 32", "Wk 33", "Wk 34", "Wk 35"];
  const engagementValues = [310, 420, 388, 512, 476, 594];
  const engMax = Math.max(...engagementValues);

  const filteredJobs = jobFilter === "All" ? jobs : jobs.filter(j => j.status === jobFilter);
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const navItems = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "users", label: "Users & Content", icon: "◍" },
    { id: "jobs", label: "Job Queue", icon: "⟐" },
    { id: "analytics", label: "Analytics", icon: "▦" },
  ] as const;

  const statusColor: Record<string, string> = {
    Active: "#10B981", Pending: "#F59E0B", Suspended: "#DC2626",
    Approved: "#10B981", Rejected: "#DC2626",
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0f1117", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Toast */}
      {actionToast && (
        <div className="fixed top-5 right-5 z-50 rounded-xl px-5 py-3 font-mono text-sm font-bold"
          style={{ background: "#10B981", color: "#fff", boxShadow: "0 8px 30px #10B98144", animation: "bob 0.3s ease" }}>
          ✓ {actionToast}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col" style={{ background: "#13161e", borderRight: "1.5px solid #1e2330", minHeight: "100vh" }}>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3" style={{ borderBottom: "1.5px solid #1e2330" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DC262618", border: "1.5px solid #DC262644" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-sm" style={{ color: "#ffffff" }}>Admin Panel</div>
            <div className="font-mono text-xs" style={{ color: "#DC2626", letterSpacing: "0.1em" }}>RESTRICTED</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map(item => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{
                  background: active ? "#DC262618" : "transparent",
                  border: active ? "1px solid #DC262633" : "1px solid transparent",
                  cursor: "pointer",
                }}
              >
                <span className="font-mono text-sm" style={{ color: active ? "#DC2626" : "#4b5563" }}>{item.icon}</span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: active ? "#ffffff" : "#6b7280" }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4" style={{ borderTop: "1.5px solid #1e2330" }}>
          <div className="font-mono text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4b5563" }}>Quick Actions</div>
          {[
            { label: "Send Announcement", icon: "📢", accent: "#2563EB" },
            { label: "Export User Data", icon: "⬇", accent: "#10B981" },
            { label: "Backup Database", icon: "◉", accent: "#F59E0B" },
            { label: "Clear Cache", icon: "⟳", accent: "#8B5CF6" },
          ].map(a => (
            <button key={a.label} onClick={() => toast(`${a.label} initiated`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1.5 text-left"
              style={{ background: "transparent", border: "1px solid #1e2330", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1e2330"; e.currentTarget.style.borderColor = a.accent + "44"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#1e2330"; }}
            >
              <span style={{ fontSize: "0.85rem" }}>{a.icon}</span>
              <span className="font-body text-xs" style={{ color: "#9ca3af" }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Back */}
        <button onClick={onBack} className="mx-4 mb-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest"
          style={{ background: "#1e2330", border: "1px solid #2a2f3a", color: "#6b7280", cursor: "pointer", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
        >
          ← Exit Admin
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: "1.5px solid #1e2330", background: "#13161e" }}>
          <div>
            <div className="font-display font-bold text-lg" style={{ color: "#ffffff" }}>
              {navItems.find(n => n.id === activeSection)?.label}
            </div>
            <div className="font-mono text-xs" style={{ color: "#4b5563" }}>SkillBridge Admin · {new Date().toDateString()}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#10B98118", border: "1px solid #10B98133" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981", animation: "sb-blink 2s ease infinite" }} />
              <span className="font-mono text-xs font-bold" style={{ color: "#10B981" }}>LIVE</span>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: "#DC262618", color: "#DC2626", border: "1.5px solid #DC262633" }}>A</div>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">

          {/* ══ OVERVIEW ══ */}
          {activeSection === "overview" && <>

            {/* Metric cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {metrics.map(m => (
                <div key={m.label} className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{ background: "#13161e", border: `1.5px solid ${m.accent}33`, boxShadow: `0 0 20px ${m.accent}0d` }}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: `${m.accent}18`, border: `1px solid ${m.accent}33` }}>
                      {m.icon}
                    </div>
                    <div className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: `${m.accent}14`, color: m.accent }}>↑</div>
                  </div>
                  <div>
                    <div className="font-display font-bold" style={{ fontSize: "1.9rem", color: m.accent, lineHeight: 1 }}>{m.value}</div>
                    <div className="font-body text-xs mt-1" style={{ color: "#6b7280" }}>{m.label}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: m.accent, opacity: 0.7 }}>{m.delta}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Engagement mini-chart + recent log side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Engagement bar chart */}
              <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-base" style={{ color: "#ffffff" }}>Weekly Active Users</div>
                    <div className="font-mono text-xs" style={{ color: "#4b5563" }}>Platform engagement · last 6 weeks</div>
                  </div>
                  <div className="font-display font-bold text-xl" style={{ color: "#2563EB" }}>+24%</div>
                </div>
                <div className="flex items-end gap-3" style={{ height: 120 }}>
                  {engagementWeeks.map((wk, i) => {
                    const pct = (engagementValues[i] / engMax) * 100;
                    const isLast = i === engagementWeeks.length - 1;
                    return (
                      <div key={wk} className="flex flex-col items-center gap-1.5 flex-1">
                        <div className="font-mono text-xs" style={{ color: isLast ? "#2563EB" : "#4b5563", fontSize: "0.55rem" }}>{engagementValues[i]}</div>
                        <div className="w-full rounded-t-lg transition-all" style={{
                          height: `${pct}%`,
                          background: isLast ? "#2563EB" : "#1e2330",
                          border: `1px solid ${isLast ? "#2563EB" : "#2a2f3a"}`,
                          boxShadow: isLast ? "0 0 12px #2563EB55" : "none",
                          minHeight: 8,
                        }} />
                        <div className="font-mono text-xs" style={{ color: "#4b5563", fontSize: "0.55rem" }}>{wk}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity log */}
              <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                <div className="font-display font-bold text-base mb-1" style={{ color: "#ffffff" }}>Recent Activity Log</div>
                <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 180 }}>
                  {activityLog.slice(0, 6).map((log, i) => {
                    const dot = log.type === "ok" ? "#10B981" : log.type === "err" ? "#DC2626" : log.type === "warn" ? "#F59E0B" : "#2563EB";
                    return (
                      <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: i < 5 ? "1px solid #1e2330" : "none" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-body text-xs leading-snug" style={{ color: "#d1d5db" }}>{log.event}</div>
                          <div className="font-mono" style={{ fontSize: "0.6rem", color: "#4b5563", marginTop: 2 }}>{log.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Platform stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Skill Badges Issued", val: "89,412", color: "#8B5CF6" },
                { label: "Projects Submitted", val: "4,231", color: "#10B981" },
                { label: "CV Analyses Run", val: "28,840", color: "#2563EB" },
                { label: "Avg Session (min)", val: "34.7", color: "#F59E0B" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 flex flex-col gap-1" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                  <div className="font-display font-bold" style={{ fontSize: "1.5rem", color: s.color }}>{s.val}</div>
                  <div className="font-mono text-xs" style={{ color: "#4b5563" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>}

          {/* ══ USERS & CONTENT ══ */}
          {activeSection === "users" && <div className="flex flex-col gap-6">

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search by name or email…"
                  className="w-full rounded-xl pl-9 pr-4 py-3 font-body text-sm outline-none"
                  style={{ background: "#13161e", border: "1.5px solid #1e2330", color: "#ffffff" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e2330")}
                />
              </div>
              <span className="font-mono text-xs" style={{ color: "#4b5563" }}>{filteredUsers.length} records</span>
            </div>

            {/* User table */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid #1e2330" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#1e2330" }}>
                    {["User", "Type", "Status", "Joined", "Reports", "Actions"].map(h => (
                      <th key={h} className="font-mono text-xs font-bold uppercase tracking-widest text-left px-5 py-3.5"
                        style={{ color: "#4b5563", borderBottom: "1px solid #2a2f3a", letterSpacing: "0.1em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ background: i % 2 === 0 ? "#13161e" : "#0f1117", borderBottom: "1px solid #1e2330" }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
                            style={{ background: u.flag ? "#DC262618" : "#2563EB18", color: u.flag ? "#DC2626" : "#2563EB", border: `1px solid ${u.flag ? "#DC262633" : "#2563EB33"}` }}>
                            {u.name[0]}
                          </div>
                          <div>
                            <div className="font-body text-sm font-semibold flex items-center gap-1.5" style={{ color: "#ffffff" }}>
                              {u.name}
                              {u.flag && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#DC2626" }} />}
                            </div>
                            <div className="font-mono" style={{ fontSize: "0.65rem", color: "#4b5563" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: u.type === "Mentor" ? "#8B5CF618" : "#2563EB18", color: u.type === "Mentor" ? "#8B5CF6" : "#2563EB" }}>
                          {u.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: `${statusColor[u.status]}18`, color: statusColor[u.status] }}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#6b7280" }}>{u.joined}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold" style={{ color: u.reports > 0 ? "#F59E0B" : "#4b5563" }}>{u.reports}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {u.status !== "Active" && (
                            <button onClick={() => { setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: "Active", flag: false } : x)); toast(`${u.name} approved`); }}
                              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                              style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133", cursor: "pointer" }}>
                              Approve
                            </button>
                          )}
                          {u.status !== "Suspended" && (
                            <button onClick={() => { setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: "Suspended", flag: true } : x)); toast(`${u.name} suspended`); }}
                              className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                              style={{ background: "#F59E0B18", color: "#F59E0B", border: "1px solid #F59E0B33", cursor: "pointer" }}>
                              Suspend
                            </button>
                          )}
                          <button onClick={() => { setUsers(prev => prev.filter(x => x.id !== u.id)); toast(`${u.name} deleted`); }}
                            className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ background: "#DC262618", color: "#DC2626", border: "1px solid #DC262633", cursor: "pointer" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Flagged posts */}
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#13161e", border: "1.5px solid #DC262622" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
                <div className="font-display font-bold text-base" style={{ color: "#ffffff" }}>Reported Community Posts</div>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: "#DC262618", color: "#DC2626" }}>{posts.filter(p => p.status === "Pending").length} pending</span>
              </div>
              {posts.length === 0 && (
                <div className="text-center py-6 font-mono text-xs" style={{ color: "#4b5563" }}>No reported posts — queue clear ✓</div>
              )}
              {posts.map(p => (
                <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl p-4"
                  style={{ background: "#0f1117", border: "1px solid #2a2f3a" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-mono text-xs font-bold" style={{ color: "#DC2626" }}>#{p.reason}</span>
                      <span className="font-body text-xs" style={{ color: "#6b7280" }}>reported by community · {p.reported}</span>
                    </div>
                    <div className="font-body text-sm" style={{ color: "#d1d5db" }}>
                      <span className="font-semibold" style={{ color: "#ffffff" }}>{p.author}:</span> {p.content}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setPosts(prev => prev.filter(x => x.id !== p.id)); toast("Post dismissed"); }}
                      className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133", cursor: "pointer" }}>
                      Dismiss
                    </button>
                    <button onClick={() => { setPosts(prev => prev.filter(x => x.id !== p.id)); toast("Post removed"); }}
                      className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ background: "#DC262618", color: "#DC2626", border: "1px solid #DC262633", cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {/* ══ JOB QUEUE ══ */}
          {activeSection === "jobs" && <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Pending", "Approved", "Rejected"].map(f => (
                <button key={f} onClick={() => setJobFilter(f)}
                  className="font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl"
                  style={{
                    background: jobFilter === f ? "#2563EB" : "#13161e",
                    color: jobFilter === f ? "#ffffff" : "#6b7280",
                    border: `1.5px solid ${jobFilter === f ? "#2563EB" : "#1e2330"}`,
                    cursor: "pointer",
                  }}>
                  {f}
                  {f === "Pending" && <span className="ml-1.5 inline-block w-4 h-4 rounded-full text-center leading-4" style={{ background: "#F59E0B", color: "#0f1117", fontSize: "0.6rem" }}>{jobs.filter(j => j.status === "Pending").length}</span>}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {filteredJobs.map(j => (
                <div key={j.id} className="rounded-2xl p-6 flex items-start gap-5"
                  style={{ background: "#13161e", border: `1.5px solid ${j.status === "Approved" ? "#10B98133" : j.status === "Rejected" ? "#DC262633" : "#1e2330"}` }}>
                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: "#2563EB18", color: "#2563EB", border: "1.5px solid #2563EB33" }}>
                    {j.coInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-display font-bold text-base" style={{ color: "#ffffff" }}>{j.title}</div>
                        <div className="font-body text-sm mt-0.5" style={{ color: "#6b7280" }}>{j.co} · {j.loc} · {j.type}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: `${statusColor[j.status]}18`, color: statusColor[j.status] }}>
                          {j.status}
                        </span>
                        <span className="font-mono text-xs" style={{ color: "#4b5563" }}>{j.submitted}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {j.tags.map(t => (
                        <span key={t} className="font-mono text-xs px-2.5 py-1 rounded-lg" style={{ background: "#1e2330", color: "#6b7280" }}>{t}</span>
                      ))}
                      <span className="font-display font-bold text-sm ml-auto" style={{ color: "#10B981" }}>{j.salary}</span>
                    </div>
                    {j.status === "Pending" && (
                      <div className="flex gap-3 mt-4">
                        <button onClick={() => { setJobs(prev => prev.map(x => x.id === j.id ? { ...x, status: "Approved" } : x)); toast(`"${j.title}" approved`); }}
                          className="font-mono text-xs font-bold px-5 py-2.5 rounded-xl"
                          style={{ background: "#10B981", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 14px #10B98133", transition: "opacity 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                          ✓ Approve Listing
                        </button>
                        <button onClick={() => { setJobs(prev => prev.map(x => x.id === j.id ? { ...x, status: "Rejected" } : x)); toast(`"${j.title}" rejected`); }}
                          className="font-mono text-xs font-bold px-5 py-2.5 rounded-xl"
                          style={{ background: "#DC262618", color: "#DC2626", border: "1.5px solid #DC262633", cursor: "pointer", transition: "opacity 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="rounded-2xl p-12 text-center" style={{ background: "#13161e", border: "1.5px dashed #2a2f3a" }}>
                  <div className="font-mono text-xs" style={{ color: "#4b5563" }}>No listings in this queue ✓</div>
                </div>
              )}
            </div>
          </div>}

          {/* ══ ANALYTICS ══ */}
          {activeSection === "analytics" && <div className="flex flex-col gap-6">

            {/* Trend bars — full width */}
            <div className="rounded-2xl p-7 flex flex-col gap-5" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-bold text-lg" style={{ color: "#ffffff" }}>Platform Engagement Trend</div>
                  <div className="font-mono text-xs" style={{ color: "#4b5563" }}>Weekly active users · last 6 weeks</div>
                </div>
                <div className="flex items-center gap-4">
                  {[["#2563EB", "Active Users"], ["#10B981", "Completions"]].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                      <span className="font-mono text-xs" style={{ color: "#6b7280" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-4" style={{ height: 160 }}>
                {engagementWeeks.map((wk, i) => {
                  const pct = (engagementValues[i] / engMax) * 100;
                  const cPct = pct * 0.62;
                  const isLast = i === engagementWeeks.length - 1;
                  return (
                    <div key={wk} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end gap-1" style={{ height: 140 }}>
                        <div className="flex-1 rounded-t-lg" style={{ height: `${pct}%`, background: isLast ? "#2563EB" : "#1e2330", border: `1px solid ${isLast ? "#2563EB" : "#2a2f3a"}`, boxShadow: isLast ? "0 0 14px #2563EB44" : "none", transition: "height 0.4s ease", minHeight: 6 }} />
                        <div className="flex-1 rounded-t-lg" style={{ height: `${cPct}%`, background: isLast ? "#10B981" : "#162a22", border: `1px solid ${isLast ? "#10B981" : "#1a3028"}`, boxShadow: isLast ? "0 0 14px #10B98144" : "none", transition: "height 0.4s ease", minHeight: 4 }} />
                      </div>
                      <div className="font-mono text-center" style={{ fontSize: "0.6rem", color: isLast ? "#9ca3af" : "#4b5563" }}>{wk}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category breakdown + donut-ish rings */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                <div className="font-display font-bold text-base" style={{ color: "#ffffff" }}>Content Category Breakdown</div>
                {[
                  { label: "Learning Paths", pct: 38, color: "#2563EB" },
                  { label: "Community Posts", pct: 24, color: "#10B981" },
                  { label: "CV Analyses", pct: 19, color: "#8B5CF6" },
                  { label: "Project Submissions", pct: 12, color: "#F59E0B" },
                  { label: "Job Applications", pct: 7, color: "#EC4899" },
                ].map(row => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="font-body text-xs" style={{ color: "#9ca3af" }}>{row.label}</span>
                      <span className="font-mono text-xs font-bold" style={{ color: row.color }}>{row.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full w-full" style={{ background: "#1e2330" }}>
                      <div className="h-2 rounded-full" style={{ width: `${row.pct}%`, background: row.color, boxShadow: `0 0 8px ${row.color}55`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Full activity log */}
              <div className="rounded-2xl p-6 flex flex-col gap-2" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                <div className="font-display font-bold text-base mb-2" style={{ color: "#ffffff" }}>Full Activity Log</div>
                <div className="flex flex-col gap-0 overflow-y-auto" style={{ maxHeight: 260 }}>
                  {activityLog.map((log, i) => {
                    const dot = log.type === "ok" ? "#10B981" : log.type === "err" ? "#DC2626" : log.type === "warn" ? "#F59E0B" : "#2563EB";
                    return (
                      <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < activityLog.length - 1 ? "1px solid #1e2330" : "none" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: dot }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-body text-xs leading-snug" style={{ color: "#d1d5db" }}>{log.event}</div>
                          <div className="font-mono" style={{ fontSize: "0.6rem", color: "#4b5563", marginTop: 2 }}>{log.time}</div>
                        </div>
                        <div className="w-2 h-2 rounded-sm shrink-0 mt-1" style={{ background: `${dot}33`, border: `1px solid ${dot}55` }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Geo / device split placeholder cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Top Country", val: "🇺🇸 United States", sub: "34% of traffic", color: "#2563EB" },
                { label: "Top Device", val: "💻 Desktop", sub: "68% of sessions", color: "#10B981" },
                { label: "Avg Load Time", val: "1.2s", sub: "↓ 0.3s vs last month", color: "#F59E0B" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-5 flex flex-col gap-1" style={{ background: "#13161e", border: "1.5px solid #1e2330" }}>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#4b5563" }}>{s.label}</div>
                  <div className="font-display font-bold text-lg" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-mono text-xs" style={{ color: "#4b5563" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>}

        </div>
      </main>
    </div>
  );
}

/* ─── Standalone Apply Page ─── */
function StandaloneApplyPage({ onBack }: { onBack: () => void }) {
  const [cvAttached, setCvAttached] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const job = {
    title: "Junior Frontend Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA · Remote-friendly",
    type: "Full-time",
    salary: "$65k – $90k",
    match: 93,
    color: "#2563EB",
    skills: [
      { icon: "⚛", label: "React & React Hooks", desc: "2+ years building component-driven UIs with modern React patterns" },
      { icon: "TS", label: "TypeScript", desc: "Strong typing, generics, and type-safe API contracts required" },
      { icon: "🔗", label: "REST & GraphQL APIs", desc: "Experience consuming and integrating third-party APIs in production" },
    ],
    perks: ["Health & Dental", "Remote Flex", "Learning Budget $2k", "Stock Options"],
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#F5EFE6" }}>
        <div className="rounded-3xl p-12 flex flex-col items-center gap-5 text-center max-w-md w-full mx-4"
          style={{ background: "#FFFFFF", border: "1.5px solid #D4C4A8", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#10B98118", border: "2px solid #10B98144" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: "2rem", color: "#1A1D24" }}>Application Sent!</h2>
            <p className="font-body text-sm mt-2" style={{ color: "#52504B" }}>
              Your application for <strong>Junior Frontend Developer</strong> at <strong>TechCorp Solutions</strong> has been submitted. We'll notify you within 48 hours.
            </p>
          </div>
          <div className="w-full rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#F5EFE6", border: "1px solid #D4C4A8" }}>
            {[
              { label: "Role", val: job.title },
              { label: "Company", val: job.company },
              { label: "CV", val: "SkillBridge_CV_Jamie_Rivera.pdf ✓" },
              { label: "Match Score", val: "93% — Strong Fit" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-widest" style={{ color: "#52504B" }}>{r.label}</span>
                <span className="font-body font-semibold" style={{ color: "#1A1D24" }}>{r.val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onBack}
            className="font-mono text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#10B981,#2563EB)", color: "#ffffff", border: "none", cursor: "pointer" }}
          >
            Back to Home →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5EFE6" }}>
      {/* Header */}
      <div style={{ background: "#FFFFFF", borderBottom: "1.5px solid #D4C4A8", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + page label */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-70"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#52504B" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back
            </button>
            <div style={{ width: 1, height: 24, background: "#D4C4A8" }} />
            <div className="flex items-center gap-2">
              <LogoMark size={30} />
              <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "#1A1D24" }}>SkillBridge</span>
            </div>
            <div style={{ width: 1, height: 24, background: "#D4C4A8" }} />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "#52504B" }}>Job Application</span>
          </div>

          {/* Profile strip */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "#F59E0B18", border: "1px solid #F59E0B33" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span className="font-mono text-xs font-bold" style={{ color: "#F59E0B" }}>4,820 XP</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#10B981,#2563EB)", color: "#ffffff" }}>
              J
            </div>
            <div>
              <div className="font-body text-xs font-semibold" style={{ color: "#1A1D24" }}>Jamie Rivera</div>
              <div className="font-mono" style={{ fontSize: "0.6rem", color: "#52504B" }}>Level 12 · Top 8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page title banner */}
      <div style={{ background: "linear-gradient(135deg,#13161e 0%,#1a2035 60%,#0f1117 100%)", borderBottom: "1.5px solid #2563EB44" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="tag-pill" style={{ background: "#2563EB22", color: "#60a5fa" }}>JOB APPLICATION · SKILLBRIDGE</span>
            <h1 className="font-display mt-2" style={{ fontSize: "2rem", lineHeight: 1.1, color: "#ffffff" }}>Apply for this Role</h1>
            <p className="font-body text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Complete the form below and submit your application directly through SkillBridge.</p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: "#2563EB18", border: "1.5px solid #2563EB44" }}>
            <div>
              <div className="font-display text-2xl leading-none" style={{ color: "#2563EB" }}>{job.match}%</div>
              <div className="font-mono" style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>PROFILE MATCH</div>
            </div>
            <div style={{ width: 1, height: 36, background: "#2563EB44" }} />
            <div>
              <div className="font-mono text-xs font-bold" style={{ color: "#10B981" }}>Strong Fit</div>
              <div className="font-mono" style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.4)" }}>3 of 3 skills matched</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>

        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Job details card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1.5px solid #D4C4A8" }}>
            <div className="px-6 py-5 flex items-start gap-4" style={{ borderBottom: "1px solid #F0E8D8" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-2xl font-bold shrink-0"
                style={{ background: "#2563EB18", color: "#2563EB", border: "1.5px solid #2563EB33" }}>
                TC
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display" style={{ fontSize: "1.4rem", color: "#1A1D24" }}>{job.title}</h2>
                <p className="font-body text-sm font-semibold mt-0.5" style={{ color: "#52504B" }}>{job.company}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { icon: "📍", val: job.location },
                    { icon: "💼", val: job.type },
                    { icon: "💰", val: job.salary },
                  ].map(m => (
                    <span key={m.val} className="flex items-center gap-1.5 tag-pill"
                      style={{ background: "#F5EFE6", color: "#52504B", border: "1px solid #D4C4A8" }}>
                      {m.icon} {m.val}
                    </span>
                  ))}
                </div>
              </div>
              <span className="tag-pill shrink-0" style={{ background: "#10B98118", color: "#10B981", border: "1px solid #10B98133" }}>
                {job.match}% Match
              </span>
            </div>

            {/* Required skills */}
            <div className="px-6 py-5">
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#52504B" }}>Key Skills Required</div>
              <div className="flex flex-col gap-3">
                {job.skills.map(s => (
                  <div key={s.label} className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                    style={{ background: "#F5EFE6", border: "1px solid #D4C4A8" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                      style={{ background: "#2563EB18", color: "#2563EB", border: "1px solid #2563EB33" }}>
                      {s.icon}
                    </div>
                    <div>
                      <div className="font-body text-sm font-semibold" style={{ color: "#1A1D24" }}>{s.label}</div>
                      <div className="font-body text-xs mt-0.5 leading-relaxed" style={{ color: "#52504B" }}>{s.desc}</div>
                    </div>
                    <svg className="ml-auto shrink-0 mt-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-fill + CV attach */}
          <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: "#FFFFFF", border: "1.5px solid #D4C4A8" }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="tag-pill" style={{ background: "#10B98118", color: "#10B981" }}>SKILLBRIDGE PROFILE</span>
                <h3 className="font-display mt-1" style={{ fontSize: "1.1rem", color: "#1A1D24" }}>Auto-Fill from Your Profile</h3>
              </div>
              <button
                onClick={() => setAutoFilled(true)}
                className="font-mono text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  background: autoFilled ? "#10B98118" : "linear-gradient(135deg,#10B981,#2563EB)",
                  border: autoFilled ? "1.5px solid #10B98155" : "none",
                  color: autoFilled ? "#10B981" : "#ffffff",
                  cursor: "pointer",
                }}
              >
                {autoFilled
                  ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg> Auto-Filled</>
                  : "⚡ Auto-Fill Profile"
                }
              </button>
            </div>

            {/* CV attach */}
            <button
              onClick={() => setCvAttached(v => !v)}
              className="rounded-xl p-4 flex items-center gap-4 w-full text-left transition-all"
              style={{
                background: cvAttached ? "#10B98110" : "#F5EFE6",
                border: `1.5px solid ${cvAttached ? "#10B98155" : "#D4C4A8"}`,
                cursor: "pointer",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: cvAttached ? "#10B98122" : "#D4C4A844", border: `1px solid ${cvAttached ? "#10B98144" : "#BFB09A"}` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cvAttached ? "#10B981" : "#52504B"} strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold" style={{ color: "#1A1D24" }}>
                  {cvAttached ? "SkillBridge_CV_Jamie_Rivera.pdf" : "Attach Your SkillBridge CV"}
                </div>
                <div className="font-mono mt-0.5" style={{ fontSize: "0.6rem", color: cvAttached ? "#10B981" : "#52504B" }}>
                  {cvAttached ? "✓ ATS Score: 74% · Analysed 29 Aug 2026" : "Click to attach your SkillBridge CV"}
                </div>
              </div>
              {cvAttached && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>}
            </button>

            {/* Profile preview */}
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: "#F5EFE6", border: "1.5px solid #D4C4A8" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-bold shrink-0"
                style={{ background: "linear-gradient(135deg,#10B981,#2563EB)", color: "#ffffff" }}>J</div>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm font-semibold" style={{ color: "#1A1D24" }}>Jamie Rivera</div>
                <div className="font-mono" style={{ fontSize: "0.6rem", color: "#52504B" }}>Level 12 · Top 8% · 4,820 XP</div>
              </div>
              <span className="tag-pill" style={{ background: "#2563EB22", color: "#2563EB" }}>Pro Member</span>
            </div>

            {autoFilled && (
              <div className="rounded-xl px-4 py-2.5 flex items-center gap-2" style={{ background: "#10B98110", border: "1px solid #10B98133" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10B981" }} />
                <span className="font-body text-xs" style={{ color: "#10B981" }}>Profile data applied — review and edit below before submitting</span>
              </div>
            )}
          </div>

          {/* Cover letter */}
          <div className="rounded-2xl p-6 flex flex-col gap-3" style={{ background: "#FFFFFF", border: "1.5px solid #D4C4A8" }}>
            <div>
              <span className="tag-pill" style={{ background: "#8B5CF618", color: "#8B5CF6" }}>COVER LETTER</span>
              <h3 className="font-display mt-1" style={{ fontSize: "1.1rem", color: "#1A1D24" }}>Tell them about yourself</h3>
            </div>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={7}
              placeholder="Hi TechCorp Solutions team,&#10;&#10;I'm excited to apply for the Junior Frontend Developer role. My experience with React and TypeScript, combined with my work on real-world projects through SkillBridge, makes me a great fit for your team..."
              className="w-full rounded-xl p-4 font-body text-sm resize-none outline-none transition-all"
              style={{
                background: "#F5EFE6",
                border: "1.5px solid #D4C4A8",
                color: "#1A1D24",
                lineHeight: 1.6,
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={e => (e.currentTarget.style.borderColor = "#D4C4A8")}
            />
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs" style={{ color: "#52504B" }}>{coverLetter.length} characters</span>
              {coverLetter.length > 50 && (
                <span className="font-mono text-xs" style={{ color: "#10B981" }}>✓ Good length</span>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">

          {/* Application checklist */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 sticky top-24" style={{ background: "#FFFFFF", border: "1.5px solid #D4C4A8" }}>
            <span className="tag-pill self-start" style={{ background: "#2563EB18", color: "#2563EB" }}>APPLICATION CHECKLIST</span>

            <div className="flex flex-col gap-2.5">
              {[
                { label: "Role", val: job.title, ok: true },
                { label: "Company", val: job.company, ok: true },
                { label: "CV", val: cvAttached ? "Attached ✓" : "Not attached", ok: cvAttached },
                { label: "Profile", val: autoFilled ? "Auto-filled ✓" : "Manual entry", ok: autoFilled },
                { label: "Cover Letter", val: coverLetter.length > 50 ? `${coverLetter.length} chars ✓` : "Not written", ok: coverLetter.length > 50 },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between gap-2 py-2" style={{ borderBottom: "1px solid #F0E8D8" }}>
                  <span className="font-mono text-xs uppercase tracking-widest shrink-0" style={{ color: "#52504B" }}>{r.label}</span>
                  <span className="font-body text-xs truncate font-semibold" style={{ color: r.ok ? "#10B981" : "#BFB09A" }}>{r.val}</span>
                </div>
              ))}
            </div>

            {/* Match gauge */}
            <div className="rounded-xl p-3.5 flex items-center gap-3 mt-1" style={{ background: "#2563EB0a", border: "1px solid #2563EB33" }}>
              <div className="font-display text-2xl shrink-0" style={{ color: "#2563EB" }}>{job.match}%</div>
              <div>
                <div className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "#1A1D24" }}>SkillBridge Match</div>
                <div className="font-body text-xs" style={{ color: "#52504B" }}>Strong fit for this role</div>
              </div>
            </div>

            {/* Perks */}
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#52504B" }}>Benefits</div>
              <div className="flex flex-col gap-1.5">
                {job.perks.map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#10B981" }} />
                    <span className="font-body text-xs" style={{ color: "#1A1D24" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-4 rounded-2xl font-mono text-sm font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5 mt-2"
              style={{
                background: "linear-gradient(135deg, #10B981, #2563EB)",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              }}
            >
              Submit Application →
            </button>
            <p className="font-mono text-center" style={{ fontSize: "0.6rem", color: "#BFB09A" }}>
              Your data is handled securely · SkillBridge Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Splash Screen ─── */
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Advance the pixel progress bar over 2.2 s then fade out
    const totalMs = 2200;
    const steps = 20;
    const intervalMs = totalMs / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(interval);
        setFading(true);
        setTimeout(onDone, 500); // fade duration
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [onDone]);

  // Pixel block count for the progress bar
  const totalBlocks = 24;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#0f1117",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 0.5s ease" : "none",
        userSelect: "none",
      }}
    >
      {/* Retro scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)",
        zIndex: 1,
      }} />

      {/* Corner brackets */}
      {[["top-6 left-6","border-t-2 border-l-2"],["top-6 right-6","border-t-2 border-r-2"],["bottom-6 left-6","border-b-2 border-l-2"],["bottom-6 right-6","border-b-2 border-r-2"]].map(([pos, borders]) => (
        <div key={pos} className={`absolute ${pos} w-8 h-8 ${borders}`} style={{ borderColor: "#10B98144", zIndex: 2 }} />
      ))}

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* Pixel glow ring */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 24,
            background: "linear-gradient(135deg, #10B98122 0%, #2563EB22 100%)",
            border: "2px solid #10B98155",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 4px #10B98114, 0 0 40px #10B98133, 0 0 80px #2563EB1a",
            animation: "sb-glow-pulse 2s ease-in-out infinite",
          }}>
            {/* SB text monogram */}
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: "1.55rem",
              color: "#10B981",
              letterSpacing: "-0.02em",
              textShadow: "0 0 12px #10B981, 0 0 28px #10B98199, 0 0 48px #10B98155",
              lineHeight: 1,
              userSelect: "none",
            }}>SB</span>
          </div>
          {/* Pixel corner accents on the ring */}
          {[["-top-1 -left-1"], ["-top-1 -right-1"], ["-bottom-1 -left-1"], ["-bottom-1 -right-1"]].map(([pos]) => (
            <div key={pos} className={`absolute ${pos} w-2 h-2`} style={{ background: "#10B981", borderRadius: 1, opacity: 0.7 }} />
          ))}
        </div>

        {/* Logo wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 10 }}>
          <span className="font-display" style={{ fontSize: "2.4rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", textShadow: "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.2)" }}>
            Skill
          </span>
          <span className="font-display" style={{ fontSize: "2.4rem", fontWeight: 800, color: "#10B981", letterSpacing: "-0.02em", textShadow: "0 0 20px rgba(16,185,129,0.6), 0 0 40px rgba(16,185,129,0.3)" }}>
            Bridge
          </span>
          <span className="font-mono" style={{ fontSize: "0.6rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.08em", marginLeft: 4, padding: "2px 5px", border: "1.5px solid #2563EB55", borderRadius: 4, background: "#2563EB12", position: "relative", top: -12 }}>
            AI
          </span>
        </div>

        {/* Tagline */}
        <p className="font-mono" style={{ fontSize: "0.72rem", color: "#9ca3af", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 40, textAlign: "center" }}>
          Level Up Your Tech Career
        </p>

        {/* Pixel progress bar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 220 }}>
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {Array.from({ length: totalBlocks }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i < filledBlocks ? 7 : 6,
                  height: i < filledBlocks ? 10 : 8,
                  borderRadius: 2,
                  background: i < filledBlocks
                    ? i < filledBlocks * 0.6
                      ? "#10B981"
                      : "#2563EB"
                    : "#1e2330",
                  boxShadow: i < filledBlocks ? `0 0 6px ${i < filledBlocks * 0.6 ? "#10B98166" : "#2563EB66"}` : "none",
                  transition: "all 0.12s ease",
                }}
              />
            ))}
          </div>
          <span className="font-mono" style={{ fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.12em" }}>
            INITIALIZING · {progress}%
          </span>
        </div>

        {/* Retro blinking cursor */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, background: "#10B981", borderRadius: 1, animation: "sb-blink 1s step-end infinite" }} />
          <span className="font-mono" style={{ fontSize: "0.58rem", color: "#2a2f3a", letterSpacing: "0.1em" }}>SYSTEM READY</span>
          <div style={{ width: 6, height: 6, background: "#10B981", borderRadius: 1, animation: "sb-blink 1s step-end infinite 0.5s" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── App Root ─── */
export default function App() {
  const [modal, setModal] = useState<"login" | "signup" | "forgot" | null>(null);
  const [page, setPage] = useState<"landing" | "dashboard" | "splash" | "admin" | "apply">("splash");
  const [dashTarget, setDashTarget] = useState<DashPage>("Dashboard");
  const [adminModal, setAdminModal] = useState(false);

  function goToDash(target: DashPage = "Dashboard") {
    setDashTarget(target);
    setPage("dashboard");
  }

  if (page === "splash") {
    return <SplashScreen onDone={() => setPage("landing")} />;
  }

  if (page === "admin") {
    return <AdminDashboard onBack={() => setPage("landing")} />;
  }

  if (page === "apply") {
    return <StandaloneApplyPage onBack={() => setPage("landing")} />;
  }

  if (page === "dashboard") {
    return <Dashboard
      onBack={() => {
        document.documentElement.classList.remove("theme-light", "theme-dark");
        document.documentElement.classList.add("theme-dark");
        setPage("landing");
      }}
      onAdmin={() => setPage("admin")}
      initialPage={dashTarget}
    />;
  }

  // Landing page is always dark regardless of user theme preference
  document.documentElement.classList.remove("theme-light", "theme-dark");
  document.documentElement.classList.add("theme-dark");

  return (
    <div className="min-h-screen" style={{ background: "#1A1D24" }}>
      {modal === "login" && (
        <LoginModal
          onClose={() => setModal(null)}
          onSwitchToSignUp={() => setModal("signup")}
          onForgotPassword={() => setModal("forgot")}
        />
      )}
      {modal === "signup" && (
        <SignUpModal
          onClose={() => setModal(null)}
          onSwitchToLogin={() => setModal("login")}
        />
      )}
      {modal === "forgot" && (
        <ForgotPasswordModal
          onClose={() => setModal(null)}
          onBackToLogin={() => setModal("login")}
        />
      )}
      {/* Admin login modal */}
      {adminModal && <AdminLoginModal onAuth={() => { setAdminModal(false); setPage("admin"); }} onClose={() => setAdminModal(false)} />}
      <Nav
        onLogin={() => setModal("login")}
        onSignUp={() => setModal("signup")}
        onDashboard={() => goToDash("Dashboard")}
        onNavigate={goToDash}
        onApply={() => setPage("apply")}
      />
      <Hero onDashboard={() => goToDash("Dashboard")} onSignUp={() => setModal("signup")} />
      <FeaturePanels onNavigate={goToDash} />
      <AdvancedCards onNavigate={goToDash} />
      <Footer onNavigate={goToDash} onAdmin={() => setAdminModal(true)} />
    </div>
  );
}
