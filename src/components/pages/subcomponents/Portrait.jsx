import React from 'react';

const Portrait = ({ url, alt, description }) => {
  if (!url) return null;

  return (
    <div className="flex flex-col items-center m-8 group">
      <img
        src={url}
        alt={alt || 'Portrait'}
        className="-w-full max-w-xs sm:max-w-sm md:max-w-md max-h-80 rounded-lg object-contain shadow-md"
        loading="lazy"
      />

      {description && (
        <div className="mt-2 bg-gray-200 text-gray-900 text-sm p-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity w-64 text-center">
          {description}
        </div>
      )}

    </div>
  );
};

export default Portrait;
