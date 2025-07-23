export const normalizeText = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || '';

export const match = (query) => {
  const normalizedQuery = normalizeText(query);
  return (text) => normalizeText(text).includes(normalizedQuery);
};

export const groupByMusician = (items) =>
  items.reduce((acc, item) => {
    const musician = item.musician;
    if (!musician) return acc;
    const key = musician.slug;
    if (!acc[key]) acc[key] = { musician, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

export const enrichWithMusician = (items, musicianMap) =>
  items.map(item => ({
    ...item,
    musician: musicianMap[item.musician?.slug] || null
  }));