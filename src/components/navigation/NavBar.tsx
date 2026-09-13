import * as React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import UserProfilePhoto from "../user/UserProfilePhoto";
import image from "../../assets/icon3.svg";
import { ROUTES } from "../../utils/routes";
import MobileMenu from "./MobileMenu";
import { HiOutlineHome } from "react-icons/hi";
import { LuPlus, LuUsersRound, LuUserPlus } from "react-icons/lu";
import { appName } from "../../utils/appName";
import SearchBar from "./SearchBar";
import HoverDropdown from "./HoverDropdown";
import { CiLogout ,CiLogin} from "react-icons/ci";


interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
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
      setMenuOpen((prev) => !prev);
      return;
    }
    goToUrl(ROUTES.SIGN_IN);
  };

  return (
    <nav className="fixed top-0 h-16 w-full z-40 bg-linear-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 shadow-xl">
      <div className="mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center gap-4 lg:gap-6">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex shrink-0 items-center space-x-2 font-mono text-xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
          >
            <img
              className="w-7 h-7 animate-pulse"
              src={image}
              alt={`${appName} Logo`}
              onError={(e) => {
                e.currentTarget.src = "/images/image-fallback.jpg";
              }}
            />
            <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {appName}
            </span>
          </Link>

          {/* Desktop Navigation: search + icons */}
          <div className="hidden md:flex flex-1 min-w-0  items-center gap-4 lg:gap-4">
            <div className="flex-1 min-w-0  max-w-sm lg:max-w-md xl:max-w-lg">
              <SearchBar />
            </div>

            <nav className="ml-auto flex items-center gap-4 lg:gap-8 shrink-0">
              <NavLink className="hidden lg:block" to={ROUTES.HOME}>
                <HiOutlineHome className="size-6" />
              </NavLink>

              <NavLink to={ROUTES.CREATE_POST}>
                <HoverDropdown description="Create post">
                  <LuPlus className="size-6" />
                </HoverDropdown>
              </NavLink>

              <NavLink to={ROUTES.COMMUNITIES}>
                <HoverDropdown description="Communities">
                  <LuUsersRound className="size-6" />
                </HoverDropdown>
              </NavLink>

              <NavLink to={ROUTES.CREATE_COMMUNITY}>
                <HoverDropdown description="Create Community">
                  <LuUserPlus className="size-6" />
                </HoverDropdown>
              </NavLink>
            </nav>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex shrink-0 items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <UserProfilePhoto user={user} />

                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all duration-300 font-medium"
                >
                  <CiLogout/>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 font-medium"
              >
<CiLogin />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              className="cursor-pointer mobile-menu text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => {
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 transform transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
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

      {/* Mobile Profile Photo - Only show when menu is closed */}
      {user && !menuOpen && (
        <div className="md:hidden absolute right-16 top-4">
          <UserProfilePhoto user={user} />
        </div>
      )}


      {/* Mobile Menu */}
      <MobileMenu
        items={{ mobileMenuClick, goToUrl, menuOpen, user, userProfile }}
      />

      <div className="mt-3 w-90 sm:hidden flex justify-center ml-2"> <SearchBar/></div>

    </nav>
  );
};

export default NavBar;