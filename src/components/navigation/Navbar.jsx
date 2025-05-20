import '../../styles/Navbar.css';
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
    <nav className={`navbar ${isHomePage ? 'home' : 'internal'}`}>
      <div className={`logo ${isHomePage ? 'logo-full' : 'logo-short'}`}>
        {isHomePage
          ? 'European Refugee Musicians in Canada Online Biographical Dictionary'
          : 'ERMiC'}
      </div>
      
      <div className={`links ${isHomePage ? 'links-right' : 'links-center'}`}>
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
