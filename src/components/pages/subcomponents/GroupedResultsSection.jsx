import React from "react";
import { useNavigate } from "react-router-dom";

const GroupedResultsSection = ({ title, groupedItems }) => {
  const navigate = useNavigate();

  if (!Object.keys(groupedItems).length) return null;

  return (
    <section className="mb-10">
      <h2 className="font-serif text-lg sm:text-2xl font-semibold mb-4">{title}</h2>
      {Object.values(groupedItems).map(group => (
        <div key={group.musician.slug} className="mb-6">
          <h3
            className="font-serif text-lg sm:text-xl font-semibold text-blue-700 cursor-pointer hover:underline mb-2"
            onClick={() => navigate(`/musician/${group.musician.slug}`)}
          >
            {group.musician.surname}, {group.musician.firstName}
          </h3>
          <ul className="grid gap-2 pl-4 sm:pl-6 list-disc text-left text-gray-800 font-serif text-base sm:text-lg">
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