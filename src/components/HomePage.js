import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import { useData } from "./DataContext";
import SearchBar from "./SearchBar";

const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const data = useData();
  
  useEffect(() => {
    if (!data) return;

    if (searchTerm.trim() === "") {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
      return;
    }

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
  }, [searchTerm, data]);

  return (
    <div className="homepage">
      <h1>Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary</h1>
      <p>Search by name or keyword, or browse the entries.</p>

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
