import { useEffect } from "react";

const useDropdownNavigation = ({
  totalResults,
  selectedIndex,
  setSelectedIndex,
  handleSelect,
  showDropdown,
  itemRefs
}) => {
  const handleKeyDown = (e) => {
    if (!showDropdown || totalResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) =>
        prevIndex < totalResults.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : totalResults.length - 1
      );
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleSelect(totalResults[selectedIndex]);
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