import React from 'react';
import { render, screen } from '@testing-library/react';
import Browse from './Browse';

jest.mock('../DataContext', () => ({
  useData: jest.fn(),
}));

import { useData } from '../DataContext';
import { MemoryRouter } from 'react-router-dom';

describe('Browse component', () => {
  it('shows loading message when loading is true', () => {
    useData.mockReturnValue({ loading: true, error: null, data: null });

    render(<Browse />);
    expect(screen.getByText(/loading data/i)).toBeInTheDocument();
  });

  it('shows error message when error exists and no data', () => {
    useData.mockReturnValue({ loading: false, error: 'Error', data: null });

    render(<Browse />);
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
  });

  it('renders sorted list of musicians when data is loaded', () => {
    useData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        musicianCollection: {
          items: [
            { firstName: 'Andreas', surname: 'Barban', slug: 'barban-andreas' },
            { firstName: 'Peter', surname: 'Bentley', slug: 'bentley-peter' },
            { firstName: 'Istvan', surname: 'Anhalt', slug: 'anhalt-istvan' }
          ]
        }
      }
    });

    render(<Browse />, { wrapper: MemoryRouter });

    const items = screen.getAllByRole('link');
    expect(items.length).toBe(3);

    expect(items[0]).toHaveTextContent('Istvan Anhalt');
    expect(items[1]).toHaveTextContent('Andreas Barban');
    expect(items[2]).toHaveTextContent('Peter Bentley');
    expect(items[0].getAttribute('href')).toBe('/musician/anhalt-istvan');
  });

  it('sorts musicians by surname, then by first name ascending', () => {
    useData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        musicianCollection: {
          items: [
            { firstName: 'Andreas', surname: 'Barban', slug: 'barban-andreas' },
            { firstName: 'Peter', surname: 'Barban', slug: 'bentley-peter' },
            { firstName: 'Istvan', surname: 'Anhalt', slug: 'anhalt-istvan' }
          ]
        }
      }
    });

    render(<Browse />, { wrapper: MemoryRouter });

    const renderedNames = screen.getAllByText(/Anhalt|Barban/).map(el => el.textContent);

    expect(renderedNames).toEqual([
      'Istvan Anhalt',
      'Andreas Barban',
      'Peter Barban'
    ]);
  });

  it('renders list even if error is present but data exists', () => {
    useData.mockReturnValue({
      loading: false,
      error: 'Some error',
      data: {
        musicianCollection: {
          items: [
            { firstName: 'Anna', surname: 'Smith', slug: 'smith-anna' }
          ]
        }
      }
    });
  
    render(<Browse />, { wrapper: MemoryRouter });
    expect(screen.getByText(/Anna Smith/)).toBeInTheDocument();
  });

  it('sorts musicians by first name when surnames are equal (descending)', () => {
    useData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        musicianCollection: {
          items: [
            { firstName: 'Zoe', surname: 'Smith', slug: 'smith-zoe' },
            { firstName: 'Anna', surname: 'Smith', slug: 'smith-anna' }
          ]
        }
      }
    });
  
    render(<Browse />, { wrapper: MemoryRouter });
  
    const items = screen.getAllByRole('link');
    expect(items[0]).toHaveTextContent('Anna Smith');
    expect(items[1]).toHaveTextContent('Zoe Smith');
  });
});
