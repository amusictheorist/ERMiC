const extractBirthYear = (dateString) => {
  if (typeof dateString !== 'string') return null;
  const match = dateString.match(/\b(1[7-9]\d{2}|20\d{2})\b/);
  return match ? match[0] : null;
};

export const groupByBirthCountry = (list) => {
  const groups = {};
  list.forEach((musician) => {
    const birthPlace = musician.birthPlace || 'Other';
    const birthCountry = birthPlace.includes(',') ? birthPlace.split(',').pop().trim() : birthPlace;
    const birthGroup = birthCountry || 'Other';
    if (!groups[birthGroup]) groups[birthGroup] = [];
    groups[birthGroup].push(musician);
  });
  return groups;
};

export const groupByDeathCountry = (list) => {
  const groups = {};
  list.forEach((musician) => {
    const deathPlace = musician.deathPlace || 'Other';

    if (!deathPlace || deathPlace.toLowerCase() === 'n/a') {
      if (!groups['Still Living']) groups['Still Living'] = [];
      groups['Still Living'].push(musician);
      return;
    }

    const deathCountry = deathPlace.includes(',')
      ? deathPlace.split(',').pop().trim()
      : deathPlace;

    const deathGroup = deathCountry || 'Other';
    if (!groups[deathGroup]) groups[deathGroup] = [];
    groups[deathGroup].push(musician);
  });
  return groups;
};

export const splitCanadianGroups = (groups) => {
  const provinces = ['ON','QC','BC','MB','NL','NS','AB','SK','NB','PE','YT','NT','NU', 'Canada'];
  const inCanada = {};
  const others = {};

  Object.entries(groups).forEach(([key, value]) => {
    if (provinces.includes(key)) {
      inCanada[key] = value;
    } else {
      others[key] = value;
    }
  });

  return { inCanada, others };
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
    if (sortOption === 'birthCountry') {
      const placeA = a.birthPlace?.split(',').pop().trim() || 'Other';
      const placeB = b.birthPlace?.split(',').pop().trim() || 'Other';
      return placeA.localeCompare(placeB);
    }

    if (sortOption === 'deathCountry') {
      const placeA = a.deathPlace?.split(',').pop().trim() || 'Other';
      const placeB = b.deathPlace?.split(',').pop().trim() || 'Other';
      return placeA.localeCompare(placeB);
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