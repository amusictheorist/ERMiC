import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react"

// this subcomponent renders the expandable sections in a musician page
const CollapsibleSection = ({ title, isOpen, setIsOpen, children }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen, children]);

  return (
    <div className="border-b border-gray-300 py-4 text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-2xl font-semibold text-gray-800"
      >
        {title}
        <ChevronDown
          className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          transition: 'max-height 0.4s ease, opacity 0.4s ease',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;