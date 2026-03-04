import * as React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import UserProfilePhoto from "./UserProfilePhoto";

interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const { user, signOut } = useAuth();

  const navigate = useNavigate();
  const goToUrl = (destination: string) => {
    setMenuOpen(false);
    navigate(destination);
  };

  const mobileMenuClick = () => {
    if (user) {
      signOut();
      setMenuOpen((prev) => !prev);
      return;
    }

    goToUrl("/sign-in");
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
                <UserProfilePhoto user={user} />
                <button
                  onClick={signOut}
                  className="cursor-pointer bg-red-500 px-3 py-1 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/sign-in")}
                className=" cursor-pointer bg-blue-500 px-3 py-1 rounded"
              >
                Sign in
              </button>
            )}
          </div>

          {/**Mobile menu btn */}
          <div className="md:hidden ">
            <button
              className=" cursor-pointer text-gray-300 focus:outline-none"
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
      <div className="flex md:hidden absolute right-13 top-4">
        <UserProfilePhoto user={user} />
      </div>
      {menuOpen && (
        <div className="md:hidden absolute right-0 bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <p
              className={` cursor-pointer block px-3 py-2 rounded-md text-base font-medium ${user ? "text-red-700" : "text-green-500"} hover:text-white hover:bg-gray-700`}
              onClick={mobileMenuClick}
            >
              {user ? "Log-out" : "Sign-in/Sign-up"}
            </p>
            <p
              className=" cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/")}
            >
              Home
            </p>
            <p
              className=" cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/create")}
            >
              Create Post
            </p>
            <p
              className=" cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => goToUrl("/communities")}
            >
              Communities
            </p>
            <p
              className=" cursor-pointer block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
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
