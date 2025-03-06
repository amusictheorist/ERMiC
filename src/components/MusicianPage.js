import { useParams } from "react-router-dom";
import { useData } from "./DataContext";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import '../styles/MusicianPage.css'

const MusicianPage = () => {
  const { slug } = useParams();
  const data = useData();

  if (!data) return <p>Loading...</p>;

  const musician = data.musicianCollection.items.find((m) => m.slug === slug);

  if (!musician) return <p>Musician not found.</p>;

  return (
    <div>
      <h1>{musician.firstName} {musician.surname}</h1>
      <p>Born: {musician.birthdate} in {musician.birthPlace}</p>
      <p>Died: {musician.deathdate} in {musician.deathPlace}</p>
      
      <h2>Biography</h2>
      {musician.biography?.json && documentToReactComponents(musician.biography.json)}

      <h2>Bibliography</h2>
      {musician.bibliography?.json && documentToReactComponents(musician.bibliography.json)}
    </div>
  );
};

export default MusicianPage;
