import { useEffect, useState } from "react";
import { styles as s } from "../assets/dummyStyles.js";
import { Link, useLocation } from "react-router-dom";

import {
  BookPlus,
  BookOpen,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import logo from "../assets/logoIcon.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: BookPlus, label: "Add Books" },
    { path: "/list-books", icon: BookOpen, label: "List Books" },
    { path: "/orders", icon: ShoppingCart, label: "Orders" },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  //hook for screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  //Mobile View
  if (isMobile) {
    return (
      <div className={s.mobileNav.container}>
        <nav className={s.mobileNav.nav}>
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;

            return (
              <Link key={path} to={path} className={s.mobileNav.item}>
                <div className={s.mobileNav.iconContainer(isActive)}>
                  <Icon className="h-5 w-5 mx-auto" />
                </div>
                <span className={s.mobileNav.label(isActive)}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  //Desktop Navigation
  return (
    <div className={s.sidebar.container(isCollapsed)}>
      <div className={s.sidebar.header}>
        {!isCollapsed && (
          <div className={s.sidebar.logoContainer}>
            <div className={s.sidebar.logoImageContainer}>
              <img src={logo} alt="logo" className={s.sidebar.logoImage} />
            </div>

            <div className="">
              <h1 className={s.sidebar.title}>BookStore</h1>
            </div>
          </div>
        )}

        <button onClick={toggleCollapse} className={s.sidebar.collapseButton}>
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className={s.sidebar.nav}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={s.sidebar.navItem(isCollapsed, isActive)}
            >
              <div className={s.sidebar.navItemInner}>
                <div className={s.sidebar.iconContainer(isActive)}>
                  <Icon className="h-5 w-5" />
                </div>

                {!isCollapsed && (
                  <span className={s.sidebar.navLabel(isActive)}>{label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={s.sidebar.divider} />

      <div className={s.sidebar.footer(isCollapsed)}>
        {!isCollapsed && (
          <p className={s.sidebar.footerText}>&copy; 2025 BookStore</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
