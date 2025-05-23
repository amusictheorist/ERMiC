// this component rendnrs the list of dropdown items when typing into the search bar
const DropdownItem = ({ item, index, selectedIndex, onClick, itemRef }) => {
  const isSelected = selectedIndex === index;

  return (
    <li
      ref={itemRef}
      onClick={() => onClick(item)}
      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
    >
      {item.firstName ? `${item.firstName} ${item.surname}` : item.title || item}
    </li>
  );
};

export default DropdownItem;