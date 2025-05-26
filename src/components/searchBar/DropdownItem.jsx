// this component rendnrs the list of dropdown items when typing into the search bar
const DropdownItem = ({ item, index, selectedIndex, onClick, itemRef }) => {
  const isSelected = selectedIndex === index;

  return (
    <li
      ref={itemRef}
      onClick={() => onClick(item)}
      className={`selected qpx-4 py-2 cursor-pointer border-b border-gray-200 ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
    >
      {item.firstName ? `${item.firstName} ${item.surname}` : item.title || item}
    </li>
  );
};

export default DropdownItem;