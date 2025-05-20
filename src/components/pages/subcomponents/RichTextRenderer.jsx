import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const RichTextRenderer = ({ document }) => {
  if (!document) return null;

  return (
    <div className="text-content">
      {documentToReactComponents(document)}
    </div>
  );
};

export default RichTextRenderer;