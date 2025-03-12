const DropdownItem = ({ item, index, selectedIndex, onClick, itemRef }) => {
  const isSelected = selectedIndex === index;

  return (
    <li
      key={item.slug || item.title}
      ref={itemRef}
      onClick={() => onClick(item)}
      className={`dropdown-item ${isSelected ? 'selected' : ''}`}
    >
      {item.firstName ? `${item.firstName} ${item.surname}` : item.title || item}
    </li>
  );
};

export default DropdownItem;