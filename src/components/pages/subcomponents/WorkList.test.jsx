import React from 'react';
import { render, screen } from '@testing-library/react';
import WorkList from './WorkList';

describe('WorkList', () => {
  it('renders nothing if works is empty or undefined', () => {
    const { container } = render(<WorkList />);
    expect(container.firstChild).toBeNull();

    const { container: emptyContainer } = render(<WorkList works={[]} />);
    expect(emptyContainer.firstChild).toBeNull();
  });

  it('renders work items with all fields', () => {
    const mockWorks = [
      {
        title: 'Trio',
        year: 1960,
        type: 'Orchestral',
        instrumentation: ['Violin', 'Cello', 'Flute'],
        publicationInfo: 'Published by XYZ Press',
      },
    ];

    render(<WorkList works={mockWorks} />);

    expect(screen.getByText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/Trio/i)).toBeInTheDocument();
    expect(screen.getByText(/1960/)).toBeInTheDocument();
    expect(screen.getByText(/Orchestral/)).toBeInTheDocument();
    expect(screen.getByText(/Violin, Cello, Flute/)).toBeInTheDocument();
    expect(screen.getByText(/XYZ Press/)).toBeInTheDocument();
  });

  it('renders only available fields for a partial work entry', () => {
    const partialWork = [
      {
        title: 'Untitled',
        type: 'Solo',
      },
    ];

    render(<WorkList works={partialWork} />);
    expect(screen.getByText(/Untitled/)).toBeInTheDocument();
    expect(screen.getByText(/Solo/)).toBeInTheDocument();
    expect(screen.queryByText(/Year:/)).toBeNull();
    expect(screen.queryByText(/Instrumentation:/)).toBeNull();
    expect(screen.queryByText(/Publication Info:/)).toBeNull();
  });
});
