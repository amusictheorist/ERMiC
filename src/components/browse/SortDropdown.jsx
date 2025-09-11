import { useEffect, useRef, useState } from "react";

const SortDropdown = ({ sortOption, setSortOption }) => {
  const options = [
    { value: 'surname', label: 'Surname (A-Z)' },
    { value: 'birthCountry', label: 'Place of Birth' },
    { value: 'deathCountry', label: 'Place of Death' },
    { value: 'birthYear', label: 'Birth Year (Oldest-Youngest)' }
  ];

  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === sortOption)?.label;

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex justify-between w-72 px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {selectedLabel}
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSortOption(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${sortOption === opt.value ? 'bg-gray-100 font-semibold' : ''
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;