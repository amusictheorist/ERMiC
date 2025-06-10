import React, { useRef, useState } from "react";
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import useClickOutside from "../useClickOutside";


const TestComponent = ({ callback, containerSelector = null }) => {
  const ref = useRef(null);
  const [clickedOutside, setClickedOutisde] = useState(false);

  useClickOutside(ref, () => {
    setClickedOutisde(true);
    callback();
  }, containerSelector);

  return (
    <div>
      <div ref={ref} data-testid='inside'>
        Inside Element
      </div>
      <div data-testid='outside'>Outside Element</div>
      <div data-testid='status'>
        {clickedOutside ? 'Clicked outside' : 'Waiting'}
      </div>
    </div>
  );
};

describe('useClickOutside', () => {
  it('calls callback when clicking outside the ref', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(getByTestId('outside'));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(getByTestId('status')).toHaveTextContent('Clicked outside');
  });

  it('does not call callback when clicking inside the ref', () => {
    const callback = jest.fn();
    const { getByTestId } = render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(getByTestId('inside'));

    expect(callback).not.toHaveBeenCalled();
    expect(getByTestId('status')).toHaveTextContent('Waiting');
  });

  it('does not call callback if containerSelector matches the event target', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <div className="search-container">
        <TestComponent callback={callback} containerSelector='.search-container' />
      </div>
    );

    fireEvent.mouseDown(getByTestId('outside'));

    expect(callback).not.toHaveBeenCalled();
    expect(getByTestId('status')).toHaveTextContent('Waiting');
  });

  it('catches and logs errors thrown by the callback', () => {
    const error = new Error('Callback failed');
    const callback = jest.fn(() => { throw error; });
    console.error = jest.fn();

    const { getByTestId } = render(<TestComponent callback={callback} />);

    fireEvent.mouseDown(getByTestId('outside'));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Error in useClickOutside callback', error);
    expect(getByTestId('status')).toHaveTextContent('Clicked outside');
  });
});