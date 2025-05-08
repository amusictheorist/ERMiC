import { useEffect, useMemo, useState } from "react"

// this hook gathers all filtered results into an array so dropdwon results can be rendered
const useSearchResults = ({
  filteredMusicians,
  filteredWorks,
  filteredWritings,
  filteredOccupations,
  searchTerm
}) => {
  const [noResults, setNoResults] = useState(false);

  const totalResults = useMemo(() => [
    ...filteredMusicians,
    ...filteredOccupations,
    ...filteredWorks,
    ...filteredWritings
  ], [filteredMusicians, filteredOccupations, filteredWorks, filteredWritings]);

  useEffect(() => {
    setNoResults(totalResults.length === 0 && searchTerm.length > 0);
  }, [totalResults, searchTerm]);

  return { totalResults, noResults };
};

export default useSearchResults;