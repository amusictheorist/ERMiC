import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import CollapsibleSection from "./Collapsible";

describe('CollapsibleSection', () => {
  const title = 'Biography';
  const childrenText = 'This is the biography content.';

  const renderComponent = (isOpen = false, setIsOpen = jest.fn()) =>
    render(
      <CollapsibleSection title={title} isOpen={isOpen} setIsOpen={setIsOpen}>
        {childrenText}
      </CollapsibleSection>
    );
  
  it('renders the section title', () => {
    renderComponent();
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('hides content when isOpen is false', () => {
    renderComponent(false);
    const content = screen.getByTestId('collapsible-content');
    expect(content).toHaveStyle('max-height: 0px');
    expect(content).toHaveStyle('opacity: 0');
  });

  it('shows content when isOpen is true', () => {
    renderComponent(true);
    const content = screen.getByTestId('collapsible-content');
    expect(content).toHaveStyle('max-height: 0px');
    expect(content).toHaveStyle('opacity: 1');
  });

  it('calls setIsOpen when title is clicked', () => {
    const mockeSetIsOpen = jest.fn();
    renderComponent(false, mockeSetIsOpen);

    const button = screen.getByRole('button', { name: /biography/i });
    fireEvent.click(button);
    expect(mockeSetIsOpen).toHaveBeenCalledWith(true);
  });
});