import React from "react";
import { getByText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataProvider, useData } from '../components/DataContext';

const Probe = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;
  return (
    <div>
      <p>musicians: {data.musicianCollection.length}</p>
      <p>authors: {data.biographyAuthorCollection.items.length}</p>
    </div>
  );
};

const fixtures = {
  musician: { musicianCollection: { items: [{ slug: 'm1' }] } },
  work: { workCollection: { items: [{ title: 't1' }] } },
  writing: { writingCollection: { items: [{ title: 't2' }] } },
  performance: { performanceAndMediaCollection: { items: [{ title: 'p1' }] } },
  author: { biographyAuthorCollection: { items: [{ names: 'Ada', surnames: 'Lovelace' }] } }
};

const choosePayload = (query) => {
  if (query.includes('musicianCollection')) return fixtures.musician;
  if (query.includes('workCollection')) return fixtures.work;
  if (query.includes('writingCollection')) return fixtures.writing;
  if (query.includes('performanceAndMediaCollection')) return fixtures.performance;
  if (query.includes('biographyAuthorCollection')) return fixtures.author;
  throw new Error(`Unhandled query:\n${query}`);
};

beforeEach(() => {
  process.env.REACT_APP_SPACE_ID = 'space-id';
  process.env.REACT_APP_ACCESS_TOKEN = 'space-token';

  global.fetch = jest.fn((_, { body }) => {
    const { query } = JSON.parse(body);
    const data = choosePayload(query);
    return Promise.resolve({ json: () => Promise.resolve({ data }) });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('provides fetched data to children', async () => {
  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() =>
    expect(screen.getByText(/musicians: 1/i)).toBeInTheDocument()
  );

  expect(screen.getByText(/authors: 1/i)).toBeInTheDocument();

  expect(global.fetch).toHaveBeenCalledTimes(5);
});

test('surfaces errors when a fetch fails', async () => {
  global.fetch.mockRejectedValueOnce(new Error('Network down'));

  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );

  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(/network down/i)
  );
});

test('exposes loading=true before any response arrives', () => {
  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("warns on GraphQL errors but continues loading data", async () => {
  const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  let callCount = 0;

  global.fetch.mockImplementation((_, { body }) => {
    const { query } = JSON.parse(body);
    callCount++;

    if (callCount === 1) {
      return Promise.resolve({
        json: () => Promise.resolve({
          data: fixtures.musician,
          errors: [{ message: "GraphQL error example" }]
        }),
      });
    }
    const data = choosePayload(query);
    return Promise.resolve({ json: () => Promise.resolve({ data }) });
  });

  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );

  await waitFor(() => expect(screen.getByText(/musicians: 1/i)).toBeInTheDocument());
  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining("GraphQL Errors"),
    expect.any(Array)
  );

  warnSpy.mockRestore();
});

test("paginates musician collection when needed", async () => {
  const page1Musicians = Array(30).fill().map((_, i) => ({ id: `m-${i}` }));
  const page2Musicians = Array(10).fill().map((_, i) => ({ id: `m-${i + 30}` }));

  const empty50 = { items: [] };
  const authorData = { biographyAuthorCollection: { items: [{}] } };

  global.fetch = jest.fn((_, { body }) => {
    const { query } = JSON.parse(body);

    if (query.includes("musicianCollection")) {
      const match = query.match(/skip:\s*(\d+)/);
      const skip = match ? parseInt(match[1], 10) : 0;

      const response =
        skip === 0
          ? { musicianCollection: { items: page1Musicians } }
          : { musicianCollection: { items: page2Musicians } };

      return Promise.resolve({ json: () => Promise.resolve({ data: response }) });
    }

    if (query.includes("workCollection"))
      return Promise.resolve({ json: () => Promise.resolve({ data: { workCollection: empty50 } }) });

    if (query.includes("writingCollection"))
      return Promise.resolve({ json: () => Promise.resolve({ data: { writingCollection: empty50 } }) });

    if (query.includes("performanceAndMediaCollection"))
      return Promise.resolve({ json: () => Promise.resolve({ data: { performanceAndMediaCollection: empty50 } }) });

    if (query.includes("biographyAuthorCollection"))
      return Promise.resolve({ json: () => Promise.resolve({ data: authorData }) });

    return Promise.reject(new Error("Unrecognized query"));
  });

  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );

  await waitFor(() =>
    expect(
      screen.getByText((_, node) => node?.textContent === "musicians: 40")
    ).toBeInTheDocument()
  );

  const calls = global.fetch.mock.calls.map(([_, { body }]) => JSON.parse(body).query);
  const skipCalls = calls.filter((q) => /musicianCollection/.test(q));
  expect(skipCalls.some((q) => q.includes("skip: 0"))).toBe(true);
  expect(skipCalls.some((q) => q.includes("skip: 30"))).toBe(true);
});

test("handles failed fetch response", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, status: 500, json: async () => ({}) })
  );

  render(
    <DataProvider>
      <Probe />
    </DataProvider>
  );

  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(/error/i)
  );
});
