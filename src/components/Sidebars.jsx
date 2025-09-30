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
          className={`fixed inset-0 bg-opacity-50 md:hidden z-20 animate-fadeIn transition-colors duration-300 ${isDark ? 'bg-nsr-dark/80' : 'bg-nsr-dark/80'
            }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className={`fixed top-4 left-4 p-3 rounded-xl shadow-lg md:hidden z-30 transition-all duration-300 hover:scale-105 backdrop-blur-sm border ${isDark
          ? 'text-nsr-accent bg-nsr-primary/10 hover:bg-nsr-primary/20 border-nsr-primary/20'
          : 'text-nsr-accent bg-nsr-light-100 hover:bg-nsr-light-200 border-nsr-primary/20'
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen backdrop-blur-sm shadow-xl z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-all duration-300 ease-in-out
          w-64 p-4 flex flex-col bg-gradient-to-r from-[#0C0C0E] via-[#0F1B24] to-[#11212D] border-gray-500 justify-between border-r `}
      >
        <div>
          <div
            className="relative overflow-hidden py-4 px-2 mb-6 bg-gradient-nsr-elegant rounded-xl group cursor-default card-nsr  "
          >
            <h1 className={`text-xl font-bold ${isDark ? 'text-nsr-light' : 'text-nsr-dark'} text-center relative z-10 transition-transform duration-500 group-hover:scale-105`}>
              NSR-PC
            </h1>
 
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-2">
            {[
              { icon: <Home className="w-5 h-5" />, label: "Home", path: "/home" },
              { icon: <Package className="w-5 h-5" />, label: "Products", path: "/products" },
              { icon: <Grid3X3 className="w-5 h-5" />, label: "Categories", path: "/categories" },
              { icon: <ShoppingCart className="w-5 h-5" />, label: "Orders", path: "/orders" },
              { icon: <Building2 className="w-5 h-5" />, label: "Brands", path: "/brands" },
              { icon: <Image className="w-5 h-5" />, label: "Banner", path: "/banner" },
            ].map((item, index) => (
              <li
                key={index}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                className="transform transition-all duration-300"
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative text-nsr-light-200 hover:bg-[#1a4b73]/40 `}
                >
                  <span className={`transform transition-transform duration-300 group-hover:scale-110 ${isDark ? 'text-nsr-light color-nsr-light' : 'text-nsr-dark color-nsr-dark'} color-nsr-accent`}>
                    {item.icon}
                  </span>
                  <span className={`ml-3 font-medium transition-colors duration-300 ${isDark ? 'text-nsr-light-200 color-nsr-light-200' : 'text-nsr-dark-600 color-nsr-dark-600'}`}>{item.label}</span>
                  <span className={`absolute left-0 w-1 h-8 rounded-r transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ${isDark ? 'bg-nsr-light' : 'bg-nsr-dark'} bg-nsr-accent`}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center w-full p-3 rounded-xl border transition-all duration-300 group ${isDark
            ? 'text-red-400 hover:text-red-300 bg-nsr-primary/10 border-red-400/30 hover:border-red-300 hover:bg-red-500/10'
            : 'text-red-600 hover:text-red-500 bg-nsr-light-100 border-red-300/50 hover:border-red-400 hover:bg-red-50'
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
