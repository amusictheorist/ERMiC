import React from 'react';

// this component redners the list of dropdown items when typing into the search bar
const DropdownItem = ({ item, index, selectedIndex, onClick, itemRef }) => {
  const isSelected = selectedIndex === index;

  const displayName = item.firstName
    ? `${item.firstName}${item.surname ? ` ${item.surname}` : ''}`
    : item.name || item.title || 'unknown';

  return (
    <li
      ref={itemRef}
      onClick={() => onClick(item)}
      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
    >
      {displayName}
    </li>
  );
};

export default DropdownItem;