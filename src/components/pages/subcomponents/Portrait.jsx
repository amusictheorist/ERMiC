const Portrait = ({ url, alt }) => {
  if (!url) return null;

  return (
    <div className="portrait-container">
      <img src={url} alt={alt} className="portrait-image" />
    </div>
  );
};

export default Portrait;