import { renderHook, act } from '@testing-library/react';
import useSearchNavigation from '../useSearchNavigation';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useSearchNavigation', () => {
  const setSearchTerm = jest.fn();
  const setShowDropdown = jest.fn();
  const setSelectedIndex = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to occupation search results', () => {
    const occupation = 'Composer';
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [occupation],
        filteredPerformances: [],
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex,
      })
    );

    act(() => result.current(occupation));

    expect(mockNavigate).toHaveBeenCalledWith('/search-results?occupation=Composer');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });

  it('navigates to a musician page', () => {
    const musician = { slug: 'anhalt-istvan' };
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [musician],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex,
      })
    );

    act(() => result.current(musician));

    expect(mockNavigate).toHaveBeenCalledWith('/musician/anhalt-istvan');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });

  it('navigates to the musician page of a work if it has a musician', () => {
    const work = { title: 'Symphony', musician: { slug: 'barban-andreas' } };
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [work],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex,
      })
    );

    act(() => result.current(work));

    expect(mockNavigate).toHaveBeenCalledWith('/musician/barban-andreas');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });

  it('navigates to the musician page of writing if it has a musician', () => {
    const writing = { title: 'About Foci', musician: { slug: 'anhalt-istvan' } };
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [writing],
        filteredPerformances: [],
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex,
      })
    );

    act(() => result.current(writing));

    expect(mockNavigate).toHaveBeenCalledWith('/musician/anhalt-istvan');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });

  it('navigates to the musician page of performance if it has a musician', () => {
    const performance = { title: 'About Foci', musician: { slug: 'anhalt-istvan' } };
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredOccupations: [],
        filteredWorks: [],
        filteredWritings: [],
        filteredPerformances: [performance],
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex,
      })
    );

    act(() => result.current(performance));

    expect(mockNavigate).toHaveBeenCalledWith('/musician/anhalt-istvan');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });

  it('does nothing and logs error if item does not match any list', () => {
    const randomItem = { name: 'no match' };
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown,
      })
    );

    act(() => result.current(randomItem));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', 'Item does not match any known category');

    consoleErrorSpy.mockRestore();
  });

  it('logs error if item is null or undefined', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown,
      })
    );

    act(() => result.current(null));
    act(() => result.current(undefined));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', 'No item provided for navigation');

    consoleErrorSpy.mockRestore();
  });

  it('logs error if musician is missing slug', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const musician = { name: 'John Doe' };

    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [musician],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown,
      })
    );

    act(() => result.current(musician));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', 'Musician missing slug');

    consoleErrorSpy.mockRestore();
  });

  it('logs error if work is missing musician slug', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const work = { title: 'Symphony', musician: {} };

    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [work],
        filteredWritings: [],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown,
      })
    );

    act(() => result.current(work));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', 'Work missing musician slug');

    consoleErrorSpy.mockRestore();
  });

  it('logs error if writing is missing musician slug', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const writing = { title: 'Article', musician: {} };

    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [],
        filteredWritings: [writing],
        filteredOccupations: [],
        filteredPerformances: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown,
      })
    );

    act(() => result.current(writing));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Navigation error:', 'Writing missing musician slug');

    consoleErrorSpy.mockRestore();
  });
});
