import * as React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const { user, signOut, signInWithGitHub } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;

  const navigate = useNavigate();
  const goToUrl = (destination: string) => {
    setMenuOpen(false);
    navigate(destination);
  };
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Social<span className="text-purple-500">.media </span>
          </Link>

          {/**Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className="text-gray-300 hover:text-white transition-colors"
              to={"/"}
            >
              Home
            </Link>
            <Link
              className="text-gray-300 hover:text-white transition-colors"
              to={"/create"}
            >
              Create Post
            </Link>
            <Link
              className="text-gray-300 hover:text-white transition-colors"
              to={"/communities"}
            >
              Communities
            </Link>
            <Link
              className="text-gray-300 hover:text-white transition-colors"
              to={"/community/create"}
            >
              Create comunity
            </Link>
          </div>

          {/**Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata.avatar_url && (
                  <div>
                    <img
                      src={user.user_metadata.avatar_url}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="user Avatar"
                    />
                  </div>
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500 px-3 py-1 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="cursor-pointer bg-blue-500 px-3 py-1 rounded"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/**Mobile menu btn */}
          <div className="md:hidden">
            <button
              className="text-gray-300 focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
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

      {/**Mobile menu links */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <p
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/")}
            >
              Home
            </p>
            <p
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/create")}
            >
              Create Post
            </p>
            <p
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/communities")}
            >
              Communities
            </p>
            <p
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/community/create")}
            >
              Create comunity
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
