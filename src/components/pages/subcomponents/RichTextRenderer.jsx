import React from "react";
import { nameMapBuilder, normalize } from '../../../utils/renderHelpers';
import { renderNodes } from "./NodeRenderer";

const RichTextRenderer = ({ document, footer = null, crossReferences = [] }) => {
  if (!document) return null;

  const nameEntries = nameMapBuilder(crossReferences, normalize);
  const matchedNames = new Set();

  return (
    <div className="text-left m-4 text-base leading-relaxed p-4 rounded bg-slate-50">
      {renderNodes(document.content, nameEntries, matchedNames)}
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
};

export default RichTextRenderer;