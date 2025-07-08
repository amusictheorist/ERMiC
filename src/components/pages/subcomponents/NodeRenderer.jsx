import React from "react";
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { generateTextRenderer } from '../../../utils/renderHelpers';
import { Link } from "react-router-dom";

export function renderNodes(nodes, nameEntries, matchedNames) {
  if (!nodes) return null;
  const elements = [];
  let textBuffer = '';

  const flushTextBuffer = () => {
    if (textBuffer) {
      elements.push(
        <React.Fragment key={`text-${elements.length}`}>
          {generateTextRenderer(nameEntries, matchedNames)(textBuffer)}
        </React.Fragment>
      );
      textBuffer = '';
    }
  };

  nodes.forEach((node, index) => {
    switch (node.nodeType) {
      case 'text':
        textBuffer += node.value;
        break;
      
      case INLINES.HYPERLINK:
        flushTextBuffer();
        elements.push(
          <a
            key={`link-${index}`}
            href={node.data.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {renderNodes(node.content, nameEntries, matchedNames)}
          </a>
        );
        break;
      
      case INLINES.ENTRY_HYPERLINK:
        flushTextBuffer();
        const entry = node.data.target;
        if (entry?.slug && entry?.firstName && entry?.surname) {
          elements.push(
            <Link
              key={`entry-link-${index}`}
              to={`/musician/${entry.slug}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {`${entry.firstName} ${entry.surname}`}
            </Link>
          );
        } else {
          elements.push(
            <span key={`entry-link-${index}`}>
              {renderNodes(node.content, nameEntries, matchedNames)}
            </span>
          );
        }
        break;
      
      case BLOCKS.PARAGRAPH:
        flushTextBuffer();
        elements.push(
          <p key={`p-${index}`} className="font-serif mb-4 text-lg sm:text-xl text-gray-800">
            {renderNodes(node.content, nameEntries, matchedNames)}
          </p>
        );
        break;
      
      default:
        flushTextBuffer();
        if (node.content) {
          elements.push(
            <React.Fragment key={`frag-${index}`}>
              {renderNodes(node.content, nameEntries, matchedNames)}
            </React.Fragment>
          );
        }
        break
    }
  });

  flushTextBuffer();
  return elements;
};