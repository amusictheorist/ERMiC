import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "./DataContext";
import '../styles/SearchResults.css';

// this component renders a page listing results from a search if no specific musician, writing, or work is selected. if an occupation is selected, the page will return a list of musicians in the CMS who performed that occupation
const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useData();

  const searchParams = new URLSearchParams(location.search);
  const occupation = searchParams.get('occupation');

  if (!data) return <p>Loading...</p>;
  if (!occupation) return <p>No occupation specified.</p>;

  // filters musicians for chosen occupation and sorts them in alphabetical order
  const filteredMusicians = data.musicianCollection.items
    .filter(musician => musician.occupation?.includes(occupation))
    .sort((a, b) => {
      const nameA = `${a.surname} ${a.firstName}`.toLowerCase();
      const nameB = `${b.surname} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  // actual render block
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
