import { renderHook } from '@testing-library/react';
import useSearchResults from '../useSearchResults';

describe('useSearchResults', () => {
  it('combines all filtered results into totalResults', () => {
    const filteredMusicians = [{ id: 1 }];
    const filteredWorks = [{ id: 2 }];
    const filteredWritings = [{ id: 3 }];
    const filteredOccupations = ['Composer'];

    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians,
        filteredOccupations,
        filteredWorks,
        filteredWritings,
        searchTerm: 'test'
      })
    );

    expect(result.current.totalResults).toEqual([
      ...filteredMusicians,
      ...filteredOccupations,
      ...filteredWorks,
      ...filteredWritings
    ]);
  });

  it('sets noResults to false if totalResults is non-empty', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [{ id: 1 }],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: 'abc'
      })
    );

    expect(result.current.noResults).toBe(false);
  });

  it('sets noResults to false if searchTerm is empty, even if no results', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm:''
      })
    );

    expect(result.current.noResults).toBe(false);
  });

  it('sets noResults to true if searchterm is non-empty and no results', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: 'something'
      })
    );
    
    expect(result.current.noResults).toBe(true);
  });
});