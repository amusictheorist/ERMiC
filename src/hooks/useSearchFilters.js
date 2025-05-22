import { useEffect, useState } from "react";
import { useData } from "../components/DataContext";

 // this custom hook handles the filtered search function
const useSearchFilters = (searchTerm) => {
  const { data, loading, error } = useData() || {};
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  // if no data has been received or nothing is typed in yet, set everything to empty
    if (loading || error || searchTerm.trim() === '') {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
      return;
    }

    try {
    // guard against missing or malformed collections
      const musicianItems = Array.isArray(data.musicianCollection?.items) ? data.musicianCollection.items : [];
      const workItems = Array.isArray(data.workCollection?.items) ? data.workCollection.items : [];
      const writingItems = Array.isArray(data.writingCollection?.items) ? data.writingCollection.items : [];
      const search = searchTerm.toLowerCase();
      
      // filtering through the musician collection from CMS
      const musicianResults = musicianItems.filter((musician) => {
        const fullName = `${musician.firstName || ''} ${musician.surname || ''}`;
        return fullName.toLowerCase().includes(search);
      });
      
      // filtering through the work collection from CMS
      const workResults = workItems.filter((work) =>
        (work.title || '').toLowerCase().includes(search)
      );
      
      // filtering through the writing collection from CMS
      const writingResults = writingItems.filter((writing) =>
        (writing.title || '').toLowerCase().includes(search)
      );
      
      // filtering through the occupations in the CMS
      const occupationResults = Array.from(
        new Set(
          musicianItems.flatMap((musician) =>
            (musician.occupation || []).filter((occ) =>
              occ.toLowerCase().includes(search)
            )
          )
        )
      );
      
      // these update the results from the search filters as the user types. results are rendered by the DropdownItem component
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
    } catch (err) {
      console.error('Search filtering failed:', err);
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
    }
  }, [searchTerm, data, loading, error]);
  
  return {
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    showDropdown,
    setShowDropdown
  };
};

export default useSearchFilters;