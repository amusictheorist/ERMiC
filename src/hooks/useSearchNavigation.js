import { useCallback } from "react";
import { useNavigate } from "react-router-dom"

const useSearchNavigation = ({
  filteredMusicians,
  filteredWorks,
  filteredWritings,
  filteredOccupations,
  setSearchTerm,
  setShowDropdown,
  setSelectedIndex
}) => {
  const navigate = useNavigate();

  const handleSelect = useCallback((item) => {
    if (filteredOccupations.includes(item)) {
      navigate(`/search-results?occupation=${item}`);
    } else if (filteredMusicians.includes(item)) {
      navigate(`/musician/${item.slug}`);
    } else if ((filteredWorks.includes(item) || filteredWritings.includes(item)) && item.musician) {
      navigate(`/musician/${item.musician.slug}`);
    }

    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, [
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    navigate,
    setSearchTerm,
    setShowDropdown,
    setSelectedIndex
  ]);
  
  return handleSelect;
};

export default useSearchNavigation;