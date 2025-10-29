import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import AddRecipeModal from "./AddRecipeModal";
import LoginModal from "./LoginModal"

export default function Navbar({ onRecipeAdded, setSearchTerm }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
            <button
              onClick={() => setLoginOpen(true)}
              className="hover:underline"
            >
              Login
            </button>
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
            <button
              onClick={() => setLoginOpen(true)}
              className="hover:underline"
            >
              Login
            </button>
          </div>
        )}
      </nav>
      {isAddOpen && <AddRecipeModal onClose={() => setAddOpen(false)} onRecipeAdded={onRecipeAdded} />}
      {isLoginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </>
  );
}
