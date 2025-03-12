import '../styles/SearchBar.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
  
  const handleKeyDown = (e) => {
    const totalResults = [
      ...filteredMusicians,
      ...filteredOccupations,
      ...filteredWorks,
      ...filteredWritings
    ];

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
      const selectedItem = totalResults[selectedIndex];

      if (filteredOccupations.includes(selectedItem)) {
        handleSelectOccupation(selectedItem);
      } else if (filteredMusicians.includes(selectedItem)) {
        handleSelectMusician(selectedItem);
      } else if (filteredWorks.includes(selectedItem)) {
        handleSelectWork(selectedItem);
      } else if (filteredWritings.includes(selectedItem)) {
        handleSelectWriting(selectedItem);
      }
    }
  };

  const handleSelectMusician = (musician) => {
    navigate(`/musician/${musician.slug}`);
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectOccupation = (occupation) => {
    navigate(`/search-results?occupation=${occupation}`);
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectWork = (work) => {
    if (work.musician) {
      navigate(`/musician/${work.musician.slug}`);
    }
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectWriting = (writing) => {
    if (writing.musician) {
      navigate(`/musician/${writing.musician.slug}`);
    }
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

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
          {filteredMusicians.length === 0 &&
            filteredWorks.length === 0 &&
            filteredWritings.length === 0 &&
            filteredOccupations.length === 0 ? (
            <p className="dropdown-no-results">No results found</p>
          ) : (
            <ul className="dropdown-list">
              {filteredMusicians.map((musician, index) => (
                <li
                  key={musician.slug}
                  ref={(el) => (itemRefs.current[index] = el)}
                  onClick={() => handleSelectMusician(musician)}
                  className={`dropdown-item ${selectedIndex === index ? "selected" : ""}`}
                >
                  {musician.firstName} {musician.surname}
                </li>
              ))}

              {filteredOccupations.map((occupation, index) => (
                <li
                  key={occupation}
                  ref={(el) =>
                    (itemRefs.current[index + filteredMusicians.length] = el)
                  }
                  onClick={() => handleSelectOccupation(occupation)}
                  className={`dropdown-item ${selectedIndex === index + filteredMusicians.length ? "selected" : ""}`}
                >
                  {occupation}
                </li>
              ))}

              {filteredWorks.map((work, index) => (
                <li
                  key={work.title}
                  ref={(el) =>
                    (itemRefs.current[
                      index + filteredMusicians.length + filteredOccupations.length
                    ] = el)
                  }
                  onClick={() => handleSelectWork(work)}
                  className={`dropdown-item ${selectedIndex === index + filteredMusicians.length + filteredOccupations.length ? "selected" : ""}`}
                >
                  {work.title}
                </li>
              ))}

              {filteredWritings.map((writing, index) => (
                <li
                  key={writing.title}
                  ref={(el) =>
                    (itemRefs.current[
                      index + filteredMusicians.length + filteredOccupations.length + filteredWorks.length
                    ] = el)
                  }
                  onClick={() => handleSelectWriting(writing)}
                  className={`dropdown-item ${selectedIndex === index + filteredMusicians.length + filteredOccupations.length + filteredWorks.length ? "selected" : ""}`}
                >
                  {writing.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
