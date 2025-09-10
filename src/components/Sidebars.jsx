import {
  Boxes,
  ChartBarStacked,
  Database,
  Home,
  LayoutGrid,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 p-2 text-[#1e4b6b] bg-white rounded-md shadow-lg md:hidden z-30 hover:bg-[#1e4b6b]/5 transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-[#1e4b6b]/5 via-[#8B6B43]/5 to-[#634927]/5 shadow-xl z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-all duration-300 ease-in-out
          w-64 p-4 flex flex-col justify-between border-r border-[#ECB774]/20`}
      >
        <div>
          <div 
            className="relative overflow-hidden py-4 px-2 mb-6 bg-gradient-to-br from-[#1e4b6b] via-[#8B6B43] to-[#634927] rounded-lg group cursor-default"
          >
            <h1 className="text-xl font-serif text-white text-center relative z-10 transition-transform duration-500 group-hover:scale-105">
              Jawharat AlTabieih
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ECB774] to-[#87CEEB] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ECB774] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-2">
            {[
              { icon: <Home className="w-5 h-5" />, label: "Home", path: "/" },
              { icon: <ShoppingBag className="w-5 h-5" />, label: "Products", path: "/products" },
              { icon: <LayoutGrid className="w-5 h-5" />, label: "Categories", path: "/categories" },
              { icon: <Store className="w-5 h-5" />, label: "Brands", path: "/brands" },
            ].map((item, index) => (
              <li
                key={index}
                onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                className="transform transition-all duration-300"
              >
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-3 text-[#1e4b6b] rounded-lg hover:bg-[#1e4b6b]/5 hover:text-[#8B6B43] transition-all duration-300 group"
                >
                  <span className="transform transition-transform duration-300 group-hover:scale-110 text-[#ECB774]">
                    {item.icon}
                  </span>
                  <span className="ml-3 font-medium">{item.label}</span>
                  <span className="absolute left-0 w-1 h-8 bg-[#ECB774] rounded-r transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 text-red-500 hover:text-[#1e4b6b] bg-white/80 rounded-lg border border-[#ECB774] hover:border-[#1e4b6b] hover:bg-[#ECB774]/10 transition-all duration-300 group"
        >
          <FaSignOutAlt className="mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
          <span>Log out</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
