import { renderHook, waitFor } from '@testing-library/react';
import * as DataContext from '../../components/DataContext';
import useSearchFilters from '../useSearchFilters';

jest.mock('../../components/DataContext', () => ({
  useData: jest.fn(),
}));

const mockData = {
  musicianCollection: {
    items: [
      { firstName: 'Istvan', surname: 'Anhalt', occupation: ['Composer', 'Music Theorist'] },
      { firstName: 'Andreas', surname: 'Barban', occupation: ['Conductor'] },
    ],
  },
  workCollection: {
    items: [
      { title: 'String Quartet No. 1' },
      { title: 'Symphony No. 1' },
    ],
  },
  writingCollection: {
    items: [
      { title: 'About Foci' },
      { title: 'The Quest for Musical Truth' },
    ],
  },
};

const makeMockReturn = (data, loading = false, error = null) => ({
  data,
  loading,
  error,
});

describe('useSearchFilters with full data', () => {
  beforeEach(() => {
    DataContext.useData.mockReset();
    DataContext.useData.mockImplementation(() => makeMockReturn(mockData));
  });

  it('returns empty results and hides dropdown when searchTerm is empty', () => {
    const { result } = renderHook(() => useSearchFilters(''));

    expect(result.current.filteredMusicians).toEqual([]);
    expect(result.current.filteredOccupations).toEqual([]);
    expect(result.current.filteredWorks).toEqual([]);
    expect(result.current.filteredWritings).toEqual([]);
    expect(result.current.showDropdown).toBe(false);
  });

  it('filters musicians by full name match', async () => {
    const { result } = renderHook(() => useSearchFilters('istvan'));

    await waitFor(() => {
      expect(result.current.filteredMusicians).toHaveLength(1);
      expect(result.current.filteredMusicians[0].firstName).toBe('Istvan');
      expect(result.current.showDropdown).toBe(true);
    });
  });

  it('filters works by title', async () => {
    const { result } = renderHook(() => useSearchFilters('quartet'));

    await waitFor(() => {
      expect(result.current.filteredWorks).toHaveLength(1);
      expect(result.current.filteredWorks[0].title).toMatch(/quartet/i);
    });
  });

  it('filters writings by title', async () => {
    const { result } = renderHook(() => useSearchFilters('quest'));

    await waitFor(() => {
      expect(result.current.filteredWritings).toHaveLength(1);
      expect(result.current.filteredWritings[0].title).toMatch(/quest/i);
    });
  });

  it('filters occupations correctly', async () => {
    const { result } = renderHook(() => useSearchFilters('conduc'));

    await waitFor(() => {
      expect(result.current.filteredOccupations).toEqual(['Conductor']);
      expect(result.current.showDropdown).toBe(true);
    });
  });

  it('returns multiple types of results if matches exist across categories', async () => {
    const { result } = renderHook(() => useSearchFilters('a'));

    await waitFor(() => {
      expect(result.current.filteredMusicians.length).toBe(2);
      expect(result.current.filteredWorks.length).toBe(1);
      expect(result.current.filteredWritings.length).toBe(2);
      expect(result.current.showDropdown).toBe(true);
    });
  });
});

describe('useSearchFilters error handling and edge cases', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    DataContext.useData.mockReset();
  });

  afterEach(() => {
    console.error.mockRestore();
    DataContext.useData.mockReset();
  });

  it('returns empty results and hides dropdown if data is null', async () => {
    DataContext.useData.mockReturnValueOnce(makeMockReturn(null));

    const { result } = renderHook(() => useSearchFilters('anything'));

    await waitFor(() => {
      expect(result.current.filteredMusicians).toEqual([]);
      expect(result.current.filteredOccupations).toEqual([]);
      expect(result.current.filteredWorks).toEqual([]);
      expect(result.current.filteredWritings).toEqual([]);
      expect(result.current.showDropdown).toBe(false);
    });
  });

  it('handles missing collections gracefully', async () => {
    DataContext.useData.mockReturnValueOnce(makeMockReturn({
      musicianCollection: {},
      workCollection: null,
      writingCollection: { items: null },
    }));

    const { result } = renderHook(() => useSearchFilters('a'));

    await waitFor(() => {
      expect(result.current.filteredMusicians).toEqual([]);
      expect(result.current.filteredOccupations).toEqual([]);
      expect(result.current.filteredWorks).toEqual([]);
      expect(result.current.filteredWritings).toEqual([]);
      expect(result.current.showDropdown).toBe(false);
    });
  });

  it('catches errors during filtering and logs them', async () => {
    const badData = {
      musicianCollection: {
        items: [
          {
            get firstName() {
              throw new Error('Fail');
            },
            surname: 'Smith',
            occupation: ['Composer'],
          },
        ],
      },
      workCollection: { items: [] },
      writingCollection: { items: [] },
    };
    DataContext.useData.mockReturnValueOnce(makeMockReturn(badData));

    const { result } = renderHook(() => useSearchFilters('fail'));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Search filtering failed:',
        expect.any(Error)
      );

      expect(result.current.filteredMusicians).toEqual([]);
      expect(result.current.filteredOccupations).toEqual([]);
      expect(result.current.filteredWorks).toEqual([]);
      expect(result.current.filteredWritings).toEqual([]);
      expect(result.current.showDropdown).toBe(false);
    });
  });

  it('handles empty arrays in collections', async () => {
    DataContext.useData.mockReturnValueOnce(makeMockReturn({
      musicianCollection: { items: [] },
      workCollection: { items: [] },
      writingCollection: { items: [] },
    }));

    const { result } = renderHook(() => useSearchFilters('a'));

    await waitFor(() => {
      expect(result.current.filteredMusicians).toEqual([]);
      expect(result.current.filteredOccupations).toEqual([]);
      expect(result.current.filteredWorks).toEqual([]);
      expect(result.current.filteredWritings).toEqual([]);
      expect(result.current.showDropdown).toBe(false);
    });
  });

  it('handles musicians missing occupation or partial data', async () => {
    let currentMockData = null;

    jest.spyOn(DataContext, 'useData').mockImplementation(() => makeMockReturn(currentMockData));

    const { result, rerender } = renderHook(({ term }) => useSearchFilters(term), {
      initialProps: { term: 'john' },
    });

    expect(result.current.filteredMusicians).toHaveLength(0);

    currentMockData = {
      musicianCollection: {
        items: [
          { firstName: 'John', surname: 'Doe' },
          { surname: 'Smith', occupation: ['Pianist'] },
          { firstName: 'Jane' },
        ],
      },
      workCollection: { items: [] },
      writingCollection: { items: [] },
    };

    rerender({ term: 'john' });

    await waitFor(() => {
      expect(result.current.filteredMusicians).toHaveLength(1);
      expect(result.current.filteredMusicians[0].firstName).toBe('John');
    });
  });

  it('returns empty results and hides dropdown when searchTerm is only spaces', () => {
    const { result } = renderHook(() => useSearchFilters('    '));

    expect(result.current.filteredMusicians).toEqual([]);
    expect(result.current.filteredOccupations).toEqual([]);
    expect(result.current.filteredWorks).toEqual([]);
    expect(result.current.filteredWritings).toEqual([]);
    expect(result.current.showDropdown).toBe(false);
  });
});
