import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
    <div className="writing-list">
      {writings.map((writing, i) => {
        return (
          <div key={i} className="mb-4">
            {documentToReactComponents(writing.publicationInfo.json)}
          </div>
        );
      })}
    </div>
  );
};

export default WritingList;
