import React from "react";
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';

jest.mock('../searchBar/SearchBar', () => () => <div>Mocked SearchBar</div>);

const renderWithRouter = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Navbar component', () => {
  const defaultProps = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    showDropdown: false,
    setShowDropdown: jest.fn(),
    selectedIndex: 0,
    setSelectedIndex: jest.fn()
  };

  it('renders full logo on homepage', () => {
    renderWithRouter(<Navbar {...defaultProps} />, { route: '/' });

    expect(screen.getByAltText('European Refugee Musicians in Canada logo')).toBeInTheDocument();
    expect(screen.queryByText('Mocked SearchBar')).not.toBeInTheDocument();
  });

  it('renders short logo on internal page and shows SearchBar', () => {
    renderWithRouter(<Navbar {...defaultProps} />, { route: '/browse' });

    expect(screen.getByAltText('ERMiC logo')).toBeInTheDocument();
    expect(screen.getByText('Mocked SearchBar')).toBeInTheDocument();
  });

  it('always renders navigation links', () => {
    renderWithRouter(<Navbar {...defaultProps} />, { route: '/' });

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Browse')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
});