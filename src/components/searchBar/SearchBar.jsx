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
    <div
      className={`search-container relative text-slate-700 text-lg w-full max-w-[300px] mx-auto mt-4 ${compact ? 'mt-0 ml-0 mr-0 flex items-center gap-2' : ''}`}
    >
      <input
        className="w-full px-4 py-2 text-base border border-gray-300 rounded"
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
        <div className="abolute top-10 left-0 w-full bg-white border border-gray-300 rounded shadow-md max-h-[400px] overflow-y-auto z-[1000]" ref={dropdownRef}>
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

      {noResults && (
        <div className="text-red-600 text-sm mt-2 text-center">
          <p>No matches found for your search. Please try a different name or keyword.</p>
        </div>
      )}

      {errorMessage && (
        <div className='text-red-700 bg-red-50 border border-red-200rounded px-3 py-2 text-sm mt-2 text-center'>
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        className={`px-4 py-2 text-base bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${compact ? 'mt-0' : 'mt-2'}`}
        onClick={handleSearchSubmit}
        disabled={searchTerm.length === 0}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
