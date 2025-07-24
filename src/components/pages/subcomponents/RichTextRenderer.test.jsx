import React from "react";
import { render, screen } from '@testing-library/react';
import RichTextRenderer from './RichTextRenderer';

jest.mock('../../../utils/renderHelpers', () => ({
  nameMapBuilder: jest.fn(),
  normalize: jest.fn()
}));

jest.mock('./NodeRenderer', () => ({
  renderNodes: jest.fn()
}));

import { nameMapBuilder, normalize } from "../../../utils/renderHelpers";
import { renderNodes } from "./NodeRenderer";

describe('RichTextRenderer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing if no document is provided', () => {
    const { container } = render(<RichTextRenderer document={null} />);
    expect(container).toBeEmptyDOMElement();
    expect(renderNodes).not.toHaveBeenCalled();
  });

  test('calls renderNodes with document content and mapped names', () => {
    const mockDoc = { content: ['fake-node'] };
    const mockEntries = { foo: 'bar' };
    const mockOutput = <p>Rendered</p>;

    nameMapBuilder.mockReturnValue(mockEntries);
    renderNodes.mockReturnValue(mockOutput);

    render(<RichTextRenderer document={mockDoc} crossReferences={['one', 'two']} />);

    expect(nameMapBuilder).toHaveBeenCalledWith(['one', 'two'], normalize);
    expect(renderNodes).toHaveBeenCalledWith(['fake-node'], mockEntries, expect.any(Set));
    expect(screen.getByText('Rendered')).toBeInTheDocument();
  });

  test('renders footer when provided', () => {
    const mockDoc = { content: [] };
    renderNodes.mockReturnValue(null);
    
    render(<RichTextRenderer document={mockDoc} footer={<div>Footer here</div>} />);
    expect(screen.getByText('Footer here')).toBeInTheDocument();
  });
  
  test('does not render footer if not provided', () => {
    const mockDoc = { content: [] };
    renderNodes.mockReturnValue(null);

    const { container } = render(<RichTextRenderer document={mockDoc} />);
    expect(container).not.toHaveTextContent('Footer here')
  });
});