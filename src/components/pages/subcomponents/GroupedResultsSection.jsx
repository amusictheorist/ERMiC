import React from "react";
import { useNavigate } from "react-router-dom";

const GroupedResultsSection = ({ title, groupedItems }) => {
  const navigate = useNavigate();

  if (!Object.keys(groupedItems).length) return null;

  return (
    <section className="mb-6">
      <h2 className="font-serif text-lg sm:text-xl font-semibold mb-3">{title}</h2>
      {Object.values(groupedItems).map(group => (
        <div key={group.musician.slug} className="mb-4">
          <h3
            className="font-serif text-base sm:text-base font-bold text-gray-900 cursor-pointer hover:underline mb-1"
            onClick={() => navigate(`/musician/${group.musician.slug}`)}
          >
            {group.musician.surname}, {group.musician.firstName}
          </h3>
          <ul className="list-disc pl-5 text-sm sm:text-base text-gray-800 font-serif space-y-1">
            {group.items.map(item => (
              <li key={item.title}>{item.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default GroupedResultsSection;