import {
  Home,
  Package,
  Grid3X3,
  Building2,
  Image,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-opacity-50 md:hidden z-20 animate-fadeIn transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-900'
            }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className={`fixed top-4 left-4 p-2 rounded-md shadow-lg md:hidden z-30 transition-all duration-300 hover:scale-105 ${isDark
          ? 'text-blue-400 bg-slate-800 hover:bg-slate-700'
          : 'text-blue-600 bg-white hover:bg-gray-100'
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen backdrop-blur-sm shadow-xl z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-all duration-300 ease-in-out
          w-64 p-4 flex flex-col justify-between border-r ${isDark
            ? 'bg-slate-900/95 border-slate-700/50'
            : 'bg-white/95 border-gray-200/50'
          }`}
      >
        <div>
          <div
            className="relative overflow-hidden py-4 px-2 mb-6 bg-gradient-to-r from-nsr-primary to-nsr-secondary rounded-lg group cursor-default card-nsr"
          >
            <h1 className="text-xl font-bold text-white text-center relative z-10 transition-transform duration-500 group-hover:scale-105">
              NSR-PC
            </h1>
            <div className="absolute inset-0 bg-nsr-accent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-nsr-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-2">
            {[
              { icon: <Home className="w-5 h-5" />, label: "Home", path: "/home" },
              { icon: <Package className="w-5 h-5" />, label: "Products", path: "/products" },
              { icon: <Grid3X3 className="w-5 h-5" />, label: "Categories", path: "/categories" },
              { icon: <Building2 className="w-5 h-5" />, label: "Brands", path: "/brands" },
              { icon: <Image className="w-5 h-5" />, label: "Banner", path: "/banner" },
              { icon: <ShoppingCart className="w-5 h-5" />, label: "Orders", path: "/orders" },
            ].map((item, index) => (
              <li
                key={index}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                className="transform transition-all duration-300"
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 group relative ${isDark
                    ? 'text-slate-300 hover:bg-blue-600/10 hover:text-blue-400'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  <span className={`transform transition-transform duration-300 group-hover:scale-110 ${isDark
                    ? 'text-blue-400 group-hover:text-blue-300'
                    : 'text-blue-600 group-hover:text-blue-500'
                    }`}>
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.label}</span>
                  <span className={`absolute left-0 w-1 h-8 rounded-r transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${isDark ? 'bg-blue-400' : 'bg-blue-600'
                    }`}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full p-3 rounded-lg border transition-all duration-300 group ${isDark
            ? 'text-red-400 hover:text-red-300 bg-slate-800/50 border-red-400/30 hover:border-red-300 hover:bg-red-500/10'
            : 'text-red-600 hover:text-red-500 bg-gray-50 border-red-300/50 hover:border-red-400 hover:bg-red-50'
            }`}
        >
          <FaSignOutAlt className="mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
          <span>Log out</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
