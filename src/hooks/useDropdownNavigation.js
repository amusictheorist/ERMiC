import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useDropdownNavigation = ({
  totalResults,
  selectedIndex,
  setSelectedIndex,
  handleSelect,
  showDropdown,
  setShowDropdown,
  itemRefs,
  searchTerm,
  setSearchTerm
}) => {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      if (totalResults.length === 0) return;
      setSelectedIndex((prevIndex) =>
        prevIndex < totalResults.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      if (totalResults.length === 0) return;
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : totalResults.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && totalResults.length > 0) {
        handleSelect(totalResults[selectedIndex]);
      } else if (searchTerm.trim()) {
        navigate(`/results?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm('');
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }
  };

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex, itemRefs]);

  return handleKeyDown;
};

export default useDropdownNavigation;