import { useEffect, useState } from "react";
import { useData } from "../components/DataContext";

 // this custom hook handles the filtered search function
const useSearchFilters = (searchTerm) => {
  const data = useData();
  const [filteredMusicians, setFilteredMusicians] = useState([]);
  const [filteredWritings, setFilteredWritings] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [filteredOccupations, setFilteredOccupations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!data) return;

    // if nothing is typed in yet, set everything to empty
    if (searchTerm.trim() === '') {
      setFilteredMusicians([]);
      setFilteredWorks([]);
      setFilteredWritings([]);
      setFilteredOccupations([]);
      setShowDropdown(false);
      return;
    }

    // filtering through the musician collection from CMS
    const musicianResults = data.musicianCollection.items.filter((musician) =>
      `${musician.firstName} ${musician.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
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

  // render block
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