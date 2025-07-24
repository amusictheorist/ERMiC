import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AuthorResults from './AuthorResults';
import { useData } from '../DataContext';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock useData from DataContext
jest.mock('../DataContext', () => ({
  useData: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (route) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthorResults />
    </MemoryRouter>
  );
};

describe('AuthorResults', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    useData.mockReturnValue({ loading: true, data: null, error: null });
    renderWithRouter('/results/author?author=John%20Doe');
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    useData.mockReturnValue({ loading: false, data: null, error: true });
    renderWithRouter('/results/author?author=John%20Doe');
    expect(screen.getByText(/Failed to load data/i)).toBeInTheDocument();
  });

  it('shows "no author specified" if no author param', () => {
    useData.mockReturnValue({ loading: false, data: { musicianCollection: [] }, error: null });
    renderWithRouter('/results/author');
    expect(screen.getByText(/No author specified/i)).toBeInTheDocument();
  });

  it('shows "no biographies found" if no matches', () => {
    useData.mockReturnValue({
      loading: false,
      data: {
        musicianCollection: [
          {
            firstName: 'Alice',
            surname: 'Smith',
            slug: 'alice-smith',
            authorCollection: { items: [{ names: 'Jane', surnames: 'Doe' }] },
          },
        ],
      },
      error: null,
    });

    renderWithRouter('/results/author?author=John%20Doe');
    expect(screen.getByText(/No biographies found/i)).toBeInTheDocument();
  });

  it('shows matching biographies and navigates on click', async () => {
    useData.mockReturnValue({
      loading: false,
      data: {
        musicianCollection: [
          {
            firstName: 'Alice',
            surname: 'Smith',
            slug: 'alice-smith',
            authorCollection: { items: [{ names: 'John', surnames: 'Doe' }] },
          },
          {
            firstName: 'Bob',
            surname: 'Jones',
            slug: 'bob-jones',
            authorCollection: { items: [{ names: 'Jane', surnames: 'Roe' }] },
          },
        ],
      },
      error: null,
    });

    renderWithRouter('/results/author?author=John%20Doe');

    const listItem = await screen.findByText('Alice Smith');
    expect(listItem).toBeInTheDocument();

    fireEvent.click(listItem);
    expect(mockNavigate).toHaveBeenCalledWith('/musician/alice-smith');
  });
});
