import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, HelpCircle, ChevronDown, User, Settings, LogOut, ChevronRight, Home } from "lucide-react";

const Header = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  // Simple breadcrumb logic
  const pathSegments = location.pathname.split('/').filter(Boolean);

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
    <header className="h-14 px-6 flex justify-between items-center bg-[#1f2937] border-b border-gray-700 shadow-sm sticky top-0 z-40">
      {/* Left: Branding or Breadcrumbs */}
      <div className="flex items-center text-sm font-medium text-gray-400">
         <Link to="/dashboard" className="flex items-center hover:text-white transition-colors group">
            <Home size={16} className="text-gray-500 mr-2 group-hover:text-blue-400 transition-colors" />
            <span className="tracking-tight group-hover:underline decoration-gray-600 underline-offset-4">Spectra</span>
         </Link>
         
         {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            
            return (
               <React.Fragment key={path}>
                  <ChevronRight size={14} className="mx-2 text-gray-600 shrink-0" />
                  {isLast ? (
                     <span className="text-blue-400 capitalize font-medium truncate max-w-[150px] sm:max-w-xs block">
                        {segment.replace(/-/g, ' ')}
                     </span>
                  ) : (
                     <Link 
                        to={path} 
                        className="text-gray-300 hover:text-white hover:underline decoration-gray-600 underline-offset-4 capitalize transition-colors truncate max-w-[100px] sm:max-w-xs block"
                     >
                        {segment.replace(/-/g, ' ')}
                     </Link>
                  )}
               </React.Fragment>
            );
         })}
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-4 ml-4 shrink-0">
        {/* Support Icon */}
        <button className="text-gray-400 hover:text-white transition-colors relative group p-1.5 rounded hover:bg-gray-800/50">
           <HelpCircle size={18} />
           <span className="absolute top-9 right-0 text-[10px] bg-gray-800 text-gray-200 px-2 py-1 rounded border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">Help Center</span>
        </button>

        {/* Notifications */}
        <button className="text-gray-400 hover:text-white transition-colors relative group p-1.5 rounded hover:bg-gray-800/50">
          <Bell size={18} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-500 animate-pulse border border-[#1f2937]" />
          <span className="absolute top-9 right-0 text-[10px] bg-gray-800 text-gray-200 px-2 py-1 rounded border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">Notifications</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-700/80 mx-1" />

        {/* User Profile */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2.5 focus:outline-none group p-1 rounded hover:bg-gray-800/50 transition-all border border-transparent hover:border-gray-700/50"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                {user.firstName?.[0]}
              </div>
              <div className="hidden sm:flex flex-col items-start mr-1">
                 <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors leading-none mb-0.5">
                   {user.firstName}
                 </span>
                 <span className="text-[10px] text-gray-500 font-medium leading-none">Admin</span>
              </div>
              <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 group-hover:text-gray-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1f2937] border border-gray-700 rounded-lg shadow-xl py-2 z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-gray-700/80 mb-1 bg-gray-800/30">
                  <p className="text-sm font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{user.email || "user@example.com"}</p>
                </div>
                
                <div className="px-1 py-1 space-y-0.5">
                   <button className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/80 rounded transition-colors">
                      <User size={14} /> Profile
                   </button>
                   <button className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/80 rounded transition-colors">
                      <Settings size={14} /> Settings
                   </button>
                </div>

                <div className="mt-1 border-t border-gray-700/80 pt-1 px-1">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
           <div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse" />
        )}
      </div>
    </header>
  );
};

export default Header;
