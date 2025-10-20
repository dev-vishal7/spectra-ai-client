import React, { useState, useRef, useEffect } from "react";

const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-900 text-white px-6 py-1 flex justify-between items-center shadow-md h-14">
      <h1 className="text-lg font-semibold tracking-wide">Spectra</h1>

      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold uppercase">
              {user.firstName?.[0]}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user.firstName} {user.lastName}
            </span>
            <svg
              className="w-4 h-4 text-gray-400 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
