import React from 'react';
import { useParams } from "react-router-dom";
import { useData } from "../DataContext";
import '../../styles/MusicianPage.css';
import Portrait from "./subcomponents/Portrait";
import WorkList from "./subcomponents/WorkList";
import WritingList from "./subcomponents/WritingList";
import RichTextRenderer from "./subcomponents/RichTextRenderer";

// this component handles and renders a template musican page for every musician in the CMS
const MusicianPage = () => {
  // slug is the main musician identifier
  const { slug } = useParams();
  // fetching data from DataContext
  const data = useData();

  if (!data) return <p>Loading...</p>;

  // if a url is broken or or a musician is not yet in the CMS, not found message will be rendered
  const musician = data.musicianCollection.items.find((m) => m.slug === slug);
  if (!musician) return <p>Musician not found.</p>;

  // renders a portrait from CMS if available
  const portraitUrl = musician.photosCollection?.items?.[0]?.url;

  // renders list of works (compositions) from CMS if available
  const works = data.workCollection?.items?.filter(
    (work) => work.musician?.slug === slug
  ) || [];

  // renders list of writings from CMS if available
  const writings = data.writingCollection?.items?.filter(
    (writing) => writing.musician?.slug === slug
  ) || [];

  // actual rendering block
  return (
    <div className="musician-page">
      <h1>{musician.firstName} {musician.surname}</h1>
      <p>Born: {musician.birthdate} in {musician.birthPlace}</p>
      <p>Died: {musician.deathdate} in {musician.deathPlace}</p>
      <Portrait
        url={portraitUrl}
        alt={`${musician.firstName} ${musician.surname}`}
      />
      <h2>Biography</h2>
      <RichTextRenderer document={musician.biography?.json} />
      <WorkList works={works} />
      <WritingList writings={writings} />
      <h2>Bibliography</h2>
      <RichTextRenderer document={musician.bibliography?.json} />
    </div>
  );
};

export default MusicianPage;
