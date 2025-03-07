import { useParams } from "react-router-dom";
import { useData } from "./DataContext";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import '../styles/MusicianPage.css';

const MusicianPage = () => {
  const { slug } = useParams();
  const data = useData();

  if (!data) return <p>Loading...</p>;

  const musician = data.musicianCollection.items.find((m) => m.slug === slug);
  if (!musician) return <p>Musician not found.</p>;

  const portraitUrl = musician.photosCollection?.items?.[0]?.url;

  // Filter works authored by this musician
  const works = data.workCollection?.items?.filter(
    (work) => work.musician?.slug === slug
  ) || [];

  // Filter writings authored by this musician
  const writings = data.writingCollection?.items?.filter(
    (writing) => writing.musician?.slug === slug
  ) || [];

  return (
    <div className="musician-page">
      <h1>{musician.firstName} {musician.surname}</h1>
      <p>Born: {musician.birthdate} in {musician.birthPlace}</p>
      <p>Died: {musician.deathdate} in {musician.deathPlace}</p>

      {portraitUrl && (
        <div className="portrait-container">
          <img 
            src={portraitUrl} 
            alt={`${musician.firstName} ${musician.surname}`} 
            className="portrait-image" 
          />
        </div>
      )}

      <h2>Biography</h2>
      <div className="text-content">
        {musician.biography?.json && documentToReactComponents(musician.biography.json)}
      </div>

      {/* Works Section */}
      {works.length > 0 && (
        <>
          <h2>Works</h2>
          <div className="works-list">
            {works.map((work, index) => (
              <div key={index} className="work-item">
                <p><strong>Title:</strong> <em>{work.title}</em></p>
                {work.year && <p><strong>Year:</strong> {work.year}</p>}
                {work.type && <p><strong>Type:</strong> {work.type}</p>}
                {work.instrumentation?.length > 0 && (
                  <p><strong>Instrumentation:</strong> {work.instrumentation.join(', ')}</p>
                )}
                {work.publicationInfo && (
                  <p><strong>Publication Info:</strong> {work.publicationInfo}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Writings Section */}
      {writings.length > 0 && (
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
                    <strong>Publication Info:</strong>
                    <div className="text-content">
                      {documentToReactComponents(writing.publicationInfo.json)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <h2>Bibliography</h2>
      <div className="text-content">
        {musician.bibliography?.json && documentToReactComponents(musician.bibliography.json)}
      </div>
    </div>
  );
};

export default MusicianPage;
