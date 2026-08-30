import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

const NAV_LINK_CLASS = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-ink' : 'text-muted hover:text-ink'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-signal font-display font-bold">
            S
          </span>
          <span className="font-display text-lg font-semibold text-ink">SkillBridge</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/marketplace" className={NAV_LINK_CLASS}>
            سوق المشاريع
          </NavLink>
          <NavLink to="/learning" className={NAV_LINK_CLASS}>
            مسار التعلم
          </NavLink>
          <NavLink to="/community" className={NAV_LINK_CLASS}>
            المجتمع التقني
          </NavLink>
          {user && (
            <NavLink
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className={NAV_LINK_CLASS}
            >
              لوحة التحكم
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-ink/10 text-sm font-semibold text-ink sm:flex">
                {getInitials(user.fullName)}
              </span>
              <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-xs">
                تسجيل خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline !px-4 !py-2 text-xs">
                تسجيل دخول
              </Link>
              <Link to="/register" className="btn-accent !px-4 !py-2 text-xs">
                ابدأ الآن
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
