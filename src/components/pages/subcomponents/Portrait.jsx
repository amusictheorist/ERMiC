import React, { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";

const Portrait = ({ url, alt, description, title }) => {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [touchVisible, setTouchVisible] = useState(false);
  const containerRef = useRef(null);

  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  useClickOutside(containerRef, () => {
    if (isTouchDevice) setTouchVisible(false);
  });

  if (!url) return null;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center m-8"
    >
      <img
        src={url}
        alt={alt || 'Portrait'}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md max-h-80 rounded-lg object-contain shadow-md"
        loading="lazy"
        onMouseEnter={() => !isTouchDevice && setHover(true)}
        onMouseLeave={() => !isTouchDevice && setHover(false)}
        onMouseMove={(e) => !isTouchDevice && handleMouseMove(e)}
        onClick={() => isTouchDevice && setTouchVisible((v) => !v)}
      />

      {!isTouchDevice && hover && description && (
        <div
          className='whitespace-pre-line absolute bg-gray-300 text-sm text-left px-3 py-1 rounded shadow pointer-events-none transition-opacity duration-150'
          style={{
            top: mousePos.y + 15,
            left: mousePos.x + 15,
            opacity: 1,
            zIndex: 10
          }}
        >
          {description}
        </div>
      )}

      {isTouchDevice && touchVisible && description && (
        <div className="whitespace-pre-line mt-2 bg-gray-300 text-sm p-2 rouded shadow text-left w-64">
          {description}
        </div>
      )}
      {title && (
        <div className='mt-2 text-sm'>
          source: {' '}
          <a
            href={title}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 underline break-all'
          >
            {title}
          </a>
        </div>
      )}
    </div>
  );
};

export default Portrait;