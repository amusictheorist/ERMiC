import React, { useRef, useEffect, useState } from 'react';
import DropdownItem from './DropdownItem';
import useDropdownNavigation from '../../hooks/useDropdownNavigation';
import useClickOutside from '../../hooks/useClickOutside';
import useSearchResults from '../../hooks/useSearchResults';
import useSearchNavigation from '../../hooks/useSearchNavigation';
import useSearchFilters from '../../hooks/useSearchFilters';

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
    <div className={`search-container w-full max-w-lg mx-auto ${compact ? 'mt-0 flex items-center gap-2' : 'mt-4'}`}>
      <div className={`relative w-full flex ${compact ? 'flex-row items-center gap-2' : 'flex-col sm:flex-row sm:items-center gap-2'}`}>
        <input
          className="w-full px-3 py-2 text-base sm:text-lg border border-gray-300 rounded"
          type="text"
          placeholder="Enter name or keyword..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
        />
  
        <button
          className="px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 mt-2"
          onClick={handleSearchSubmit}
          disabled={searchTerm.length === 0}
        >
          Search
        </button>
  
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow-md max-h-[400px] overflow-y-auto z-[1000]"
          >
            <ul className="list-none p-0 m-0 text-left">
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
      </div>
  
      {noResults && (
        <div className="text-red-600 text-sm mt-2 text-center w-full">
          <p>No matches found for your search. Please try a different name or keyword.</p>
        </div>
      )}
  
      {errorMessage && (
        <div className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm mt-2 text-center w-full">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;