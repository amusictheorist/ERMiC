import React from "react";
import { useNavigate } from "react-router-dom";

const GroupedResultsSection = ({ title, groupedItems }) => {
  const navigate = useNavigate();

  if (!Object.keys(groupedItems).length) return null;

  return (
    <section>
      <h2 className="text-xl font font-semibold mt-6">{title}</h2>
      {Object.values(groupedItems).map(group => (
        <div key={group.musician.slug} className="mb-4">
          <h3
            className="font-medium text-lg cursor-pointer hover:underline"
            onClick={() => navigate(`/musician/${group.musician.slug}`)}
          >
            {group.musician.surname}, {group.musician.firstName}
          </h3>
          <ul className="ml-4 list-disc">
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