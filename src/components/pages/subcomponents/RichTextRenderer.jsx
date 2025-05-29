import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

const RichTextRenderer = ({ document, footer = null }) => {
  if (!document) return null;

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className='font-serif mb-4 text-base text-gray-800'>{children}</p>
      ),
      [INLINES.HYPERLINK]: (node, children) => {
        const url = node.data.uri;
        return (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline hover:text-blue-800'
          >
            {children}
          </a>
        );
      }
    }
  };

  return (
    <div className="text-left m-4 text-base leading-relaxed p-4 rounded bg-slate-50">
      {documentToReactComponents(document, options)}
      {footer && <div className='mt-6'>{footer}</div>}
    </div>
  );
};

export default RichTextRenderer;