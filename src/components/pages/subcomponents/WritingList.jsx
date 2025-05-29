import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
    <div className="font-serif text-left m-4 text-base leading-relaxed p-4 rounded bg-slate-50 text-gray-800">
      {writings.map((writing, index) => (
        writing.publicationInfo?.json && (
          <div key={index} className='mb-4' >
            {documentToReactComponents(writing.publicationInfo.json)}
          </div>
        )
      ))}
    </div>
  );
};

export default WritingList;