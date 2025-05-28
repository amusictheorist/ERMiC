import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WorkList = ({ works }) => {
  if (!works || works.length === 0) return null;

  return (
      <div className="font-serif flex flex-col gap-4 my-6 text-left">
        {works.map((work, index) => (
          <div key={index} className="p-4 rounded bg-white border border-gray-200 shadow-sm">
            <p><strong>Title:</strong> <em>{work.title}</em></p>
            {work.year && <p><strong>Year:</strong> {work.year}</p>}
            {work.type && <p><strong>Type:</strong> {work.type}</p>}
            {work.instrumentation?.length > 0 && (
              <p><strong>Instrumentation:</strong> {work.instrumentation.join(', ')}</p>
            )}
            {work.publicationInfo?.json && (
              <div className='mt-2'>
                <p><strong>Publication Info:</strong></p>
                <div className='text-base text-gray-800 leading-relaxed bg-slate-50 rounded p-3 mt-1'>
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