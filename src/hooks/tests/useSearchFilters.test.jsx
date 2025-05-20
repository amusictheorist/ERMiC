import { renderHook } from '@testing-library/react';
import * as DataContext from '../../components/DataContext';
import useSearchFilters from '../useSearchFilters';

const mockData = {
  musicianCollection: {
    items: [
      { firstName: 'Istvan', surname: 'Anhalt', occupation: ['Composer', 'Music Theorist'] },
      { firstName: 'Andreas', surname: 'Barban', occupation: ['Conductor'] }
    ]
  },
  workCollection: {
    items: [
      { title: 'String Quartet No. 1' },
      { title: 'Symphony No. 1' }
    ]
  },
  writingCollection: {
    items: [
      { title: 'About Foci' },
      { title: 'The Quest for Musical Truth' }
    ]
  }
};

jest.spyOn(DataContext, 'useData').mockImplementation(() => mockData);

describe('useSearchFilters', () => {
  it('returns empty results and hides dropdown when searchTerm is empty', () => {
    const { result } = renderHook(() => useSearchFilters(''));

    expect(result.current.filteredMusicians).toEqual([]);
    expect(result.current.filteredOccupations).toEqual([]);
    expect(result.current.filteredWorks).toEqual([]);
    expect(result.current.filteredWritings).toEqual([]);
    expect(result.current.showDropdown).toBe(false);
  });
  
  it('filters musicians by full name match', () => {
    const { result } = renderHook(() => useSearchFilters('istvan'));
    
    expect(result.current.filteredMusicians).toHaveLength(1);
    expect(result.current.filteredMusicians[0].firstName).toBe('Istvan');
    expect(result.current.showDropdown).toBe(true);
  });
  
  it('filters works by title', () => {
    const { result } = renderHook(() => useSearchFilters('quartet'));

    expect(result.current.filteredWorks).toHaveLength(1);
    expect(result.current.filteredWorks[0].title).toMatch(/quartet/i);
  });
  
  it('filters witings by title', () => {
    const { result } = renderHook(() => useSearchFilters('quest'));

    expect(result.current.filteredWritings).toHaveLength(1);
    expect(result.current.filteredWritings[0].title).toMatch(/quest/i);
  });

  it('filters occupations correctly', () => {
    const { result } = renderHook(() => useSearchFilters('conduc'));

    expect(result.current.filteredOccupations).toEqual(['Conductor']);
    expect(result.current.showDropdown).toBe(true);
  });
  
  it('returns multiple types of results if matches exist across categories', () => {
    const { result } = renderHook(() => useSearchFilters('a'));
    
    expect(result.current.filteredMusicians.length).toBe(2);
    expect(result.current.filteredWorks.length).toBe(1);
    expect(result.current.filteredWritings.length).toBe(2);
    expect(result.current.showDropdown).toBe(true);
  });
});