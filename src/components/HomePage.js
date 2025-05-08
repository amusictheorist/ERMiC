import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import { useData } from "./DataContext";
import SearchBar from "./SearchBar";

// landing page for the site, where main search functionality is implemented
const HomePage = ({ searchTerm, setSearchTerm }) => {
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const data = useData();
  
  // this hook handles the filtered search function
  useEffect(() => {
    if (!data) return;

    // if nothing is typed in yet, set everything to empty
    if (searchTerm.trim() === "") {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
      return;
    }

    // filtering through the musician collection from CMS
    const musicianResults = data.musicianCollection.items.filter((musician) =>
      `${musician.firstName} ${musician.surname}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );
    
    // filtering through the work collection from CMS
    const workResults = data.workCollection.items.filter((work) =>
      work.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // filtering through the writing collection from CMS
    const writingResults = data.writingCollection.items.filter((writing) =>
      writing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // filtering through the occupations in the CMS
    const occupationResults = Array.from(
      new Set(
        data.musicianCollection.items.flatMap((musician) =>
          musician.occupation.filter((occ) =>
            occ.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      )
    );

    // these update the results from the search filters as the user types. results are rendered by the DropDownItem component
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

  // actual render block
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
