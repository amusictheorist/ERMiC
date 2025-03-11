import "../styles/HomePage.css";
import { useState, useEffect, useRef } from "react";
import { useData } from "./DataContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const data = useData();
  const navigate = useNavigate();
  
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!data) return;
    if (searchTerm.trim() === "") {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    };

    const musicianResults = data.musicianCollection.items.filter((musician) =>
      `${musician.firstName} ${musician.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const workResults = data.workCollection.items.filter((work) =>
      work.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const writingResults = data.writingCollection.items.filter((writing) =>
      writing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const occupationResults = Array.from(
      new Set(
        data.musicianCollection.items.flatMap((musician) =>
          musician.occupation.filter((occ) =>
            occ.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    );

    setFilteredMusicians(musicianResults);
    setFilteredWorks(workResults);
    setFilteredWritings(writingResults);
    setFilteredOccupations(occupationResults);
    setShowDropdown(
      musicianResults.length > 0 ||
      workResults.length > 0 ||
      writingResults.length > 0 ||
      occupationResults.length > 0
    );
    setSelectedIndex(-1);
  }, [searchTerm, data]);

  const handleSelectMusician = (musician) => {
    navigate(`/musician/${musician.slug}`);
    setSearchTerm("");
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectOccupation = (occupation) => {
    console.log(`Navigating to /search-results?occupation=${occupation}`);
    navigate(`/search-results?occupation=${encodeURIComponent(occupation)}`);
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectWork = (work) => {
    if (work.musician) {
      navigate(`/musician/${work.musician.slug}`);
    }
    setSearchTerm("");
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSelectWriting = (writing) => {
    if (writing.musician) {
      navigate(`/musician/${writing.musician.slug}`);
    }
    setSearchTerm("");
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    const totalResults = [
      ...filteredMusicians,
      ...filteredOccupations,
      ...filteredWorks,
      ...filteredWritings
    ];
  
    if (!showDropdown || totalResults.length === 0) return;
  
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < totalResults.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : totalResults.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
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

  return (
    <div className="homepage">
      <h1>Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary</h1>
      <p>Search by name or keyword, or browse the entries.</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter name or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
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
                      className={`dropdown-item ${selectedIndex === index
                        ? "selected"
                        : ""                        
                        }`}
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
                      className={`dropdown-item ${selectedIndex === index + filteredMusicians.length
                        ? "selected"
                        : ""
                        }`}
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
                      className={`dropdown-item ${selectedIndex ===
                        index + filteredMusicians.length + filteredOccupations.length
                        ? "selected"
                        : ""
                        }`}
                    >
                      {work.title}
                    </li>
                  ))}
      
                  {filteredWritings.map((writing, index) => (
                    <li
                      key={writing.title}
                      ref={(el) =>
                      (itemRefs.current[
                        index +
                      filteredMusicians.length +
                      filteredOccupations.length +
                        filteredWorks.length
                      ] = el)
                      }
                      onClick={() => handleSelectWriting(writing)}
                      className={`dropdown-item ${selectedIndex ===
                        index +
                      filteredMusicians.length +
                      filteredOccupations.length +
                        filteredWorks.length
                        ? "selected"
                        : ""
                        }`}
                    >
                      {writing.title}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )}        
      </div>
    </div>
  );
};

export default HomePage;
