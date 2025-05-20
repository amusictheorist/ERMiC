import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownItem from './DropdownItem';

describe('DropdownItem', () => {
  const defaultOnClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders firstName and surname when available', () => {
    const item = { firstName: 'Istvan', surname: 'Anhalt' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    expect(screen.getByText('Istvan Anhalt')).toBeInTheDocument();
  });

  test('renders only firstName when surname is missing', () => {
    const item = { firstName: 'John' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => {}}
      />
    );
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('renders occupation when full name is not available', () => {
    const item = { name: 'pianist' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    expect(screen.getByText('pianist')).toBeInTheDocument();
  });

  test('renders title when full name and occupation are not avialable', () => {
    const item = { title: 'About Foci' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    expect(screen.getByText('About Foci')).toBeInTheDocument();
  });

  test('renders "unknown" when no relevant fields are present', () => {
    const item = {};
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  test('applies "selected" class when selectedIndex matches index', () => {
    const item = { name: 'Selected item' };
    const { container } = render(
      <DropdownItem
        item={item}
        index={2}
        selectedIndex={2}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    const li = container.querySelector('li');
    expect(li).toHaveClass('selected');
  });

  test('calls onClick with item when clicked', () => {
    const item = { name: 'Clickable item' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={() => { }}
      />
    );
    fireEvent.click(screen.getByText('Clickable item'));
    expect(defaultOnClick).toHaveBeenCalledWith(item);
  });

  test('assigns the ref properly', () => {
    const ref = createRef();
    const item = { name: 'Ref test' };
    render(
      <DropdownItem
        item={item}
        index={0}
        selectedIndex={-1}
        onClick={defaultOnClick}
        itemRef={ref}
      />
    );
    expect(ref.current.tagName).toBe('LI');
    expect(screen.getByText('Ref test')).toBe(ref.current);
  });
});