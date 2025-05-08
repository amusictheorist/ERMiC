import '../styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

// this component handles navigation links across the website
const Navbar = ({ searchTerm, setSearchTerm }) => {
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter name or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
