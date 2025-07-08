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
        className="w-full flex justify-between items-center text-left text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.replace(/\s+/g, '-')}`}
      >
        <span className="font-serif">{title}</span>
        <ChevronDown
          className={`h-5 w-5 sm:h-6 sm:w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        ref={contentRef}
        id={`collapsible-${title.replace(/\s+/g, '-')}`}
        data-testid='collapsible-content'
        style={{
          maxHeight: height,
          transition: 'max-height 0.4s ease, opacity 0.4s ease',
          overflow: 'hidden',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pt-4 text-base sm:text-lg md:text-xl text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;