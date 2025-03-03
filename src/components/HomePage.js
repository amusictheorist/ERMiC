import '../styles/HomePage.css';
import { useState } from 'react';

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Searching for: ', searchTerm);
  };

  return (
    <div className="homepage">
      <h1>Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary</h1>
      <p>Search by name or keyword, or browse the entries.</p>

      <form onSubmit={handleSearchSubmit} className='search-form'>
        <input
          type='text'
          placeholder='Enter name or keyword...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='search-input'
        />
        <button type='submit' className='search-button'>Search</button>
      </form>
    </div>
  );
};

export default Homepage;
