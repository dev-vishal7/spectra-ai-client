import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Folder, Users, Menu } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Layout",
      path: "/layouts",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Sources",
      path: "/sources",
      icon: <Folder size={20} />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <aside
      className={`h-full bg-[#1f2937] shadow-md border-r border-gray-700 p-4 transition-al text-white  transition-all duration-300   ${
        collapsed ? "w-20" : "w-50"
      }`}
    >
      {/* <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-wide text-white">
            Spectra
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </div> */}

      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition
                  ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <span>{item.icon}</span>
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
