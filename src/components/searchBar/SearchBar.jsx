import React, { useRef, useEffect, useState } from 'react';
import DropdownItem from './DropdownItem';
import useDropdownNavigation from '../../hooks/useDropdownNavigation';
import useClickOutside from '../../hooks/useClickOutside';
import useSearchResults from '../../hooks/useSearchResults';
import useSearchNavigation from '../../hooks/useSearchNavigation';
import useSearchFilters from '../../hooks/useSearchFilters';
import '../../styles/SearchBar.css';

// this component handles all searches of the CMS data
const SearchBar = ({
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex,
  compact = false
}) => {
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    filteredMusicians = [],
    filteredWorks = [],
    filteredWritings = [],
    filteredOccupations = []
  } = useSearchFilters(searchTerm);

  const { totalResults = [], noResults = false } = useSearchResults({
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    searchTerm
  });

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
  
  // handles search submissions
  const handleSearchSubmit = () => {
    if (totalResults.length === 0) {
      setErrorMessage(`No results to show for "${searchTerm}"`)
    } else {
      setErrorMessage('');
      handleSelect(totalResults[selectedIndex] || totalResults[0]);
    }
  };
  
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
    <div className={`search-container ${compact ? 'compact' : ''}`}>
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
                key={`${item.sys?.id || index}-${item.title || item.name || item}`}
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

      {errorMessage && (
        <div className='error-message'>
          <p>{errorMessage}</p>
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
