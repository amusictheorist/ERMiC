import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
    <>
      <h2>Writings</h2>
      <div className="writings-list">
        {writings.map((writing, index) => (
          <div key={index} className="writing-item">
            <p>
              <strong>Title:</strong>
              {writing.type === 'Book' ? (
                <em> {writing.title}</em>
              ) : (
                <> {writing.title}</>
              )}
            </p>
            {writing.year && <p><strong>Year:</strong> {writing.year}</p>}
            {writing.type && <p><strong>Type:</strong> {writing.type}</p>}
            {writing.publicationInfo?.json && (
              <div>
                <p><strong>Publication Info:</strong></p>
                <div className="text-content">
                  {documentToReactComponents(writing.publicationInfo.json)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default WritingList;