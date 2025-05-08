import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./components/DataContext";
import { useState } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Browse from "./components/Browse";
import MusicianPage from "./components/MusicianPage";
import SearchResultsPage from "./components/SearchResultsPage";
import Footer from "./components/Footer";
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DataProvider>
      <Router>
        <div className="body">
          <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
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
