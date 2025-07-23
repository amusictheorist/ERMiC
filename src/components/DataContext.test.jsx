import React from "react";
import { render, waitFor } from '@testing-library/react';
import { DataProvider, useData } from "./DataContext";

process.env.REACT_APP_SPACE_ID = 'testSpace';
process.env.REACT_APP_ACCESS_TOKEN = 'testToken';

const Consumer = () => {
  const { data, loading, error } = useData();

  if (loading) return <div>Loadin...</div>;
  if (error) return <div>Error: {error.message || "Something went wrong"}</div>;
  if (!data) return <div>No data</div>;

  return <div>{data.musicianCollection.items[0].firstName}</div>;
};

describe('Data Provider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('provides fetched data to children', async () => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              musicianCollection: [
                { slug: 'test-musician', firstName: 'Test', surname: 'Musician' }
              ],
              workCollection: [],
              writingCollection: [],
              performanceAndMediaCollection: []
            }
          }),
      })
    );

    const { getByText } = render(
      <DataProvider>
        <Consumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(getByText('Test')).toBeInTheDocument();
    });
  });

  it('sets error when fetch fails', async () => {
    globalThis.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));

    const { getByText } = render(
      <DataProvider>
        <Consumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('warns and sets data even if GraphQL returns errors', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              musicianCollection: {
                items: [
                  { slug: 'test-musician', firstName: 'Test', surname: 'Musician' }
                ]
              },
              workCollection: [],
              writingCollection: [],
              performanceAndMediaCollection: []
            },
            errors: [{ message: 'Some GraphQL error' }]
          }),
      })
    );

    const { getByText } = render(
      <DataProvider>
        <Consumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(getByText('Test')).toBeInTheDocument();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('GraphQL Errors in'),
        expect.arrayContaining([expect.objectContaining({ message: 'Some GraphQL error' })])
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('throws and sets error if no data received', async () => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: null,
          }),
      })
    );

    const { getByText } = render(
      <DataProvider>
        <Consumer />
      </DataProvider>
    );

    await waitFor(() => {
      expect(getByText(/No data received/i)).toBeInTheDocument();
    });
  });
});
