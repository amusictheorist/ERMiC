import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
    <>
      <h2 className='text-3xl font-semibold my-8'>Writings</h2>
      <div className="flex flex-col gap-4 my-4">
        {writings.map((writing, index) => (
          <div key={index} className="p-4 rounded bg-white text-left border border-gray-300
 shadow-sm">
            <p>
              <strong>Title:</strong>
              {writing.type === 'Book' ? (
                <em> {writing.title}</em>
              ) : (
                <> {writing.title}</>
              )}
            </p>
            {writing.year && <p><strong>Year:</strong> {writing.year}</p>}
            {writing.type && <p><strong>Type:</strong> {writing.type}</p>}
            {writing.publicationInfo?.json && (
              <div>
                <p><strong>Publication Info:</strong></p>
                <div className="text-left m-4 text-base text-gray-800 leading-relaxed p-4 rounded bg-slate-50">
                  {documentToReactComponents(writing.publicationInfo.json)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WritingList;