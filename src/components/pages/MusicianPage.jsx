import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useData } from "../DataContext";
import { Link } from 'react-router-dom';
import { sortMusicians } from '../../utils/browseHelpers';
import Portrait from "./subcomponents/Portrait";
import WorkList from "./subcomponents/WorkList";
import WritingList from "./subcomponents/WritingList";
import RichTextRenderer from "./subcomponents/RichTextRenderer";
import CollapsibleSection from './subcomponents/Collapsible';
import UnderConstruction from './subcomponents/UnderConstruction';
import PerformanceList from './subcomponents/PerformanceList';
import { formatAuthorList } from '../../utils/renderHelpers';

// this component handles and renders a template musican page for every musician in the CMS
const MusicianPage = () => {
  // slug is the main musician identifier
  const { slug } = useParams();
  // fetching data from DataContext
  const { data, loading, error } = useData();

  // gathering all musicians and sorting into alphabetical order to create navigation links
  const allMusicians = data?.musicianDetailsCollection?.items || [];
  const sortedMusicians = sortMusicians(allMusicians, 'surname');
  const currentIndex = sortedMusicians.findIndex(m => m.slug === slug);

  // these are used to create the navigation links
  const prevMusician = currentIndex > 0 ? sortedMusicians[currentIndex - 1] : null;
  const nextMusician = currentIndex < sortedMusicians.length - 1 ? sortedMusicians[currentIndex + 1] : null;

  const [showWorks, setShowWorks] = useState(false);
  const [showWritings, setShowWritings] = useState(false);
  const [showPerformances, setShowPerformances] = useState(false);
  const [showBibliography, setShowBibliography] = useState(false);

  if (loading) return <p className='text-center mt-8 text-lg'>Loading data...</p>;
  if (error && !data) return <p className='text-center mt-8 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;

  // if a url is broken or or a musician is not yet in the CMS, not found message will be rendered
  const musician = data.musicianDetailsCollection.items.find(
    (m) => m.slug?.trim() === slug?.trim()
  );
  if (!musician) return <p className='text-center mt-8 text-lg text-gray-700'>Musician not found.</p>;

  const musicianInfo = data.musicianInfoCollection.items.find(
    (m) => m.slug?.trim() === slug?.trim()
  );
  if (!musicianInfo) return <p className='text-center mt-8 text-lg text-gray-700'>Musician not found</p>

  const authorNames = musicianInfo?.authorCollection?.items?.map((author) =>
    [author.names, author.surnames].filter(Boolean).join(' ')
  ).filter(Boolean);

  // these fetch and render a musician's portrait if available
  const photoEntry = data.photosCollection?.items.find(
    (item) => item.slug?.trim() === slug?.trim()
  );
  const portraitUrl = photoEntry?.photosCollection?.items?.[0]?.url;
  const portraitDescription = photoEntry?.photosCollection?.items?.[0]?.description;

  // this gathers all the cross references to other musician entries to create inner reference links
  const crossRefEntry = data.crossReferencesCollection?.items.find(
    (item) => item.slug?.trim() === slug?.trim()
  );

  // renders list of works (compositions) from CMS if available
  const works = data.workCollection?.items?.filter(
    (work) => work.musician?.slug === slug
  ) || [];

  // renders list of writings from CMS if available
  const writings = data.writingCollection?.items?.filter(
    (writing) => writing.musician?.slug === slug
  ) || [];

  //renders list of performances and media works from CMS if available
  const performances = data.performanceAndMediaCollection?.items?.filter(
    (performance) => performance.musician?.slug === slug
  ) || [];

  // actual rendering block
  return (
    // musician heading
    <div className="px-4 py-10 sm:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto text-center">
      <h1 className='font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6'>
        {musician.firstName} {musician.surname}
      </h1>

      {/* general details */}
      {(musician.birthdate || musician.birthPlace) && (
        <p className='font-serif text-base sm:text-lg md:text-xl text-gray-700 mb-1'>
          Born:
          {musician.birthdate && ` ${musician.birthdate}`}
          {musician.birthdate && musician.birthPlace && ' in'}
          {musician.birthPlace && ` ${musician.birthPlace}`}
        </p>
      )}

      {(musician.deathdate || musician.deathPlace) && (
        <p className='font-serif text-base sm:text-lg md:text-xl text-gray-700 mb-1'>
          Died:
          {musician.deathdate && ` ${musician.deathdate}`}
          {musician.deathdate && musician.deathPlace && ' in'}
          {musician.deathPlace && ` ${musician.deathPlace}`}
        </p>
      )}

      {musician.occupation?.length > 0 && (
        <p className='font-serif text-base sm:text-lg md:text-xl text-gray-700 mb-8'>
          Occupations:
          {' '}{musician.occupation.join(', ')}
        </p>
      )}

      {/* portrait if available */}
      <Portrait
        url={portraitUrl}
        alt={`${musician.firstName} ${musician.surname}`}
        description={portraitDescription}
      />

      {/* biography if available */}
      {musicianInfo.biography?.json ? (
        <>
          <h2 className='font-serif text-2xl sm:text-3xl font-semibold my-8'>Biography</h2>
          <RichTextRenderer
            document={musicianInfo.biography.json}
            crossReferences={crossRefEntry?.crossReferencesCollection?.items || []}
            footer={
              authorNames.length > 0 && (
                <p className='font-serif mt-4 italic text-right text-gray-600 text-lg sm:text-xl'>
                  - {formatAuthorList(authorNames)}
                </p>
              )
            }
          />
        </>
      ) : (
          // if a musician does not yet have a biography, "under construction" page is rendered
        <UnderConstruction />
      )}

      {/* lists a musician's works if available */}
      {works.length > 0 && (
        <CollapsibleSection
          title='Works'
          isOpen={showWorks}
          setIsOpen={setShowWorks}
        >
          <WorkList works={works} />
        </CollapsibleSection>
      )}
      
      {/* lists a musician's writings if available */}
      {writings.length > 0 && (
        <CollapsibleSection
          title='Writings'
          isOpen={showWritings}
          setIsOpen={setShowWritings}
        >
          <WritingList writings={writings} />
        </CollapsibleSection>
      )}

      {/* lists a musician's performance and media works if available */}
      {performances.length > 0 && (
        <CollapsibleSection
          title='Performances and Media'
          isOpen={showPerformances}
          setIsOpen={setShowPerformances}
        >
          <PerformanceList performances={performances} />
        </CollapsibleSection>
      )}
      
      {/* lists a bibliography if available */}
      {musicianInfo.bibliography?.json && (
        <CollapsibleSection
          title='Bibliography'
          isOpen={showBibliography}
          setIsOpen={setShowBibliography}
        >
          <RichTextRenderer document={musicianInfo.bibliography?.json} />
        </CollapsibleSection>
      )}

      {/* navigation links */}
      <div className='flex justify-between items-center mt-12'>
        {prevMusician ? (
          <Link
            to={`/musician/${prevMusician.slug}`}
            className='text-blue-600 hover:underline text-left'
          >
            ← {prevMusician.firstName} {prevMusician.surname}
          </Link>
        ) : <div />}

        {nextMusician ? (
          <Link
            to={`/musician/${nextMusician.slug}`}
            className='text-blue-600 hover:underline text-right'
          >
            {nextMusician.firstName} {nextMusician.surname} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default MusicianPage;