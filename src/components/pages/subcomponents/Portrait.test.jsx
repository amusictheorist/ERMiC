import React from 'react';
import { render, screen } from '@testing-library/react';
import Portrait from './Portrait';

describe('Portrait', () => {
  it('renders an image when url is provided', () => {
    render(<Portrait url="https://example.com/photo.jpg" alt="Test Portrait" />);
    const img = screen.getByAltText('Test Portrait');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders nothing when url is missing', () => {
    const { container } = render(<Portrait alt="Missing URL" />);
    expect(container.firstChild).toBeNull();
  });
});
