import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./components/DataContext";
import { useState } from "react";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/navigation/Footer";
import HomePage from "./components/pages/HomePage";
import Browse from "./components/browse/Browse";
import MusicianPage from "./components/pages/MusicianPage";
import SearchResultsPage from "./components/pages/SearchResultsPage";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchState = {
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    selectedIndex,
    setSelectedIndex
  };

  return (
    <DataProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar {...searchState} />
          <div className="flex-1 pt-16 px-4">
          <Routes>
              <Route path="/" element={<HomePage {...searchState} />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/musician/:slug" element={<MusicianPage />} />
              <Route path="/search-results" element={<SearchResultsPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
