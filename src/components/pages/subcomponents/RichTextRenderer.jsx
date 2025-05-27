import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {BLOCKS} from '@contentful/rich-text-types';

const RichTextRenderer = ({ document }) => {
  if (!document) return null;

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className='mb-4 text-base text-gray-800'>{children}</p>
      )
    }
  };

  return (
    <div className="text-left m-4 text-base leading-relaxed p-4 rounded bg-slate-50">
      {documentToReactComponents(document, options)}
    </div>
  );
};

export default RichTextRenderer;