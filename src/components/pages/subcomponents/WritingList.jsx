import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
      <div className="flex flex-col gap-4 my-6 text-left">
        {writings.map((writing, index) => (
          <div key={index} className="p-4 rounded bg-white border border-gray-300 shadow-sm">
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
                <div className="text-base text-gray-800 leading-relaxed bg-slate-50 rounded p-3 mt-1">
                  {documentToReactComponents(writing.publicationInfo.json)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default WritingList;