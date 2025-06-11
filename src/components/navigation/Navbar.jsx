import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';
import { Menu } from 'lucide-react';
import longLogo from '../../assets/longLogo.png';
import shortLogo from '../../assets/shortLogo.png';

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-100 border-b border-slate-200 px-4 py-2">
      {isHomePage ? (
        <div className="flex items-center justify-between py-2">
          <img
            src={longLogo}
            alt='European Refugee Musicians in Canada logo'
            className='h-8 sm:h-12 md:h-16 object-contain flex-shrink-0'
          />
  
          <div className="font-sans hidden sm:flex gap-4 flex-1 justify-end">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            {/* <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link> */}
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
          <div className="flex items-center justify-between py-2 space-x-4">
            <img
              src={shortLogo}
              alt='ERMiC logo'
              className='h-6 sm:h-8 md:h-10 object-contain flex-shrink-0'
            />
  
          <div className="font-sans hidden sm:flex gap-4 flex-shrink-0">
            <Link to="/">Home</Link>
            <Link to="/browse">Browse</Link>
            {/* <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link> */}
          </div>
  
          <div className="flex-1 min-w-0">
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
      {menuOpen && (
        <div className="font-sans sm:hidden mt-2 flex flex-col gap-2">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
