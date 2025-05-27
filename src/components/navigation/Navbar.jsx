import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';
import { Menu } from 'lucide-react';

// this component handles navigation links across the website
const Navbar = ({
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex
}) => {

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-100 border-b border-slate-200 px-4 py2">
      {isHomePage ? (
        <div className="flex items-center justify-between py-2">
          <div className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg flex-[2]">
            European Refugee Musicians in Canada Online Biographical Dictionary
          </div>

          <div className="hidden sm:flex gap-4 flex-1 justify-end">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <button
            className="sm:hidden ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      ) : (
        <div className="relative flex items-center justify-between py-2">
          <div className="text-blue-600 font-semibold text-sm sm:text-base md:text-lg flex-shrink-0">
            ERMiC
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="hidden sm:block flex-shrink-0">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              compact={true}
            />
          </div>

          <button
            className="sm:hidden ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
