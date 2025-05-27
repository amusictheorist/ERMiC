import React from 'react';

const Portrait = ({ url, alt }) => {
  if (!url) return null;

  return (
    <div className="flex justify-center m-8">
      <img
        src={url}
        alt={alt || 'Portrait'}
        className="-w-full max-w-xs sm:max-w-sm md:max-w-md max-h-80 rounded-lg object-contain shadow-md"
        loading='lazy'
      />
    </div>
  );
};

export default Portrait;