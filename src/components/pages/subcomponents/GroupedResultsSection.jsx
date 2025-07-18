import React from "react";
import { useNavigate } from "react-router-dom";

const GroupedResultsSection = ({ title, groupedItems, shouldItalicizeItem }) => {
  const navigate = useNavigate();

  if (!Object.keys(groupedItems).length) return null;

  const isWritingSection = title === 'Writings';

  return (
    <section className="mb-6">
      <h2 className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm font-serif text-2xl sm:text-3xl font-semibold py-2 px-2 border-b border-gray-200 mb-4">
        {title}
      </h2>
      {Object.values(groupedItems).map(group => (
        <div key={group.musician.slug} className="mb-6">
          <h3
            className="font-serif text-base sm:text-lg font-semibold text-gray-800 cursor-pointer hover:underline hover:text-blue-700 transition"
            onClick={() => navigate(`/musician/${group.musician.slug}`)}
          >
            {group.musician.surname}, {group.musician.firstName}
          </h3>
          <ul className="list-disc pl-6 text-base sm:text-lg text-gray-800 font-serif space-y-1 mt-1">
            {group.items.map(item => {
              const italicize = shouldItalicizeItem?.(item);
              const quoted = isWritingSection && item.type && item.type !== 'Book';

              return (
                <li
                  key={item.title}
                  className={`hover:text-blue-600 transition ${italicize ? 'italic' : ''}`}>
                  {quoted ? `"${item.title}"` : item.title}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <hr className="my-6 border-gray-300" />
    </section>
  );
};

export default GroupedResultsSection;