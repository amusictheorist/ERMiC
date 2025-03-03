import useCMSData from '../hooks/useCMSData';

const query = `
{
  musicianCollection {
    items {
      firstName
      surname
      birthdate
      deathdate
      biography {
        json
        }
        bibliography {
          json
          }
          }
          }
          }
          `;
          
const MusicianPage = (query) => {
  const { data, loading, error } = useCMSData(query);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.musicianCollection?.items?.length === 0 ? (
        <div>No musicians found matching the search term.</div>
      ) : (
        data.musicianCollection.items.map((musician) => (
          <div key={musician.firstName + musician.surname}>
            <h2>{musician.firstName} {musician.surname}</h2>
            <p><strong>Born:</strong> {musician.birthdate}</p>
            <p><strong>Deceased:</strong> {musician.deathdate || 'N/A'}</p>

            <h3>Biography</h3>
            <div>
              {/* Display biography, assuming it's a structured JSON object */}
              {/* You might need to process this JSON depending on the format */}
              <div dangerouslySetInnerHTML={{ __html: musician.biography.json }} />
            </div>

            <h3>Bibliography</h3>
            <div>
              {/* Similarly handle bibliography */}
              <div dangerouslySetInnerHTML={{ __html: musician.bibliography.json }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MusicianPage;
