import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Grid,
  Zap,
  Database,
  Command,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Box,
  BarChart3,
  Menu
} from "lucide-react";

const Sidebar = () => {
  // Initialize state from local storage, default to true (collapsed)
  const [collapsed, setCollapsedState] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const location = useLocation();

  // Custom setter to sync with localStorage
  const setCollapsed = (value) => {
    setCollapsedState(value);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(value));
  };

  // Auto-collapse on data-heavy pages (Focus Mode)
  useEffect(() => {
     if ((location.pathname.includes('/pipelines') || location.pathname.includes('/builder')) && !collapsed) {
        setCollapsed(true);
     }
  }, [location.pathname]);

  const navGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Command Center", path: "/command-center", icon: <Command size={20} /> },
      ]
    },
    {
      label: "Data & Flows",
      items: [
        { name: "Data Pipeline", path: "/pipelines", icon: <Zap size={20} /> },
        { name: "Sources", path: "/sources", icon: <Database size={20} /> },
        { name: "Apps", path: "/apps", icon: <Box size={20} /> },
      ]
    },
    {
      label: "Management",
      items: [
        { name: "Layouts", path: "/layouts", icon: <Grid size={20} /> },
        { name: "Users", path: "/users", icon: <Users size={20} /> },
      ]
    }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname.includes(item.path);
    return (
      <Link
        to={item.path}
        title={collapsed ? item.name : ""}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gray-800 text-white shadow-sm border border-gray-700/50"
            : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
        } ${collapsed ? "justify-center" : ""}`}
      >
        <div className={`shrink-0 ${isActive ? "text-blue-400" : "group-hover:text-gray-200"}`}>
          {item.icon}
        </div>
        
        {!collapsed && (
          <span className="whitespace-nowrap font-medium text-sm overflow-hidden text-ellipsis">
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`h-full bg-[#1f2937] border-r border-gray-700/80 flex flex-col transition-all duration-300 z-50 shadow-xl relative ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Sidebar Header with Toggle */}
      <div className={`h-14 flex items-center border-b border-gray-700/50 bg-[#1f2937] px-4 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed ? (
           <>
              <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                   <BarChart3 size={20} strokeWidth={2.5} />
                 </div>
                 <span className="font-bold text-xl tracking-wide text-white whitespace-nowrap">
                   Spectra
                 </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title="Collapse Sidebar"
              >
                <ChevronLeft size={20} />
              </button>
           </>
        ) : (
           <button
             onClick={() => setCollapsed(false)}
             className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 hover:ring-2 hover:ring-blue-500/50 transition-all shadow-md"
             title="Expand Sidebar"
           >
             <Menu size={18} />
           </button>
        )}
      </div>

      {/* Navigation - Main Content */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {!collapsed && (
              <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono">
                {group.label}
              </h3>
            )}
            
            {/* Minimal separator for collapsed mode */}
            {collapsed && idx !== 0 && <div className="mx-4 my-2 border-t border-gray-700/60" />}
            
            {group.items.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700/50 bg-[#1f2937] shrink-0">
        <NavItem item={{ name: "Settings", path: "/settings", icon: <Settings size={20} /> }} />
      </div>
    </aside>
  );
};

export default Sidebar;
