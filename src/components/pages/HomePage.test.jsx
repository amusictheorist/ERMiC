import React from "react";
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { useOutletContext } from "react-router-dom";

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useOutletContext: jest.fn(),
}));

jest.mock('../searchBar/SearchBar', () => {
  return function MockSearchBar(props) {
    return (
      <div data-testid="mock-search-bar">
        Mock SearchBar - term: {props.searchTerm}
      </div>
    );
  };
});

jest.mock('../../components/DataContext', () => ({
  useData: () => ({
    data: {
      musicianCollection: [],
      workCollection: [],
      writingCollection: [],
      performanceAndMediaCollection: []
    },
    loading: false,
    error: null
  }),
}));

describe('HomePage', () => {
  const defaultProps = {
    searchTerm: 'test',
    setSearchTerm: jest.fn(),
    showDropdown: false,
    setShowDropdown: jest.fn(),
    selectedIndex: 0,
    setSelectedIndex: jest.fn()
  };

  beforeEach(() => {
    useOutletContext.mockReturnValue(defaultProps);
  });

  test('renders homepage content and search bar', () => {
    render(<HomePage />);

    expect(
      screen.getByText(/Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Search by name or keyword/i)
    ).toBeInTheDocument();

    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();
    expect(screen.getByText(/term: test/)).toBeInTheDocument();
  });
});