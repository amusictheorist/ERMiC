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

export const generateTextRenderer = (nameEntries) => (text) => {
  let elements = [text];

  nameEntries.forEach(({ fullName, reversedName, slug }) => {
    elements = elements.flatMap(segment => {
      if (typeof segment !== 'string') return [segment];

      const matches = [];

      [fullName, reversedName].forEach(nameVariant => {
        const regex = new RegExp(`\\b${nameVariant}\\b`, 'g');
        let match;
        while ((match = regex.exec(segment)) !== null) {
          matches.push({
            index: match.index,
            length: match[0].length,
            text: match[0]
          });
        }
      });

      if (matches.length === 0) return [segment];
    
      const parts = [];
      let lastIndex = 0;
      matches.forEach(({ index, length, text }, i) => {
        if (index > lastIndex) {
          parts.push(segment.slice(lastIndex, index));
        }

        parts.push(
          <Link
            key={`${slug}-${index}-${i}`}
            to={`/musician/${slug}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {text}
          </Link>
        );
        
        lastIndex = index + length;
      });

      if (lastIndex < segment.length) {
        parts.push(segment.slice(lastIndex));
      }

      return parts;
    });
  });

  return elements;
};