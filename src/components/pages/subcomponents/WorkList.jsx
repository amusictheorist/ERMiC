import React from 'react';

const WorkList = ({ works }) => {
  if (!works || works.length === 0) return null;

  return (
    <>
      <div className="my-6 text-left">
        {works.map((work, index) => (
          <div key={index} className="p-3 my-4 bg-slate-50 rounded border border-gray-300">
            <p className='text-blue-500'><strong>Title:</strong> <em>{work.title}</em></p>
            {work.year && <p className='text-blue-500'><strong>Year:</strong> {work.year}</p>}
            {work.type && <p className='text-blue-500'><strong>Type:</strong> {work.type}</p>}
            {work.instrumentation?.length > 0 && (
              <p className='text-blue-500'><strong>Instrumentation:</strong> {work.instrumentation.join(', ')}</p>
            )}
            {work.publicationInfo && (
              <p className='text-blue-500'><strong>Publication Info:</strong> {work.publicationInfo}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkList;