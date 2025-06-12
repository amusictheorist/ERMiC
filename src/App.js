import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navigation/Navbar";
import Footer from "./components/navigation/Footer";
import ScrollToTop from './components/navigation/ScrollToTop';
import { DataProvider } from "./components/DataContext";
import LoginGate from "./components/LoginGate";

const App = () => {
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
    <LoginGate>
      <DataProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar {...searchState} />
          <ScrollToTop />
          <div className="flex-1 pt-16 px-4">
            <Outlet context={searchState} />
          </div>
          <Footer />
        </div>
      </DataProvider>
    </LoginGate>
  );
};

export default App;
