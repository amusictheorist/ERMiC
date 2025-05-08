import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownItem from './DropdownItem';
import '../styles/SearchBar.css';

// this component handles all searches of the CMS data
const SearchBar = ({
  searchTerm,
  setSearchTerm,
  filteredMusicians,
  filteredWorks,
  filteredWritings,
  filteredOccupations,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex
}) => {
  const [noResults, setNoResults] = useState(false);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  // all filtered results are gathered into an array so dropdwon results can be rendered
  const totalResults = [
    ...filteredMusicians,
    ...filteredOccupations,
    ...filteredWorks,
    ...filteredWritings
  ];

  useEffect(() => {
    setNoResults(totalResults.length === 0 && searchTerm.length > 0);
  }, [totalResults, searchTerm]);

  // handles search submissions
  const handleSearchSubmit = () => {
    if (totalResults.length === 0) {
      // TODO: replace console log for actual error handling message
      console.log("No results to show for:", searchTerm);
    } else {
      console.log("Running search for:", searchTerm);
    }
  };

  // this function allows navigation through dropdown results with keyboard
  const handleKeyDown = (e) => {
    if (!showDropdown || totalResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) =>
        prevIndex < totalResults.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : totalResults.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleSelect(totalResults[selectedIndex]);
      } else {
        handleSearchSubmit();
      }
    }
  };

  // this function finds the proper link to redirect to the requested site
  const handleSelect = (item) => {
    if (filteredOccupations.includes(item)) {
      navigate(`/search-results?occupation=${item}`);
    } else if (filteredMusicians.includes(item)) {
      navigate(`/musician/${item.slug}`);
    } else if ((filteredWorks.includes(item) || filteredWritings.includes(item)) && item.musician) {
      navigate(`/musician/${item.musician.slug}`);
    }

    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // this hook allows to scroll through dropdown list
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // this hook closes dropdown results if user navigates outside search bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest('.search-container')
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowDropdown]);

  // actual render block
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Enter name or keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

      <button className="search-button" onClick={handleSearchSubmit}>Search</button>
    </div>
  );
};

export default SearchBar;
