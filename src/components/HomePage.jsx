import "../styles/HomePage.css";
import { useState } from "react";
import SearchBar from "./SearchBar";
import useSearchFilters from "../hooks/useSearchFilters";

// landing page for the site, where main search functionality is implemented
const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const {
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    showDropdown,
    setShowDropdown
  } = useSearchFilters(searchTerm);
  
  // render block
  return (
    <div className="homepage">
      <h1>Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary</h1>
      <p>Search by name or keyword and select an entry.</p>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredMusicians={filteredMusicians}
        filteredWorks={filteredWorks}
        filteredWritings={filteredWritings}
        filteredOccupations={filteredOccupations}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
    </div>
  );
};

export default HomePage;
