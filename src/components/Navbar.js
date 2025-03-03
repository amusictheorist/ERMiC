import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        European Refugee Musicians in Canada Online Biographical Dictionary
      </div>
      <div className="links">
        <a href="#">Home</a>
        <a href="#">Browse</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
