import * as React from "react";
import { useNavigate } from "react-router";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  placeholder = "Search Chatterra...",
  className = "",
}) => {
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full max-w-md ${className}`}
    >
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
        />
      </svg>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          bg-gray-900/70
          border border-gray-800
          rounded-full
          py-2.5
          pl-12
          pr-10
          text-sm text-gray-200
          placeholder:text-gray-500
          outline-none
          transition-all duration-200
          focus:border-blue-500/60
          focus:bg-gray-900
          focus:ring-2
          focus:ring-blue-500/10
          hover:border-gray-700
        "
        aria-label="Search"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            p-1
            text-gray-500
            hover:text-gray-300
            transition-colors
            cursor-pointer
          "
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;