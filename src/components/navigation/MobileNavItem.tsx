
const MobileNavItem: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className = "text-gray-300 hover:text-white" }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 ${className} hover:bg-gray-700/50 transition-all duration-300 font-medium`}
  >
    {children}
  </button>
);

export default MobileNavItem;
