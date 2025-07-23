import React from "react";
import { generateTextRenderer, nameMapBuilder, normalize } from "./renderHelpers";
import { render } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

describe('normalize', () => {
  it('removes diacritics, punctuation, extra spaces, and lowercases', () => {
    const input = ' José López! ';
    const expected = 'jose lopez';
    expect(normalize(input)).toBe(expected);
  });

  it('handles empty string', () => {
    expect(normalize('')).toBe('');
  });
});

describe('nameMapBuilder', () => {
  it('builds normalized name map entries', () => {
    const input = [
      { firstName: 'Anna', surname: 'Smith', slug: 'Smith-Anna' },
      { firstName: 'Bob', surname: 'Jones', slug: 'Jones-Bob' },
    ];

    const result = nameMapBuilder(input, normalize);

    expect(result).toEqual([
      {
        slug: 'Smith-Anna',
        originalNames: ['Anna Smith', 'Smith Anna'],
        normalizedNames: ['anna smith', 'smith anna']
      },
      {
        slug: 'Jones-Bob',
        originalNames: ['Bob Jones', 'Jones Bob'],
        normalizedNames: ['bob jones', 'jones bob']
      }
    ]);
  });
});

describe('generateTextRenderer', () => {
  const nameEntries = [
    { originalNames: ['Anna Smith', 'Smith Anna'], normalizedNames: ['anna smith', 'smith anna'], slug: 'Smith-Anna' },
    { originalNames: ['Bob Jones', 'Jones Bob'], normalizedNames: ['bob jones', 'jones bob'], slug: 'Jones-Bob' },
  ];

  const matchedNames = new Set();

  const renderText = generateTextRenderer(nameEntries, matchedNames);

  it('returns original text if no matches', () => {
    const text = 'No matching names here.';
    const result = renderText(text);
    expect(result).toEqual([text]);
  });

  it('wraps full name occurrences with <Link>', () => {
    const text = 'Today, Anna Smith performed.';
    const { container } = render(<MemoryRouter>{renderText(text)}</MemoryRouter>);

    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link.textContent).toBe('Anna Smith');
    expect(link.getAttribute('href')).toBe('/musician/Smith-Anna');
  });

  it('handles multiple matches and preserves other text', () => {
    const text = 'Anna Smith and Bob Jones went to see Istvan Anhalt.';
    const { container } = render(<MemoryRouter>{renderText(text)}</MemoryRouter>);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(1);

    expect(links[0].textContent).toBe('Bob Jones');
    expect(links[0].getAttribute('href')).toBe('/musician/Jones-Bob');
  });

  it('does not link partial matches', () => {
    const text = 'Annabelle and Bobby are friends.';
    const { container } = render(<MemoryRouter>{renderText(text)}</MemoryRouter>);

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(0);
  });
});
