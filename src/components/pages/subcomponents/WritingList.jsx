import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const WritingList = ({ writings }) => {
  if (!writings || writings.length === 0) return null;

  return (
    <div className="writing-list font-serif text-lg space-y-6">
      {writings.map((writing, i) => {
        const richTextJson = writing?.publicationInfo?.json;
        if (!richTextJson) return null;

        return (
          <div key={i} className="mb-6">
            {documentToReactComponents(richTextJson)}
          </div>
        );
      })}
    </div>
  );
};

export default WritingList;
