import React from 'react';
import { render, screen } from '@testing-library/react';
import RichTextRenderer from './RichTextRenderer';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

jest.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: jest.fn(),
}));

describe('RichTextRenderer', () => {
  it('renders nothing if no document is provided', () => {
    const { container } = render(<RichTextRenderer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders content when document is provided', () => {
    documentToReactComponents.mockReturnValue(<p>Mocked Rich Text</p>);
    render(<RichTextRenderer document={{ nodeType: 'document' }} />);
    expect(screen.getByText('Mocked Rich Text')).toBeInTheDocument();
  });
});
