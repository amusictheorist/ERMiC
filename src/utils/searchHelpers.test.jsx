import { match, groupByMusician, enrichWithMusician } from "./searchHelpers";

describe('match', () => {
  it('returns true when query is included in text (case-insensitive)', () => {
    const matcher = match('anna');
    expect(matcher('Anna Smith')).toBe(true);
  });

  it('returns false when query is not in text', () => {
    const matcher = match('anna');
    expect(matcher('Bob Jones')).toBe(false);
  });

  it('returns false when text is null or undefined', () => {
    const matcher = match('test');
    expect(matcher(null)).toBe(false);
    expect(matcher(undefined)).toBe(false);
  });
});

describe('groupByMusician', () => {
  it('groups items by musician slug', () => {
    const items = [
      { id: 1, musician: { slug: 'smith', firstName: 'Anna', surname: 'Smith' } },
      { id: 2, musician: { slug: 'jones', firstName: 'Bob', surname: 'Jones' } },
      { id: 3, musician: { slug: 'anhalt', firstName: 'Istvan', surname: 'Anhalt' } }
    ];

    const result = groupByMusician(items);
    expect(Object.keys(result)).toEqual(['smith', 'jones', 'anhalt']);
    expect(result.smith.items).toHaveLength(1);
    expect(result.jones.items).toHaveLength(1);
    expect(result.anhalt.items).toHaveLength(1);
  });

  it('skips items without a musician', () => {
    const items = [
      { id: 1, musician: { slug: 'smith', firstName: 'Anna', surname: 'Smith' } },
      { id: 2 }
    ];

    const result = groupByMusician(items);
    expect(Object.keys(result)).toEqual(['smith']);
    expect(result.smith.items).toHaveLength(1);
  });
});

describe('enrichWithMusician', () => {
  it('replaces musician reference with full musician object from map', () => {
    const items = [
      { id: 1, musician: { slug: 'smith' } },
      { id: 2, musician: { slug: 'jones' } }
    ];

    const musicianMap = {
      smith: { slug: 'smith', firstName: 'Anna', surname: 'Smith' },
      jones: { slug: 'jones', firstName: 'Bob', surname: 'Jones' }
    };

    const result = enrichWithMusician(items, musicianMap);
    expect(result[0].musician.firstName).toBe('Anna');
    expect(result[0].musician.surname).toBe('Smith');
    expect(result[1].musician.firstName).toBe('Bob');
    expect(result[1].musician.surname).toBe('Jones');
  });

  it('sets musician to null if not in map', () => {
    const items = [{ id: 1, musician: { slug: 'unknown' } }];
    const musicianMap = {};
    const result = enrichWithMusician(items, musicianMap);
    expect(result[0].musician).toBeNull();
  });

  it('handles missing musician field gracefully', () => {
    const items = [{ id: 1 }];
    const musicianMap = {};
    const result = enrichWithMusician(items, musicianMap);
    expect(result[0].musician).toBeNull();
  });
})