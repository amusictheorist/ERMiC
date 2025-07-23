import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchResultsPage from './SearchResultsPage';
import { useData } from "../DataContext";

jest.mock('../DataContext', () => ({
  useData: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate
  };
});

const renderWithRouter = (initialPath = '/search?occupation=Pianist') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SearchResultsPage', () => {
  it('shows a loading message on data fetch failure', () => {
    useData.mockReturnValue({ data: null, loading: false, error: true });
    renderWithRouter();
    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
  });
  
  it('shows a message when no occupation is provided', () => {
    useData.mockReturnValue({ data: {}, loading: false, error: null });
    renderWithRouter('/search');
    expect(screen.getByText(/No search parameters provided/i)).toBeInTheDocument();
  });

  it('shows a message when no musicians match the occupation', () => {
    useData.mockReturnValue({
      data: {
        musicianCollection: []
      },
      loading: false,
      error: null
    });
    renderWithRouter();
    expect(screen.getByText(/No musicians found/i)).toBeInTheDocument();
  });

  it('displays matching musicians sorted by name', () => {
    useData.mockReturnValue({
      data: {
        musicianCollection: [
            { slug: 'anna', firstName: 'Anna', surname: 'Zweig', occupation: ['Pianist'] },
            { slug: 'bob', firstName: 'Bob', surname: 'Adler', occupation: ['Pianist'] }
          ]
      },
      loading: false,
      error: null
    });
    renderWithRouter();
    expect(screen.getByText(/Search results for: "Pianist"/i)).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Bob Adler');
    expect(listItems[1]).toHaveTextContent('Anna Zweig');
  });

  it('navigates to musician page on click', () => {
    useData.mockReturnValue({
      data: {
        musicianCollection: [
            { slug: 'anna', firstName: 'Anna', surname: 'Zweig', occupation: ['Pianist'] }
          ]
      },
      loading: false,
      error: null
    });

    renderWithRouter();
    fireEvent.click(screen.getByText('Anna Zweig'));
    expect(mockNavigate).toHaveBeenCalledWith('/musician/anna');
  });

  it('filters musicians by performanceTitle and displays them sorted', () => {
    useData.mockReturnValue({
      data: {
        musicianCollection: [
          { slug: 'anna', firstName: 'Anna', surname: 'Zweig', occupation: ['Pianist'] },
          { slug: 'bob', firstName: 'Bob', surname: 'Adler', occupation: ['Violinist'] },
          { slug: 'carl', firstName: 'Carl', surname: 'Smith', occupation: ['Cellist'] }
        ],
        performanceAndMediaCollection: [
          {
            title: 'Sonata',
            musiciansCollection: {
              items: [
                { slug: 'bob' },
                { slug: 'carl' }
              ]
            }
          }
        ]
      }, loading: false,
      error: null
    });

    renderWithRouter('/search?performance=Sonata');

    expect(screen.getByText(/Performers for: "Sonata"/i)).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent('Bob Adler');
    expect(listItems[1]).toHaveTextContent('Carl Smith');
    fireEvent.click(screen.getByText('Bob Adler'));
    expect(mockNavigate).toHaveBeenCalledWith('/musician/bob');
  });
});