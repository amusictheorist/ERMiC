import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';

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

  return (
    <nav
      className={`bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center ${isHomePage ? 'justify-between' : 'justify-between relative'}`}
    >
      <div className={`${isHomePage ? 'text-blue-600 font-semibold text-sm flex-[2]' : 'text-blue-600 font-semibold text-sm flex-1'}`}>
        {isHomePage
          ? 'European Refugee Musicians in Canada Online Biographical Dictionary'
          : 'ERMiC'}
      </div>
      
      <div
        className={`flex gap-4 ${isHomePage ? 'flex-1 justify-end' : 'absolute left-1/2 transform -translate-x-1/2'}`}
      >
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      
      {!isHomePage && (
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          compact={true}
      />
      )}
    </nav>
  );
};

export default Navbar;
