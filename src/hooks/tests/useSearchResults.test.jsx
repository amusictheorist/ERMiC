import { renderHook } from '@testing-library/react';
import useSearchResults from '../useSearchResults';

describe('useSearchResults', () => {
  it('combines all results into one array', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [{ firstName: 'Istvan' }],
        filteredOccupations: ['Composer'],
        filteredWorks: [{ title: 'Symphony' }],
        filteredWritings: [{ title: 'About Foci' }],
        searchTerm: 'john',
      })
    );

    expect(result.current.totalResults).toHaveLength(4);
    expect(result.current.totalResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstName: 'Istvan' }),
        'Composer',
        expect.objectContaining({ title: 'Symphony' }),
        expect.objectContaining({ title: 'About Foci' }),
      ])
    );
    expect(result.current.noResults).toBe(false);
  });

  it('handles empty or missing filtered arrays gracefully', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: null,
        filteredOccupations: undefined,
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: 'a',
      })
    );

    expect(result.current.totalResults).toEqual([]);
    expect(result.current.noResults).toBe(true);
  });

  it('noResults is false when searchTerm is empty or whitespace', () => {
    const { result: resultEmpty } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: '',
      })
    );
    expect(resultEmpty.current.noResults).toBe(false);

    const { result: resultWhitespace } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: '   ',
      })
    );
    expect(resultWhitespace.current.noResults).toBe(false);
  });

  it('updates noResults to true when there are no results but searchTerm is non-empty', () => {
    const { result, rerender } = renderHook(
      ({ term }) =>
        useSearchResults({
          filteredMusicians: [],
          filteredOccupations: [],
          filteredWorks: [],
          filteredWritings: [],
          searchTerm: term,
        }),
      { initialProps: { term: '' } }
    );

    expect(result.current.noResults).toBe(false);

    rerender({ term: 'nonempty' });

    expect(result.current.noResults).toBe(true);
  });

  it('covers filteredWorks fallback with null', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: null,
        filteredWritings: [],
        searchTerm: 'test',
      })
    );
    expect(result.current.totalResults).toEqual([]);
    expect(result.current.noResults).toBe(true);
  });

  it('covers filteredWritings fallback with undefined', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: undefined,
        searchTerm: 'test',
      })
    );
    expect(result.current.totalResults).toEqual([]);
    expect(result.current.noResults).toBe(true);
  });

  it('covers searchTerm non-string fallback', () => {
    const { result } = renderHook(() =>
      useSearchResults({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        searchTerm: null,
      })
    );
    expect(result.current.totalResults).toEqual([]);
    expect(result.current.noResults).toBe(false);
  });
});
