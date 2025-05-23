import React, { createRef } from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownItem from "./DropdownItem";

describe('DropdownItem', () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders full name when firstName and surname are provided', () => {
    const item = { firstName: 'Istvan', surname: 'Anhalt' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={onClickMock}
        itemRef={null}
      />
    );
    expect(screen.getByText('Istvan Anhalt')).toBeInTheDocument();
  });

  test('renders firstName with undefined surname gracefully', () => {
    const item = { firstName: 'Istvan' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={onClickMock}
        itemRef={null}
      />
    );
    expect(screen.getByText('Istvan undefined')).toBeInTheDocument();
  });

  test('renders string item directly if item is a string', () => {
    const item = 'Plain string';
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={onClickMock}
        itemRef={null}
      />
    );
    expect(screen.getByText('Plain string')).toBeInTheDocument();
  });

  test('applies "selected" class if selectedIndex matches index', () => {
    const item = 'Selected item';
    const { container } = render(
      <DropdownItem
        item={item}
        index={5}
        selectedIndex={5}
        onClick={onClickMock}
        itemRef={null}
      />
    );
    const li = container.querySelector('li');
    expect(li).toHaveClass('selected');
  });

  test('calls onClick with item when cicked', () => {
    const item = { firstName: 'Click', surname: 'Test' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={onClickMock}
        itemRef={null}
      />
    );
    fireEvent.click(screen.getByText('Click Test'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).toHaveBeenCalledWith(item);
  });
});