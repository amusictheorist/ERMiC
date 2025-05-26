import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const RichTextRenderer = ({ document }) => {
  if (!document) return null;

  return (
    <div className="text-left m-4 text-base text-gray-800 leading-relaxed p-4 rounded bg-slate-50">
      {documentToReactComponents(document)}
    </div>
  );
};

export default RichTextRenderer;