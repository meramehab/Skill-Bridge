/**
 * @file NavbarLogic.jsx
 * @description Pure logic wrapper / contract for the Navbar component.
 * Manages guest vs authenticated navigation states, search debouncing, and mobile menu toggling.
 */
import React, { useState, useCallback, useRef } from "react";

export function NavbarLogic({
  user = null,
  notificationsCount = 0,
  onSearch = () => {},
  renderNavbar // Render prop from the UI team
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Available links determined by authentication status
  const navLinks = isAuthenticated
    ? [
        { label: "الرئيسية", href: "/" },
        { label: "سوق العمل", href: "/marketplace" },
        { label: "مسار التعلم", href: "/learning-path" },
        { label: "المجتمع", href: "/community" },
        { label: "الفرق (Squads)", href: "/squad" },
        { label: "لوحة المتصدرين", href: "/leaderboard" }
      ]
    : [
        { label: "الرئيسية", href: "/" },
        { label: "عن المنصة", href: "/#about" },
        { label: "الميزات", href: "/#features" },
        { label: "تسجيل الدخول", href: "/login" },
        { label: "إنشاء حساب", href: "/register" }
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

  return logicProps;
}

export default NavbarLogic;
