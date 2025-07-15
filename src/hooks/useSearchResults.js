import { useEffect, useMemo, useState } from "react"

// this hook gathers all filtered results into an array so dropdwon results can be rendered
const useSearchResults = ({
  filteredMusicians,
  filteredWorks,
  filteredWritings,
  filteredOccupations,
  filteredPerformances,
  filteredAuthors,
  searchTerm
}) => {
  const [noResults, setNoResults] = useState(false);

  const totalResults = useMemo(() => {
    // fall back to guard against empty arrays if any props are undefined or null
    const musicians = filteredMusicians || [];
    const works = filteredWorks || [];
    const writings = filteredWritings || [];
    const occupations = filteredOccupations || [];
    const performances = filteredPerformances || [];
    const authors = filteredAuthors || [];

    return [...musicians, ...occupations, ...works, ...writings, ...performances, ...authors];
  }, [filteredMusicians, filteredOccupations, filteredWorks, filteredWritings, filteredPerformances, filteredAuthors]);

  // console.log('total results:', totalResults);

  useEffect(() => {
    const safeSearch = typeof searchTerm === 'string' ? searchTerm : '';
    setNoResults(totalResults.length === 0 && safeSearch.trim().length > 0);
  }, [totalResults, searchTerm]);

  return { totalResults, noResults };
};

export default useSearchResults;