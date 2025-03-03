import './App.css';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import MusicianPage from './components/MusicianPage';

function App() {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (term) => {
    setQuery(term);
  };

  return (
    <div>
      <Navbar />
      <HomePage onSearchSubmit={handleSearchSubmit} />
      {query && <MusicianPage searchTerm={query} />}
    </div>
  );
}

export default App;
