jest.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: jest.fn().mockImplementation(() => <div>Mocked Rich Text</div>),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import WritingList from './WritingList';

describe('WritingList Component', () => {
  it('renders nothing when writings is null', () => {
    const { container } = render(<WritingList writings={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when writings is an empty array', () => {
    const { container } = render(<WritingList writings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders non-book type without <em>', () => {
    const writings = [
      {
        title: 'An Article',
        type: 'Article',
      },
    ];

    render(<WritingList writings={writings} />);
    const titleText = screen.getByText('An Article');
    expect(titleText.tagName).not.toBe('EM');
  });

  it('does not render year or type if missing', () => {
    const writings = [
      {
        title: 'No Meta',
        type: null,
        year: null,
      },
    ];

    render(<WritingList writings={writings} />);
    expect(screen.queryByText(/Year:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Type:/)).not.toBeInTheDocument();
  });

  it('does not render publicationInfo if missing', () => {
    const writings = [
      {
        title: 'No Info',
        type: 'Book',
        year: 2021,
      },
    ];

    render(<WritingList writings={writings} />);
    expect(screen.queryByText(/Publication Info:/)).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Rich Text')).not.toBeInTheDocument();
  });

  it('renders multiple writings', () => {
    const writings = [
      { title: 'Title 1', type: 'Book', year: 2000 },
      { title: 'Title 2', type: 'Article', year: 2010 },
    ];

    render(<WritingList writings={writings} />);
    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
  });
});
