import { extractBirthYear, groupByBirthYear, groupByCountry, sortMusicians } from "./browseHelpers";

describe('extractBirthYear', () => {
  it('extracts valid year from the string', () => {
    expect(extractBirthYear('Born in 1824')).toBe('1824');
    expect(extractBirthYear('1900-03-05')).toBe('1900');
    expect(extractBirthYear('April 2001')).toBe('2001');
  });

  it('returns null for strings without valid year', () => {
    expect(extractBirthYear('Born in ancient tikmes')).toBeNull();
  });

  it('returns null for non-string inputs', () => {
    expect(extractBirthYear(null)).toBeNull();
    expect(extractBirthYear(undefined)).toBeNull();
    expect(extractBirthYear(1900)).toBeNull();
  });
});

describe('groupByCountry', () => {
  const musicians = [
    { name: 'A', birthPlace: 'Vienna, Austria' },
    { name: 'B', birthPlace: 'Paris, France' },
    { name: 'C', birthPlace: 'Berlin, Germany' },
    { name: 'D', birthPlace: 'Unknown' },
    { name: 'E', birthPlace: null }
  ];

  it('groups musicians by country', () => {
    const result = groupByCountry(musicians, 'birthPlace');
    expect(result).toEqual({
      Austria: [musicians[0]],
      France: [musicians[1]],
      Germany: [musicians[2]],
      Other: [musicians[3], musicians[4]],
    });
  });

  it('returns empty object for empty list', () => {
    expect(groupByCountry([], 'birthPlace')).toEqual({});
  });
});

describe('groupByBirthYear', () => {
  const musicians = [
    { name: 'A', birthdate: '1824-05-01' },
    { name: 'B', birthdate: '1900' },
    { name: 'C', birthdate: 'April 1900' },
    { name: 'D', birthdate: 'no date' },
    { name: 'E', birthdate: null }
  ];

  it('groups musicians by birth year or "Unkown', () => {
    const result = groupByBirthYear(musicians);
    expect(result).toEqual({
      '1824': [musicians[0]],
      '1900': [musicians[1], musicians[2]],
      'Unknown': [musicians[3], musicians[4]],
    });
  });
});

describe('sortMusicians', () => {
  const musicians = [
    {
      firstName: 'Johann',
      surname: 'Bach',
      birthdate: '1685',
      birthPlace: 'Eisenach, Germany',
      deathPlace: 'Leipzig, Germany',
    },
    {
      firstName: 'Ludwig',
      surname: 'Beethoven',
      birthdate: '1770',
      birthPlace: 'Bonn, Germany',
      deathPlace: 'Vienna, Austria',
    },
    {
      firstName: 'Wolfgang',
      surname: 'Mozart',
      birthdate: '1756',
      birthPlace: 'Salzburg, Austria',
      deathPlace: 'Vienna, Austria',
    },
    {
      firstName: 'Clara',
      surname: 'Schumann',
      birthdate: '1819',
      birthPlace: 'Leipzig, Germany',
      deathPlace: 'Frankfurt, Germany',
    },
  ];

  it('sorts by birthCountry', () => {
    const sorted = sortMusicians(musicians, 'birthCountry');
    const countries = sorted.map(m => m.birthPlace.split(', ').pop());
    expect(countries).toEqual(['Austria', 'Germany', 'Germany', 'Germany']);
  });
  
  it('sorts by deathCountry', () => {
    const sorted = sortMusicians(musicians, 'deathCountry');
    const countries = sorted.map(m => m.birthPlace.split(', ').pop());
    expect(countries).toEqual(['Germany', 'Austria', 'Germany', 'Germany']);
  });

  it('sorts by birthYear', () => {
    const sorted = sortMusicians(musicians, 'birthYear');
    const years = sorted.map(m => extractBirthYear(m.birthdate));
    expect(years).toEqual(['1756', '1770', '1819', null]);
  });

  it('sorts alphabetically by surname then first name if no sortOption', () => {
    const shuffled = [...musicians].sort(() => Math.random() - 0.5);
    const sorted = sortMusicians(shuffled);
    const names = sorted.map(m => `${m.surname}, ${m.firstName}`);
    expect(names).toEqual([
      'Bach, Johann',
      'Beethoven, Ludwig',
      'Mozart, Wolfgang',
      'Schumann, Clara'
    ]);
  });
});