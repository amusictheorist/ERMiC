import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { generateTextRenderer, nameMapBuilder, normalize } from '../../../utils/renderHelpers';

const RichTextRenderer = ({ document, footer = null, crossReferences = [] }) => {
  if (!document) return null;

  const nameEntries = nameMapBuilder(crossReferences, normalize);
  const matchedNames = new Set();
  const renderText = null;

  const options = {
    renderText,
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node) => {
        const textContent = node.content
          .map(child => (child.nodeType === 'text' ? child.value : ''))
          .join('');
        
        const processed = generateTextRenderer(nameEntries, matchedNames)(textContent);

        return (
          <p className='font-serif mb-4 text-lg sm:text-xl text-gray-800'>
            {processed}
          </p>
        );
      },
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