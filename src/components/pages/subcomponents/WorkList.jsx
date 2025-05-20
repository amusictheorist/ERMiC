import React from 'react';

const WorkList = ({ works }) => {
  if (!works || works.length === 0) return null;

  return (
    <>
      <h2>Works</h2>
      <div className="works-list">
        {works.map((work, index) => (
          <div key={index} className="work-item">
            <p><strong>Title:</strong> <em>{work.title}</em></p>
            {work.year && <p><strong>Year:</strong> {work.year}</p>}
            {work.type && <p><strong>Type:</strong> {work.type}</p>}
            {work.instrumentation?.length > 0 && (
              <p><strong>Instrumentation:</strong> {work.instrumentation.join(', ')}</p>
            )}
            {work.publicationInfo && (
              <p><strong>Publication Info:</strong> {work.publicationInfo}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkList;