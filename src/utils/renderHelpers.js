import { Link } from "react-router-dom";

// normalize, strip diacritics, and compress spacing
export const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// generate cross-references array
export const nameMapBuilder = (crossReferences, normalizeFn) =>
  crossReferences.map(ref => {
    const fullName = `${ref.firstName} ${ref.surname}`;
    const reversedName = `${ref.surname} ${ref.firstName}`;
    const surname = ref.surname;
    return {
      slug: ref.slug,
      fullName,
      reversedName,
      surname,
      fullNorm: normalizeFn(fullName),
      reversedNorm: normalizeFn(reversedName),
      surnameNorm: normalizeFn(surname)
    };
  });

// generate cross reference links
export const generateTextRenderer = (nameEntries) => (text) => {
  let elements = [text];
  const matchedNames = new Set();

  nameEntries.forEach(({ fullName, reversedName, slug }) => {
    if (matchedNames.has(slug)) return;

    let matched = false;

    elements = elements.flatMap(segment => {
      if (typeof segment !== 'string') return [segment];
      if (matched) return [segment];

      const nameVariants = [fullName, reversedName];
      for (const nameVariant of nameVariants) {
        const regex = new RegExp(`\\b${nameVariant}\\b`);
        const match = regex.exec(segment);

        if (match) {
          const { index } = match;
          const before = segment.slice(0, index);
          const after = segment.slice(index + nameVariant.length);

          matched = true;
          matchedNames.add(slug);

          return [
            before,
            <Link
              key={`${slug}-${index}`}
              to={`/musician/${slug}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {match[0]}
            </Link>,
            after
          ];
        }
      }

      return [segment];
    });
  });

  return elements;
};