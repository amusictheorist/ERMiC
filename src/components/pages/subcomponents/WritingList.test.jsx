jest.mock('@contentful/rich-text-react-renderer');

import React from 'react';
import { render } from '@testing-library/react';
import WritingList from './WritingList';

describe('WritingList', () => {
  it('renders nothing if no writings are provided', () => {
    const { container } = render(<WritingList writings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing if writings is undefined', () => {
    const { container } = render(<WritingList />);
    expect(container).toBeEmptyDOMElement();
  });
});
