import { renderHook, act } from '@testing-library/react';
import useSearchNavigation from "../useSearchNavigation";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
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
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex
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
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex
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
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex
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
        setSearchTerm,
        setShowDropdown,
        setSelectedIndex
      })
    );
    
    act(() => result.current(writing));
    
    expect(mockNavigate).toHaveBeenCalledWith('/musician/anhalt-istvan');
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });
  
  it('does nothing if item does not match any list', () => {
    const randomItem = { name: 'no match' };
    const { result } = renderHook(() =>
      useSearchNavigation({
        filteredMusicians: [],
        filteredWorks: [],
        filteredWritings: [],
        filteredOccupations: [],
        setSearchTerm,
        setSelectedIndex,
        setShowDropdown
      })
    );
    
    act(() => result.current(randomItem));
    
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(setSearchTerm).toHaveBeenCalledWith('');
    expect(setShowDropdown).toHaveBeenCalledWith(false);
    expect(setSelectedIndex).toHaveBeenCalledWith(-1);
  });
});