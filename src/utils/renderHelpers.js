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
    return {
      slug: ref.slug,
      originalNames: [fullName, reversedName],
      normalizedNames: [normalize(fullName), normalize(reversedName)]
    };
  });

// generate cross reference links
export const generateTextRenderer = (nameEntries, matchedNames) => (text) => {
  let elements = [text];

  nameEntries.forEach(({ originalNames, normalizedNames, slug }) => {
    if (matchedNames.has(slug)) return;

    let matched = false;

    elements = elements.flatMap(segment => {
      if (typeof segment !== 'string' || matched) return [segment];

      const normalizedSegment = normalize(segment);

      for (let i = 0; i < normalizedNames.length; i++) {
        const normName = normalizedNames[i];
        const originalName = originalNames[i];

        const index = normalizedSegment.indexOf(normName);
        if (index !== -1) {
          const escaped = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escaped, 'i');

          const match = regex.exec(segment);
          
          if (!match) continue;
          
          const matchText = match[0];
          const matchIndex = match.index;

          const before = segment.slice(0, matchIndex);
          const after = segment.slice(matchIndex + matchText.length);

          matchedNames.add(slug);
          matched = true;
          
          return [
            before,
            <Link
              key={`${slug}-${matchIndex}`}
              to={`/musician/${slug}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {matchText}
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
