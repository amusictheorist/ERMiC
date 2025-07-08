import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useData } from "../DataContext";
import Portrait from "./subcomponents/Portrait";
import WorkList from "./subcomponents/WorkList";
import WritingList from "./subcomponents/WritingList";
import RichTextRenderer from "./subcomponents/RichTextRenderer";
import CollapsibleSection from './subcomponents/Collapsible';
import UnderConstruction from './subcomponents/UnderConstruction';

// this component handles and renders a template musican page for every musician in the CMS
const MusicianPage = () => {
  // slug is the main musician identifier
  const { slug } = useParams();
  // fetching data from DataContext
  const { data, loading, error } = useData();

  const [showWorks, setShowWorks] = useState(false);
  const [showWritings, setShowWritings] = useState(false);
  const [showBibliography, setShowBibliography] = useState(false);

  if (loading) return <p className='text-center mt-8 text-lg'>Loading data...</p>;
  if (error && !data) return <p className='text-center mt-8 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;

  // if a url is broken or or a musician is not yet in the CMS, not found message will be rendered
  const musician = data.musicianCollection.items.find(
    (m) => m.slug?.trim() === slug?.trim()
  );
  if (!musician) return <p className='text-center mt-8 text-lg text-gray-700'>Musician not found.</p>;

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
    <div className="px-4 py-10 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto text-center">
      <h1 className='font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6'>
        {musician.firstName} {musician.surname}
      </h1>

      {(musician.birthdate || musician.birthPlace) && (
        <p className='font-serif text-base sm:text-lg md:text-xl text-gray-700 mb-1'>
          Born:
          {musician.birthdate && ` ${musician.birthdate}`}
          {musician.birthdate && musician.birthPlace && ' in'}
          {musician.birthPlace && ` ${musician.birthPlace}`}
        </p>
      )}

      {(musician.deathdate || musician.deathPlace) && (
        <p className='font-serif text-base sm:text-lg md:text-xl text-gray-700 mb-8'>
          Died:
          {musician.deathdate && ` ${musician.deathdate}`}
          {musician.deathdate && musician.deathPlace && ' in'}
          {musician.deathPlace && ` ${musician.deathPlace}`}
        </p>
      )}
      
      <Portrait
        url={portraitUrl}
        alt={`${musician.firstName} ${musician.surname}`}
      />

      {musician.biography?.json ? (
        <>
          <h2 className='font-serif text-2xl sm:text-3xl font-semibold my-10'>Biography</h2>
          <RichTextRenderer
            document={musician.biography.json}
            crossReferences={musician.crossReferencesCollection?.items || []}
            footer={
              musician.author && (
                <p className='font-serif mt-4 italic text-right text-gray-600 text-lg sm:text-xl'>
                  - {musician.author}
                </p>
              )
            }
          />
        </>
      ) : (
        <UnderConstruction />
      )}

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
      
      {musician.bibliography?.json && (
        <CollapsibleSection
          title='Bibliography'
          isOpen={showBibliography}
          setIsOpen={setShowBibliography}
        >
          <RichTextRenderer document={musician.bibliography?.json} />
        </CollapsibleSection>
      )}
    </div>
  );
};

export default MusicianPage;