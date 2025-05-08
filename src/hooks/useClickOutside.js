import { useEffect } from "react"

const useClickOutside = (ref, callback, containerSelector = null) => {
  useEffect(() => {
    const handleClick = (event) => {
      const container = containerSelector
        ? event.target.closest(containerSelector)
        : null;
      
      if (ref.current && !ref.current.contains(event.target) && !container) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback, containerSelector]);
};

export default useClickOutside;