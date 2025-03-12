import '../styles/Navbar.css';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="logo">
        {isHomePage
          ? 'European Refugee Musicians in Canada Online Biographical Dictionary'
          : 'ERMiC'}
      </div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {!isHomePage && (
        <div className='search-container'>
          <input
            type='text'
            placeholder='Enter name or keyword...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
