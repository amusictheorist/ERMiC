import React from "react";
import { render, screen } from '@testing-library/react';
import WritingList from './WritingList';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

jest.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: jest.fn(() => <div>Mock Rich Text</div>)
}));

describe('WritingList', () => {
  it('renders nothing if writing is empty or undefined', () => {
    const { container } = render(<WritingList />);
    expect(container.firstChild).toBeNull();

    const { container: emptyContainer } = render(<WritingList writings={[]} />);
    expect(emptyContainer.firstChild).toBeNull();
  });

  it('renders writings with all fields including rich text', () => {
    const mockWritings = [
      {
        title: 'Music and Meaning',
        year: 1972,
        type: 'Article',
        publicationInfo: { json: { nodeType: 'document' } }
      }
    ];

    render(<WritingList writings={mockWritings} />);

    expect(screen.getByText(/Writings/i)).toBeInTheDocument();
    expect(screen.getByText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/Music and Meaning/i)).toBeInTheDocument();
    expect(screen.getByText(/1972/i)).toBeInTheDocument();
    expect(screen.getByText(/Article/i)).toBeInTheDocument();
    expect(screen.getByText(/Publication Info:/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Rich Text/i)).toBeInTheDocument();
  });

  it('renders book titles in italics', () => {
    const mockBook = [
      {
        title: 'Harmonic Imagination',
        type: 'Book',
        publicationInfo: { json: {} }
      }
    ];

    render(<WritingList writings={mockBook} />);
    const italicTitle = screen.getByText(/Harmonic Imagination/);
    expect(italicTitle.tagName.toLowerCase()).toBe('em');
  });

  it('renders only available fields for a partial writing entry', () => {
    const partial = [
      {
        title: 'Fragments',
        type: 'Article'
      }
    ];

    render(<WritingList writings={partial} />);
    expect(screen.getByText(/Fragments/)).toBeInTheDocument();
    expect(screen.getByText(/Article/)).toBeInTheDocument();
    expect(screen.getByText(/Year:/)).toBeNull();
    expect(screen.getByText(/Publication Info:/)).toBeNull();
  });
});