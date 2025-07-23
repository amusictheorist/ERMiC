import React, { use } from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from '@testing-library/react';
import GeneralResultsPage from "./GeneralResultsPage";
import { useData } from "../DataContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock('../DataContext', () => ({
  useData: jest.fn()
}));

const renderwithQuery = (search = '') => {
  render(
    <MemoryRouter initialEntries={[`/results?${search}`]}>
      <Routes>
        <Route path='/results' element={<GeneralResultsPage />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockedData = {
  loading: false,
  error: null,
  data: {
    musicianCollection: [
      {
        firstName: 'Anna',
        surname: 'Smith',
        slug: 'Smith-Anna',
        occupation: ['Composer']
      },
      {
        firstName: 'Bob',
        surname: 'Jones',
        slug: 'Jones-Bob',
        occupation: ['Pianist']
      }
    ],
    workCollection: [
      {
        title: 'Symphony No. 1',
        musician: { slug: 'Smith-Anna' }
      }
    ],
    writingCollection: [
      {
        title: "About Music",
        type: 'Book',
        musician: { slug: 'Smith-Anna' }
      }, {
        title: 'Symphony',
        musician: { slug: 'Smith-Anna' }
      }
    ],
    performanceAndMediaCollection: []
  }
};

describe('GeneralResultsPage', () => {
  it('displays loading message when loading is true', () => {
    useData.mockReturnValue({ loading: true, error: null, data: null });
    renderwithQuery('search=anna');
    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
  });

  it('displays error message when there is an error and no data', () => {
    useData.mockReturnValue({ loading: false, error: new Error('fail'), data: null });
    renderwithQuery('search=anna');
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('shows matched musicians based on search query', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=anna');
    expect(screen.getByText('Anna Smith')).toBeInTheDocument();
  });

  it('shows matched occupations based on search query', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=Composer');
    expect(screen.getByText('Composer')).toBeInTheDocument();
  });

  it('renders grouped sections for works, writings, performances', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=symphony');
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('Writings')).toBeInTheDocument();
  });

  it('renders "please enter a search term" message if query is empty', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=');
    expect(screen.getByText(/please enter a search term/i)).toBeInTheDocument();
    expect(screen.queryByText('Musicians')).not.toBeInTheDocument();
    expect(screen.queryByText('Occupations')).not.toBeInTheDocument();
  });

  it('renders "no results found" message if no matches for query', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=nomatchquery');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('navigates to musician page when musician is clicked', async () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=anna');
    const musicianItem = screen.getByText('Anna Smith');
    await userEvent.click(musicianItem);
  });

  it('italicizes items in Works and Performances sections', () => {
    useData.mockReturnValue(mockedData);
    renderwithQuery('search=about');
    const writingItem = screen.getByText('About Music');

    expect(writingItem).toHaveClass('italic');
  });
});