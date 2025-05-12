import { useRef, useEffect } from 'react';
import DropdownItem from './DropdownItem';
import useDropdownNavigation from '../hooks/useDropdownNavigation';
import useClickOutside from '../hooks/useClickOutside';
import useSearchResults from '../hooks/useSearchResults';
import useSearchNavigation from '../hooks/useSearchNavigation';
import '../styles/SearchBar.css';
import useSearchFilters from '../hooks/useSearchFilters';

// this component handles all searches of the CMS data
const SearchBar = ({
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex
}) => {
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
  const {
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations
  } = useSearchFilters(searchTerm);

  const { totalResults, noResults } = useSearchResults({
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    searchTerm
  });

  // handles search submissions
  const handleSearchSubmit = () => {
    if (totalResults.length === 0) {
      // TODO: replace console log for actual error handling message
      console.log("No results to show for:", searchTerm);
    } else {
      console.log("Running search for:", searchTerm);
    }
  };
  
  // this function finds the proper link to redirect to the requested site
  const handleSelect = useSearchNavigation({
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    setSearchTerm,
    setShowDropdown,
    setSelectedIndex
  });
  
  // this function allows navigation through dropdown results with keyboard
  const handleKeyDown = useDropdownNavigation({
    totalResults,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
    showDropdown,
    itemRefs
  });

  // this hook allows scrolling through dropdown list
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // this hook closes dropdown results if user navigates outside search bar
  useClickOutside(dropdownRef, () => setShowDropdown(false), '.search-container');

  // actual render block
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Enter name or keyword..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <div className="dropdown" ref={dropdownRef}>
          <ul className="dropdown-list">
            {totalResults.map((item, index) => (
              <DropdownItem
                key={item.slug || item.title || item}
                item={item}
                index={index}
                selectedIndex={selectedIndex}
                itemRef={(el) => (itemRefs.current[index] = el)}
                onClick={handleSelect}
              />
            ))}
          </ul>
        </div>
      )}

      {noResults && (
        <div className="no-results-warning">
          <p>No matches found for your search. Please try a different name or keyword.</p>
        </div>
      )}

      <button
        className="search-button"
        onClick={handleSearchSubmit}
        disabled={searchTerm.length === 0}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
