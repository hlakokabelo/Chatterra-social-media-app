import type { ReactNode } from "react";

interface HoverDropdownProps {
  description: string;
  children: ReactNode;
}

export default function HoverDropdown({
  description,
  children,
}: HoverDropdownProps) {
  return (
    <div className="group relative inline-block">
      {/* The visible Nav Item */}
      <div className="cursor-pointer transition-colors duration-200 group-hover:text-blue-600">
        {children}
      </div>

      {/* The hidden element that appears on hover */}
      <div
        className="
          pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs
          -translate-x-1/2 translate-y-1 opacity-0
          rounded-lg border border-gray-200 bg-white px-3 py-2
          text-xs leading-relaxed text-gray-700 shadow-lg
          transition-all duration-200 ease-out
          group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100
        "
        role="tooltip"
      >
        {/* Arrow */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white" />
        <p className="relative whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
}
