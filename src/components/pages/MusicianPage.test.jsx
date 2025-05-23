import React from "react";
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import MusicianPage from './MusicianPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'sample-musician' })
}));

jest.mock('../DataContext', () => ({
  useData: jest.fn()
}));

jest.mock('./subcomponents/Portrait', () => () => <div>Mocked Portrait</div>);
jest.mock('./subcomponents/Worklist', () => () => <div>Mocked WorkList</div>);
jest.mock('./subcomponents/WritingList', () => () => <div>Mocked WritingList</div>);
jest.mock('./subcomponents/RichTextRenderer', () => () => <div>Mocked RichTextRenderer</div>);

import { useData } from "../DataContext";

describe('MusicianPage', () => {
  it('shows laoding state when loading', () => {
    useData.mockReturnValue({ loading: true, error: null, data: null });

    render(<MusicianPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Loading data/i)).toBeInTheDocument();
  });
  
  it('shows an error message if error and no data', () => {
    useData.mockReturnValue({ loading: false, error: true, data: null });
    
    render(<MusicianPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
  });
  
  it('shows "Musician not found" if slug does not match', () => {
    useData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        musicianCollection: { items: [] },
        workCollection: { items: [] },
        writingCollection: { items: [] }
      }
    });
    
    render(<MusicianPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Musician not found/i)).toBeInTheDocument();
  });
  
  it('renders musician info and subcomponents if data is valid', () => {
    useData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        musicianCollection: {
          items: [
            {
              slug: 'sample-musician',
              firstName: 'Sample',
              surname: 'Musician',
              birthdate: '1900',
              birthPlace: 'Vienna',
              deathdate: '1980',
              deathPlace: 'Toronto',
              biography: { json: {} },
              bibliography: { json: {} },
              photosCollection: { items: [{ url: 'portrait.jpg' }] }
            }
          ]
        },
        workCollection: {
          items: [{ musician: { slug: 'sample-musician' } }]
        },
        writingCollection: {
          items: [{ musician: { slug: 'sample-musician' } }]
        }
      }
    });
    
    render(<MusicianPage />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Sample Musician/)).toBeInTheDocument();
    expect(screen.getByText(/Born: 1900 in Vienna/)).toBeInTheDocument();
    expect(screen.getByText(/Died: 1980 in Toronto/)).toBeInTheDocument();
    
    expect(screen.getAllByText(/Mocked RichText/)).toHaveLength(2);
    expect(screen.getByText(/Mocked Portrait/)).toBeInTheDocument();
    expect(screen.getByText(/Mocked WorkList/)).toBeInTheDocument();
    expect(screen.getByText(/Mocked WritingList/)).toBeInTheDocument();
  });
});