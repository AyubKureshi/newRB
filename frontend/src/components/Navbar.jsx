import { Search, Menu, X } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import AddRecipeModal from "./AddRecipeModal";
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal";

export default function Navbar({ onRecipeAdded, setSearchTerm }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rb_user");
    if (stored) {
      setUser(JSON.parse(stored));
      const token = localStorage.getItem("rb_token");
      if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rb_token");
    localStorage.removeItem("rb_user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <>
      <nav className="bg-black shadow-lg w-full fixed top-0 left-0 z-50">
        {/* Navbar top row */}
        <div className="flex justify-between items-center px-4 md:px-6 py-3 h-20 w-full">
          {/* Logo */}
          <h1 className="text-xl md:text-2xl text-orange-600 font-bold">
            RecipeBook
          </h1>

          {/* Search bar (hidden on small screens) */}
          <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1">
            <Search className="text-black" />
            <input
              type="text"
              placeholder="Search Recipes"
              className="outline-none px-2 bg-transparent text-sm text-black"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex gap-4 items-center text-white">
            <button
              onClick={() => setAddOpen(true)}
              className="hover:underline"
            >
              Add Recipe
            </button>
            <button className="hover:underline">Your Recipes</button>
            {user ? (
              <>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setLoginOpen(true)} className="hover:underline">
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Icon (always right-aligned) */}
          <div className="md:hidden flex items-center justify-end w-8">
            {menuOpen ? (
              <X
                className="text-white cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <Menu
                className="text-white cursor-pointer"
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>
        </div>

        {/* ✅ Mobile search bar (below top row, not inside dropdown) */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center bg-white rounded-full px-3 py-1">
            <Search className="text-black" size={18} />
            <input
              type="text"
              placeholder="Search Recipes"
              className="outline-none px-2 bg-transparent text-sm text-black w-full"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        {/* Mobile dropdown (full-width below navbar) */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d0e12] text-white flex flex-col items-center py-4 gap-3 border-t border-gray-700 animate-slideDown">
            <button
              onClick={() => setAddOpen(true)}
              className="hover:underline"
            >
              Add Recipe
            </button>
            <button className="hover:underline">Your Recipes</button>
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:underline text-red-400"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="hover:underline"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>
      {isAddOpen && <AddRecipeModal onClose={() => setAddOpen(false)} onRecipeAdded={onRecipeAdded} />}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setLoginOpen(false)}
          onLogin={(user) => {
            setUser(user);
            setLoginOpen(false);
          }}
          onOpenRegister={() => {
            setLoginOpen(false);
            setRegisterOpen(true);
          }}
        />
      )}
      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setRegisterOpen(false)}
          onLogin={(user) => {
            setUser(user);
            setRegisterOpen(false);
          }}
          onLoginOpen={() => {
            setLoginOpen(true);
            setRegisterOpen(false);
          }}
        />
      )}
    </>
  );
}
