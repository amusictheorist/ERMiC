import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WorkList = ({ works }) => {
  if (!works || works.length === 0) return null;

  return (
      <div className="font-serif flex flex-col gap-6 my-6 text-left">
        {works.map((work, index) => (
          <div key={index} className="p-6 rounded bg-white border border-gray-200 shadow-sm">
            <p className='text-lg'>
              <strong>Title:</strong> <em>{work.title}</em>
            </p>
            {(work.year || work.dateRange) && (
              <p className='text-lg'>
                <strong>{work.year ? 'Year' : 'Years'}:</strong> {work.year || work.dateRange}
                </p>
              )}
            {work.type && <p className='text-lg'><strong>Type:</strong> {work.type}</p>}
            {work.instrumentation?.length > 0 && (
              <p className='text-lg'>
                <strong>Instrumentation:</strong> {work.instrumentation.join(', ')}
              </p>
            )}
            {work.publicationInfo?.json && (
              <div className='mt-3'>
                <p className='text-lg font-semibold'><strong>Publication Info:</strong></p>
                <div className='text-lg text-gray-800 leading-relaxed bg-slate-50 rounded p-4 mt-1'>
                  {documentToReactComponents(work.publicationInfo.json)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default WorkList;
