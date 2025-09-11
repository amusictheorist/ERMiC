import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WorkList = ({ works }) => {
  if (!works || works.length === 0) return null;

  // Group works by type
  const worksByType = works.reduce((acc, work) => {
    const type = work.type || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(work);
    return acc;
  }, {});

  // Sort works within each type by year/date
  Object.keys(worksByType).forEach((type) => {
    worksByType[type].sort((a, b) => {
      const yearA = parseInt(a.year || a.dateRange?.split("-")[0], 10) || 0;
      const yearB = parseInt(b.year || b.dateRange?.split("-")[0], 10) || 0;
      return yearA - yearB;
    });
  });

  return (
    <div className="font-serif text-lg space-y-6 text-left">
      {Object.entries(worksByType).map(([type, works]) => (
        <div key={type}>
          <h3 className="font-serif text-xl font-bold mb-2">{type}</h3>
          <ul className="space-y-2">
            {works.map((work, index) => {
              const title = work.title ? (
                <span className="font-semibold">
                  <em>{work.title}</em>
                </span>
              ) : null;

              const year = work.year || work.dateRange;
              const instrumentation =
                work.instrumentation?.length > 0
                  ? work.instrumentation.join(", ")
                  : null;

              return (
                <li key={index} className="leading-snug">
                  {title}
                  {instrumentation && ` for ${instrumentation}`}
                  {year && ` (${year})`}

                  {work.publicationInfo?.json && (
                    <div className="mt-1 ml-4 text-gray-800 text-base">
                      {documentToReactComponents(work.publicationInfo.json)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WorkList;
