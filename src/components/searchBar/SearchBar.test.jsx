// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import SearchBar from './SearchBar';

// jest.mock('../../hooks/useSearchFilters');
// jest.mock('../../hooks/useSearchResults');
// jest.mock('../../hooks/useSearchNavigation', () => () => jest.fn());
// jest.mock('../../hooks/useDropdownNavigation', () => () => jest.fn());
// jest.mock('../../hooks/useClickOutside', () => () => jest.fn());

// import useSearchFilters from '../../hooks/useSearchFilters';
// import useSearchResults from '../../hooks/useSearchResults';

// describe('Searchbar', () => {
//   const defaultProps = {
//     searchTerm: '',
//     setSearchTerm: jest.fn(),
//     showDropdown: false,
//     setShowDropdown: jest.fn(),
//     selectedIndex: 0,
//     setSelectedIndex: jest.fn()
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders the input and button', () => {
//     useSearchFilters.mockReturnValue({
//       filteredMusicians: [],
//       filteredWorks: [],
//       filteredWritings: [],
//       filteredOccupations: []
//     });
//     useSearchResults.mockReturnValue({
//       totalResults: [],
//       noResults: false
//     });
    
//     render(<SearchBar {...defaultProps} />);
//     expect(screen.getByPlaceholderText(/enter name or keyword/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
//   });
  
//   it('updates input value and shows dropdown on change', () => {
//     useSearchFilters.mockReturnValue({
//       filteredMusicians: [],
//       filteredWorks: [],
//       filteredWritings: [],
//       filteredOccupations: []
//     });
//     useSearchResults.mockReturnValue({
//       totalResults: [],
//       noResults: false
//     });

//     render(<SearchBar {...defaultProps} />);
//     const input = screen.getByPlaceholderText(/enter name or keyword/i);
//     fireEvent.change(input, { target: { value: 'anhalt' } });

//     expect(defaultProps.setSearchTerm).toHaveBeenCalledWith('anhalt');
//     expect(defaultProps.setShowDropdown).toHaveBeenCalledWith(true);
//   });

//   it('renders dropdown items when showDropdown is true and results exist', () => {
//     useSearchFilters.mockReturnValue({
//       filteredMusicians: [{ name: 'Istvan Anhalt', sys: { id: 'Anhalt-Istvan' } }],
//       filteredWorks: [],
//       filteredWritings: [],
//       filteredOccupations: []
//     });
//     useSearchResults.mockReturnValue({
//       totalResults: [{ name: 'Istvan Anhalt', sys: { id: 'Anhalt-Istvan' } }],
//       noResults: false
//     });

//     render(<SearchBar {...defaultProps} showDropdown={true} />);
//     expect(screen.getByText(/istvan anhalt/i)).toBeInTheDocument();
//   });

//   // it('displays no results warning when noReults is true', () => {
//   //   useSearchFilters.mockReturnValue({
//   //     filteredMusicians: [],
//   //     filteredWorks: [],
//   //     filteredWritings: [],
//   //     filteredOccupations: []
//   //   });
//   //   useSearchResults.mockReturnValue({
//   //     totalResults: [],
//   //     noResults: false
//   //   });

//   //   render(<SearchBar {...defaultProps} />);
//   //   expect(screen.getByText(/no matches found/i)).toBeInTheDocument();
//   // });
// });