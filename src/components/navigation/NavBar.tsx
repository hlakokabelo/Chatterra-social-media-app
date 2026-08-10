import * as React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import UserProfilePhoto from "../user/UserProfilePhoto";
import image from "../../assets/icon3.svg";
import { ROUTES } from "../../utils/routes";
import MobileMenu from "./MobileMenu";
import { appName } from "../../utils/appName";
import SearchBar from "./SearchBar";

const NavBar: React.FunctionComponent = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();

  const goToUrl = (destination: string) => {
    setMenuOpen(false);
    navigate(destination);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest(".mobile-menu")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const mobileMenuClick = () => {
    if (user) {
      signOut();
      setMenuOpen(false);
      return;
    }

    goToUrl(ROUTES.SIGN_IN);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <button
            onClick={() => goToUrl(ROUTES.HOME)}
            className="flex shrink-0 items-center gap-2 cursor-pointer"
          >
            <img
              className="h-8 w-8"
              src={image}
              alt={`${appName} Logo`}
            />

            <span className="hidden sm:block text-lg font-bold text-white">
              {appName}
            </span>
          </button>

          {/* Search */}
          <div className="flex flex-1 justify-center px-2 sm:px-6">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">

            <NavLink
              to={ROUTES.HOME}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to={ROUTES.COMMUNITIES}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                }`
              }
            >
              Communities
            </NavLink>

            <NavLink
              to={ROUTES.CREATE_POST}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white"
                }`
              }
            >
              Create
            </NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex shrink-0 items-center gap-3">

            {user ? (
              <>
                <UserProfilePhoto user={user} />

                <button
                  onClick={signOut}
                  className="
                    cursor-pointer
                    rounded-lg
                    border border-red-500/20
                    bg-red-500/10
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-red-400
                    transition-all
                    duration-200
                    hover:border-red-500/40
                    hover:bg-red-500
                    hover:text-white
                  "
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="
                  cursor-pointer
                  rounded-lg
                  bg-blue-600
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition-all
                  duration-200
                  hover:bg-blue-500
                  hover:shadow-lg
                  hover:shadow-blue-500/20
                "
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">

            {user && (
              <UserProfilePhoto user={user} />
            )}

            <button
              className="
                mobile-menu
                cursor-pointer
                rounded-lg
                p-2
                text-gray-400
                transition-colors
                hover:bg-gray-800
                hover:text-white
              "
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        items={{
          mobileMenuClick,
          goToUrl,
          menuOpen,
          user,
          userProfile,
        }}
      />
    </nav>
  );
};

export default NavBar;