import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from './App';

jest.mock('./components/navigation/Navbar', () => () => <div>Mock Navbar</div>);
jest.mock('./components/navigation/Footer', () => () => <div>Mock Footer</div>);
jest.mock('./components/pages/HomePage', () => () => <div>Mock HomePage</div>);
jest.mock('./components/browse/Browse', () => () => <div>Mock Browse</div>);
jest.mock('./components/pages/MusicianPage', () => () => <div>Mock MusicianPage</div>);
jest.mock('./components/pages/SearchResultsPage', () => () => <div>Mock SearchResultsPage</div>);

describe('App', () => {
  test('renders without crashing and shows homepage by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<div>Mock HomePage</div>} />
            <Route path='browse' element={<div>Mock Browse</div>} />
            <Route path='musician/:id' element={<div>Mock MusicianPage</div>} />
            <Route path='search' element={<div>Mock SearchResultsPage</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/mock navbar/i)).toBeInTheDocument();
    expect(screen.getByText(/mock homepage/i)).toBeInTheDocument();
    expect(screen.getByText(/mock footer/i)).toBeInTheDocument();
  });
});
