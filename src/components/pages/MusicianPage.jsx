import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useData } from "../DataContext";
import Portrait from "./subcomponents/Portrait";
import WorkList from "./subcomponents/WorkList";
import WritingList from "./subcomponents/WritingList";
import RichTextRenderer from "./subcomponents/RichTextRenderer";
import CollapsibleSection from './subcomponents/Collapsible';

// this component handles and renders a template musican page for every musician in the CMS
const MusicianPage = () => {
  // slug is the main musician identifier
  const { slug } = useParams();
  // fetching data from DataContext
  const { data, loading, error } = useData();

  const [showWorks, setShowWorks] = useState(false);
  const [showWritings, setShowWritings] = useState(false);
  const [showBibliography, setShowBibliography] = useState(false);

  if (loading) return <p className='text-center mt-6 text-lg'>Loading data...</p>;
  if (error && !data) return <p className='text-center mt-6 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;

  // if a url is broken or or a musician is not yet in the CMS, not found message will be rendered
  const musician = data.musicianCollection.items.find(
    (m) => m.slug?.trim() === slug?.trim()
  );
  if (!musician) return <p className='text-center mt-6 text-lg text-gray-700'>Musician not found.</p>;

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
    <div className="p-6 max-w-3xl m-auto text-center">
      <h1 className='text-4xl font-bold my-4'>{musician.firstName} {musician.surname}</h1>
      <p className='my-2 text-lg text-gray-700'>Born: {musician.birthdate} in {musician.birthPlace}</p>
      <p className='my-2 text-lg text-gray-700'>Died: {musician.deathdate} in {musician.deathPlace}</p>
      <Portrait
        url={portraitUrl}
        alt={`${musician.firstName} ${musician.surname}`}
      />
      <h2 className='text-3xl font-semibold my-8'>Biography</h2>
      <RichTextRenderer document={musician.biography?.json} />

      {works.length > 0 && (
        <CollapsibleSection
          title='Works'
          isOpen={showWorks}
          setIsOpen={setShowWorks}
        >
          <WorkList works={works} />
        </CollapsibleSection>
      )}
      
      {writings.length > 0 && (
        <CollapsibleSection
          title='Writings'
          isOpen={showWritings}
          setIsOpen={setShowWritings}
        >
          <WritingList writings={writings} />
        </CollapsibleSection>
      )}      
      
      <CollapsibleSection
        title='Bibliography'
        isOpen={showBibliography}
        setIsOpen={setShowBibliography}
      >
        <RichTextRenderer document={musician.bibliography?.json} />
      </CollapsibleSection>
    </div>
  );
};

export default MusicianPage;