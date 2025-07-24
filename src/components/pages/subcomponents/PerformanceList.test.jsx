import React from 'react';
import { render, screen } from '@testing-library/react';
import PerformanceList from './PerformanceList';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// Mock documentToReactComponents
jest.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: jest.fn(),
}));

describe('PerformanceList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if no performances', () => {
    const { container } = render(<PerformanceList performances={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a single performance with title, year, type, and publication info', () => {
    documentToReactComponents.mockReturnValue(<p>Rendered rich text</p>);

    const performances = [
      {
        title: 'Symphony No. 5',
        year: '1808',
        type: 'Concert',
        publicationInfo: { json: { nodeType: 'document', content: [] } },
      },
    ];

    render(<PerformanceList performances={performances} />);

    expect(screen.getByText(/Title:/)).toBeInTheDocument();
    expect(screen.getByText(/Symphony No. 5/)).toBeInTheDocument();
    expect(screen.getByText(/Year:/)).toBeInTheDocument();
    expect(screen.getByText(/1808/)).toBeInTheDocument();
    expect(screen.getByText(/Type:/)).toBeInTheDocument();
    expect(screen.getByText(/Concert/)).toBeInTheDocument();
    expect(screen.getByText(/Publication Info:/)).toBeInTheDocument();
    expect(screen.getByText(/Rendered rich text/)).toBeInTheDocument();
  });

  it('renders dateRange instead of year when year is missing', () => {
    const performances = [
      {
        title: 'Festival Appearances',
        dateRange: '2001–2005',
        type: 'Festival',
        publicationInfo: {},
      },
    ];

    render(<PerformanceList performances={performances} />);
    expect(screen.getByText(/Years:/)).toBeInTheDocument();
    expect(screen.getByText(/2001–2005/)).toBeInTheDocument();
  });

  it('does not render publication info if missing', () => {
    const performances = [
      {
        title: 'Untitled Work',
        year: '1999',
        type: 'Installation',
        publicationInfo: null,
      },
    ];

    render(<PerformanceList performances={performances} />);
    expect(screen.queryByText(/Publication Info:/)).not.toBeInTheDocument();
  });
});
