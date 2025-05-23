import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/navigation/Navbar', () => () => <div>Mock Navbar</div>);
jest.mock('./components/navigation/Footer', () => () => <div>Mock Footer</div>);
jest.mock('./components/pages/HomePage', () => () => <div>Mock HomePage</div>);
jest.mock('./components/browse/Browse', () => () => <div>Mock Browse</div>);
jest.mock('./components/pages/MusicianPage', () => () => <div>Mock MusicianPage</div>);
jest.mock('./components/pages/SearchResultsPage', () => () => <div>Mock SearchResultsPage</div>);

describe('App', () => {
  test('renders without crashing and shows homepage by default', () => {
    render(<App />);

    expect(screen.getByText(/mock navbar/i)).toBeInTheDocument();
    expect(screen.getByText(/mock homepage/i)).toBeInTheDocument();
    expect(screen.getByText(/mock footer/i)).toBeInTheDocument();
  });
});
