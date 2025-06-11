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
    const publicationInfoRichText = {
      nodeType: "document",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          data: {},
          content: [
            {
              nodeType: "text",
              value: "XYZ Press",
              marks: [],
              data: {}
            }
          ]
        }
      ]
    };
    
    const mockWorks = [
      {
        title: 'Trio',
        year: 1960,
        type: 'Chamber',
        instrumentation: ['Violin', 'Cello', 'Flute'],
        publicationInfo: {
          json: publicationInfoRichText
        }
      }
    ];

    render(<WorkList works={mockWorks} />);

    expect(screen.getByText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/Trio/i)).toBeInTheDocument();
    expect(screen.getByText(/1960/)).toBeInTheDocument();
    expect(screen.getByText(/Chamber/)).toBeInTheDocument();
    expect(screen.getByText(/Violin, Cello, Flute/)).toBeInTheDocument();
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
