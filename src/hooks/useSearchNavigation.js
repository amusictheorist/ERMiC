import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useSearchNavigation = ({
  filteredMusicians,
  filteredWorks,
  filteredWritings,
  filteredOccupations,
  filteredPerformances,
  filteredAuthors,
  setSearchTerm,
  setShowDropdown,
  setSelectedIndex
}) => {
  const navigate = useNavigate();

  
  const handleSelect = useCallback((item) => {
    const clearSearchUI = () => {
      setSearchTerm('');
      setShowDropdown(false);
      setSelectedIndex(-1);
    };

    try {
      if (!item) throw new Error('No item provided for navigation');

      if (filteredOccupations.includes(item)) {
        navigate(`/results/occupation?occupation=${item}`);
        clearSearchUI();
        return;
      }

      if (filteredMusicians.includes(item)) {
        if (!item.slug) throw new Error('Musician missing slug');
        navigate(`/musician/${item.slug}`);
        clearSearchUI();
        return;
      }

      if (filteredWorks.includes(item)) {
        if (!item.musician?.slug) throw new Error('Work missing musician slug');
        navigate(`/musician/${item.musician.slug}`);
        clearSearchUI();
        return;
      }

      if (filteredWritings.includes(item)) {
        if (!item.musician?.slug) throw new Error('Writing missing musician slug');
        navigate(`/musician/${item.musician.slug}`);
        clearSearchUI();
        return;
      }

      if (filteredPerformances.includes(item)) {
        const musicians = item.musiciansCollection?.items || [];

        if (musicians.length === 1) {
          const slug = musicians[0].slug;
          if (!slug) throw new Error('Musician missing slug');
          navigate(`/musician/${slug}`);
        } else {
          navigate(`/results/performance?performance=${encodeURIComponent(item.title || 'Untitled')}`);
        }

        clearSearchUI();
        return;
      }

      if (filteredAuthors.some(a => a === item)) {
        const fullName = `${item.names} ${item.surnames}`;
        navigate(`/results/author?author=${encodeURIComponent(fullName)}`);
        clearSearchUI();
        return;
      }

      throw new Error('Item does not match any known category');
    } catch (error) {
      console.error('Navigation error:', error.message);
    } finally {
      clearSearchUI();
    }
  }, [
    filteredMusicians,
    filteredWorks,
    filteredWritings,
    filteredOccupations,
    filteredPerformances,
    filteredAuthors,
    navigate,
    setSearchTerm,
    setShowDropdown,
    setSelectedIndex
  ]);

  return handleSelect;
};

export default useSearchNavigation;