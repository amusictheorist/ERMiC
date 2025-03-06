import { Link } from "react-router-dom";
import { useData } from "./DataContext";
import '../styles/Browse.css';

const Browse = () => {
  const data = useData();

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Musicians</h2>
      {data.musicianCollection.items.map((musician) => (
        <Link key={musician.slug} to={`/musician/${musician.slug}`}>
          <p>{musician.firstName} {musician.surname}</p>
        </Link>
      ))}
    </div>
  );
};

export default Browse;
