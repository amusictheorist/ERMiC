import { useEffect, useState } from "react";
import { useData } from "../components/DataContext";
import { match } from "../utils/searchHelpers";

 // this custom hook handles the filtered search function
const useSearchFilters = (searchTerm) => {
  const { data, loading, error } = useData() || {};
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [filteredPerformances, setFilteredPerformances] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  // if no data has been received or nothing is typed in yet, set everything to empty
    if (loading || error || searchTerm.trim() === '') {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setFilteredPerformances([]);
      setFilteredAuthors([]);
      setShowDropdown(false);
      return;
    }

    try {
      const m = match(searchTerm);

    // guard against missing or malformed collections
      const musicianItems = Array.isArray(data?.musicianCollection) ? data.musicianCollection : [];
      const workItems = Array.isArray(data?.workCollection) ? data.workCollection : [];
      const writingItems = Array.isArray(data?.writingCollection) ? data.writingCollection : [];
      const performanceItems = Array.isArray(data?.performanceAndMediaCollection) ? data.performanceAndMediaCollection : [];
      const authorItems = Array.isArray(data.biographyAuthorCollection?.items) ? data.biographyAuthorCollection.items : [];

      // filtering through the musician collection from CMS
      const musicianResults = musicianItems.filter((musician) => {
        const fullName = `${musician.firstName || ''} ${musician.surname || ''}`;
        return m(fullName);
      });
      
      // filtering through the work collection from CMS
      const workResults = workItems.filter((work) => m(work.title));
      
      // filtering through the writing collection from CMS
      const writingResults = writingItems.filter((writing) => m(writing.title));
      
      // filtering through through the performances collection from CMS
      const performanceResults = performanceItems.filter((performance) => m(performance.title));

      // filtering through the authors collection from CMS
      const authorResults = authorItems
        .map((author) => ({
          ...author,
          fullName: `${author.names || ''} ${author.surnames || ''}`.trim()
        }))
        .filter((author) => m(author.fullName));
      
      // filtering through the occupations in the CMS
      const occupationResults = Array.from(
        new Set(
          musicianItems.flatMap((musician) =>
            (musician.occupation || []).filter((occ) => m(occ))
          )
        )
      );
      
      // these update the results from the search filters as the user types. results are rendered by the DropdownItem component
      setFilteredMusicians(musicianResults);
      setFilteredWorks(workResults);
      setFilteredWritings(writingResults);
      setFilteredOccupations(occupationResults);
      setFilteredPerformances(performanceResults);
      setFilteredAuthors(authorResults);
      setShowDropdown(
        musicianResults.length > 0 ||
        workResults.length > 0 ||
        writingResults.length > 0 ||
        occupationResults.length > 0 ||
        performanceResults.length > 0 ||
        authorResults.length > 0
      );
    } catch (err) {
      console.error('Search filtering failed:', err);
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setFilteredPerformances([]);
      setFilteredAuthors([]);
      setShowDropdown(false);
    }
  }, [searchTerm, data, loading, error]);
  
  return {
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    filteredPerformances,
    filteredAuthors,
    showDropdown,
    setShowDropdown
  };
};

export default useSearchFilters;