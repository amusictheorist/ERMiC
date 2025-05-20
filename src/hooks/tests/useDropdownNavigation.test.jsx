import React, { useRef, useState } from "react";
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useDropdownNavigation from "../useDropdownNavigation";

const TestComponent = ({
  initialIndex = 0,
  totalResults,
  showDropdown = true,
  onSelect = () => { }
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const itemRefs = useRef([]);

  const handleSelect = jest.fn(onSelect);

  const handleKeyDown = useDropdownNavigation({
    totalResults,
    selectedIndex,
    setSelectedIndex,
    handleSelect,
    showDropdown,
    itemRefs
  });

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} data-testid='container'>
      {totalResults.map((item, index) => {
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          data-testid={`item-${index}`}
        >
          {item.name}
        </div>
      })}
    </div>
  );
};

describe('useDropdownNavigation', () => {
  const mockResults = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' }
  ];

  it('navigates down with ArrowDown key', () => {
    const { getByTestId } = render(
      <TestComponent totalResults={mockResults} />
    );
    const container = getByTestId('container');

    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' });
    fireEvent.keyDown(container, { key: 'ArrowDown' }); // wrap around
  });
  
  it('navigates up with ArrowUp key', () => {
    const { getByTestId } = render(
      <TestComponent totalResults={mockResults} initialIndex={0} />
    );
    const container = getByTestId('container');

    fireEvent.keyDown(container, { key: 'ArrowUp' });
  });

  it('calls handleSelect on Enter key', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <TestComponent totalResults={mockResults} initialIndex={1} onSelect={onSelect} />
    );
    const container = getByTestId('container');

    fireEvent.keyDown(container, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(mockResults[1]);
  });

  it('calls scrollIntoView on selected item', () => {
    const scrollSpy = jest.fn();
    const itemMock = { scrollIntoView: scrollSpy };

    const TestWithMockRef = () => {
      const [selectedIndex, setSelectedIndex] = useState(0);
      const itemRefs = useRef([itemMock]);

      useDropdownNavigation({
        totalResults: [{ name: 'Mock' }],
        selectedIndex,
        setSelectedIndex,
        handleSelect: jest.fn(),
        showDropdown: true,
        itemRefs
      });

      return <button onClick={() => setSelectedIndex(0)}>Change</button>
    };

    const { getByText } = render(<TestWithMockRef />);
    fireEvent.click(getByText('Change'));

    expect(scrollSpy).toHaveBeenCalled();
  });
});