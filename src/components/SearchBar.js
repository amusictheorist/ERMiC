import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownItem from './DropdownItem';
import '../styles/SearchBar.css';

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
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
  const navigate = useNavigate();

  const totalResults = [
    ...filteredMusicians,
    ...filteredOccupations,
    ...filteredWorks,
    ...filteredWritings
  ];

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
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(totalResults[selectedIndex]);
    }
  };

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

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

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
          {totalResults.length === 0 ? (
            <p className="dropdown-no-results">No results found</p>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
