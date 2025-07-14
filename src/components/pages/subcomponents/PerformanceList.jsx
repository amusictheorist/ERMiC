import React from "react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const PerformanceList = ({ performances }) => {
  if (!performances || performances.lenfth === 0) return null;

  return (
    <div className="font-serif flex flex-col gap-6 my-6 text-left">
      {performances.map((performance, index) => (
        <div key={index} className="p-6 rounded bg-white border border-gray-200 shadow-sm">
          <p className="text-lg">
            <strong>Title:</strong> <em>{performance.title}</em>
          </p>
          {(performance.year || performance.dateRange) && (
            <p className="text-lg">
              <strong>{performance.year ? 'Year' : 'Years'}:</strong>
              {performance.year || performance.dateRange}
            </p>
          )}
          {performance.type && <p className="text-lg"><strong>Type:</strong>{performance.type}</p>}
          {performance.publicationInfo?.json && (
            <div className="mt-3">
              <p className="text-lg font-semibold"><strong>Publication Info:</strong></p>
              <div className="text-lg text-gray-800 leading-relaxed bg-slate-50 rounded p-4 mt-1">
                {documentToReactComponents(performance.publicationInfo.json)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PerformanceList;