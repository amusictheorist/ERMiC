import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import '../styles/SearchResults.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useData();

  // Extract the 'occupation' query parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const occupation = searchParams.get('occupation');

  // Handle loading and absence of data or occupation
  if (!occupation || !data) return <p>Loading...</p>;

  // Filter musicians based on the occupation
  const filteredMusicians = data.musicianCollection.items.filter(musician =>
    musician.occupation.includes(occupation)
  );

  return (
    <div className="search-results">
      <h1>Search results for: {occupation}</h1>
      {filteredMusicians.length === 0 ? (
        <p>No musicians found for this occupation.</p>
      ) : (
        <ul>
          {filteredMusicians.map(musician => (
            <li
              key={musician.slug}
              onClick={() => navigate(`/musician/${musician.slug}`)}
            >
              {musician.firstName} {musician.surname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
