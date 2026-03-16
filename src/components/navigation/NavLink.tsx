import { Link } from "react-router";

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/50 transition-all duration-300 font-medium"
  >
    {children}
  </Link>
);

export default  NavLink