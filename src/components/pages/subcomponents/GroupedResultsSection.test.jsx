import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import GroupedResultsSection from "./GroupedResultsSection";
import { MemoryRouter, useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('GroupedResultsSection', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const groupedItems = {
    'musician-1': {
      musician: {
        slug: 'Smith-Anna',
        firstName: 'Anna',
        surname: 'Smith'
      },
      items: [
        { title: 'Work A' },
        { title: 'Work B' }
      ]
    }
  };

  it('renders section title and grouped items', () => {
    render(
      <MemoryRouter>
        <GroupedResultsSection title='Works' groupedItems={groupedItems} />
      </MemoryRouter>
    );

    expect(screen.getByText('Works')).toBeInTheDocument();
    expect(screen.getByText('Smith, Anna')).toBeInTheDocument();
    expect(screen.getByText('Work A')).toBeInTheDocument();
    expect(screen.getByText('Work B')).toBeInTheDocument();
  });

  it('does not render if groupedItems is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <GroupedResultsSection title='Works' groupedItems={{}} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('navigates to musician page on header click', () => {
    render(
      <MemoryRouter>
        <GroupedResultsSection title='Works' groupedItems={groupedItems} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Smith, Anna'));
    expect(mockNavigate).toHaveBeenCalledWith('/musician/Smith-Anna');
  });
});