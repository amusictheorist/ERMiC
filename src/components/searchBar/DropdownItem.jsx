// this component rendnrs the list of dropdown items when typing into the search bar
const DropdownItem = ({ item, index, selectedIndex, onClick, itemRef }) => {
  const isSelected = selectedIndex === index;

  const isStringItem = typeof item === 'string';
  const displayText = isStringItem
    ? item
    : item.fullName ||
    (item.firstName && item.surname && `${item.firstName} ${item.surname}`) ||
    (item.names && item.surnames && `${item.names} ${item.surnames}`) ||
    item.title ||
    item.occupation ||
    'Untitled';

  let itemType = null;
  if (isStringItem) itemType = 'occupation';
  else if (item.fullName || (item.names && item.surnames)) itemType = 'author';
  else if (item.firstName && item.surname) itemType = 'musician';
  else if (item.title && item.instrumentation) itemType = 'work';
  else if (item.title && item.type && item.musician) itemType = 'writing';
  else if (item.title && item.publicationInfo) itemType = 'performance and/or media';

  return (
    <li
      ref={itemRef}
      onClick={() => onClick(item)}
      className={`selected px-4 py-2 cursor-pointer text-base sm:text-sm border-b border-gray-200 ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
    >
      <div className="flex flex-col">
        <span className="font-medium">{displayText}</span>
        {itemType && (
          <span className="text-xs text-gray-500">{itemType}</span>
        )}
      </div>
    </li>
  );
};

export default DropdownItem;