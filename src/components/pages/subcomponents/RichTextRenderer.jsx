import React from 'react';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Link } from 'react-router-dom';

// Helper to normalize and strip diacritics
const normalize = str =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const RichTextRenderer = ({ document, footer = null, crossReferences = [] }) => {
  if (!document) return null;

  // Build map of normalized full names to slugs
  const nameMap = crossReferences.reduce((acc, ref) => {
    if (ref.slug && ref.firstName && ref.surname) {
      const full1 = `${ref.firstName} ${ref.surname}`;
      const full2 = `${ref.surname} ${ref.firstName}`;
      acc[normalize(full1)] = ref.slug;
      acc[normalize(full2)] = ref.slug;
    }
    return acc;
  }, {});

  const renderText = (text) => {
    const parts = text.split(/(\b[\p{L}]+(?:\s[\p{L}]+)+\b)/gu);
    return parts.map((part, i) => {
      const normalized = normalize(part.trim());
      const matchedSlug = nameMap[normalized];

      if (matchedSlug) {
        console.log(`Matched "${part}" -> slug: ${matchedSlug}`);
        return (
          <Link
            key={i}
            to={`/musician/${matchedSlug}`}
            className='text-blue-600 hover:text-blue-800'
          >
            {part}
          </Link>
        );
      }

      return part;
    });
  };

  const options = {
    renderText,
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
