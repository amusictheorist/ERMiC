import React, { use } from "react";
import { render, screen } from '@testing-library/react';
import GeneralResultsPage from "./GeneralResultsPage";
import { useData } from "../DataContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";

jest.mock('../DataContext', () => ({
  useData: jest.fn()
}));

jest.mock('./subcomponents/GroupedResultsSection', () => ({ title }) => (
  <div>{title}</div>
));

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
    musicianCollection: {
      items: [
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
      ]
    },
    workCollection: {
      items: [
        {
          title: 'Symphony No. 1',
          musician: { slug: 'Smith-Anna' }
        }
      ]
    },
    writingCollection: {
      items: []
    },
    performanceAndMediaCollection: {
      items: []
    }
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
    renderwithQuery('search=sypmhony');
    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('Writings')).toBeInTheDocument();
    expect(screen.getByText('Performances')).toBeInTheDocument();
  });
});