import { useEffect, useState } from "react";
import { useData } from "../components/DataContext";

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
    // guard against missing or malformed collections
      const musicianItems = Array.isArray(data.musicianDetailsCollection?.items) ? data.musicianDetailsCollection.items : [];
      const workItems = Array.isArray(data.workCollection?.items) ? data.workCollection.items : [];
      const writingItems = Array.isArray(data.writingCollection?.items) ? data.writingCollection.items : [];
      const performanceItems = Array.isArray(data.performanceAndMediaCollection?.items) ? data.performanceAndMediaCollection.items : [];
      const authorItems = Array.isArray(data.biographyAuthorCollection?.items) ? data.biographyAuthorCollection.items : [];
      
      const normalizeText = (str) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const search = normalizeText(searchTerm);

      // filtering through the musician collection from CMS
      const musicianResults = musicianItems.filter((musician) => {
        const fullName = `${musician.firstName || ''} ${musician.surname || ''}`;
        return normalizeText(fullName).includes(normalizeText(search));
      });
      
      // filtering through the work collection from CMS
      const workResults = workItems.filter((work) =>
        normalizeText(work.title || '').includes(normalizeText(search))
      );
      
      // filtering through the writing collection from CMS
      const writingResults = writingItems.filter((writing) =>
        normalizeText(writing.title || '').includes(normalizeText(search))
      );
      
      // filtering through through the performances collection from CMS
      const performanceResults = performanceItems.filter((performance) =>
        normalizeText(performance.title || '').includes(normalizeText(search))
      );

      // filtering through the authors collection from CMS
      const authorResults = authorItems
        .map((author) => ({
          ...author,
          fullName: `${author.names || ''} ${author.surnames || ''}`.trim()
        }))
        .filter((author) =>
          normalizeText(author.fullName).includes(normalizeText(search))
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