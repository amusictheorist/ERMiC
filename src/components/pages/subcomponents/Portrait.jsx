import React from 'react';

const Portrait = ({ url, alt }) => {
  if (!url) return null;

  return (
    <div className="flex justify-center m-8">
      <img src={url} alt={alt} className="max-w-full max-h-80 rounded-lg object-contain shadow-md" />
    </div>
  );
};

export default Portrait;