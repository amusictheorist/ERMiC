export const extractBirthYear = (dateString) => {
  if (typeof dateString !== 'string') return null;
  const match = dateString.match(/\b(1[7-9]\d{2}|20\d{2})\b/);
  return match ? match[0] : null;
};

export const groupByCountry = (list, placeKey) => {
  const groups = {};
  list.forEach((musician) => {
    const rawPlace = musician[placeKey] || '';
    const country = rawPlace.includes(',') ? rawPlace.split(',').pop().trim() : null;
    const group = country || 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(musician);
  });
  return groups;
};

export const groupByBirthYear = (list) => {
  const groups = {};
  list.forEach((musician) => {
    const year = extractBirthYear(musician.birthdate) || 'Unknown';
    if (!groups[year]) groups[year] = [];
    groups[year].push(musician);
  });
  return groups;
};

export const sortMusicians = (musicians, sortOption) => {
  return [...musicians].sort((a, b) => {
    const getCountry = (place) =>
      place?.includes(',') ? place.split(',').pop().trim().toLowerCase() : '';

    if (sortOption === 'birthCountry') {
      return getCountry(a.birthPlace).localeCompare(getCountry(b.birthPlace));
    }

    if (sortOption === 'deathCountry') {
      return getCountry(a.deathPlace).localeCompare(getCountry(b.deathPlace));
    }

    if (sortOption === 'birthYear') {
      const yearA = parseInt(extractBirthYear(a.birthdate)) || Infinity;
      const yearB = parseInt(extractBirthYear(b.birthdate)) || Infinity;
      return yearA - yearB;
    }

    const surnameA = a.surname.toLowerCase();
    const surnameB = b.surname.toLowerCase();
    const firstNameA = a.firstName?.toLowerCase() || '';
    const firstNameB = b.firstName?.toLowerCase() || '';

    if (surnameA < surnameB) return -1;
    if (surnameA > surnameB) return 1;
    return firstNameA.localeCompare(firstNameB);
  });
};