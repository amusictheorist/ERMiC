import React, { useState } from 'react';
import { useData } from '../DataContext';
import { groupByBirthYear, groupByBirthCountry, sortMusicians, groupByDeathCountry, splitCanadianGroups } from '../../utils/browseHelpers';
import MusicianGroupList from './MusicianGroupList';
import MusicianCard from './MusicianCard';
import SortDropdown from './SortDropdown';

const Browse = () => {
  const { data, loading, error } = useData();
  const [sortOption, setSortOption] = useState('surname');

  if (loading) return <p className='text-center mt-8 text-lg'>Loading data...</p>;

  const musicians = data?.musicianCollection || [];
  if (error && musicians.length === 0) return <p className='text-center mt-8 text-lg text-red-600'>Failed to load data.</p>;
  if (musicians.length === 0) return <p className='text-center mt-8 text-lg text-gray-700'>No musicians found.</p>;

  const sortedMusicians = sortMusicians(musicians, sortOption);

  let grouped =
    sortOption === 'birthCountry'
      ? groupByBirthCountry(sortedMusicians)
      : sortOption === 'deathCountry'
      ? groupByDeathCountry(sortedMusicians)
      : sortOption === 'birthYear'
      ? groupByBirthYear(sortedMusicians)
      : null;

  let finalGroups = grouped;

  if (sortOption === 'deathCountry' && grouped) {
    const { inCanada, others } = splitCanadianGroups(grouped);
    finalGroups = {};

    if (Object.keys(inCanada).length > 0) {
      finalGroups['In Canada'] = inCanada;
    }

    Object.entries(others)
      .filter(([key]) => key !== 'Still Living')
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        finalGroups[key] = value;
      });

    if (grouped['Still Living']) {
      finalGroups['Still Living'] = grouped['Still Living'];
    }
  }

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className='font-serif text-3xl sm:text-4xl font-bold mb-6'>Browse the Biographies</h2>

      <div className='mb-6 text-left text-base sm:text-lg'>
        <label htmlFor="sort" className='mr-2 font-medium'>Sort by:</label>
        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
      </div>

      {finalGroups ? (
        <MusicianGroupList groups={finalGroups} />
      ) : (
        <div className='grid gap-4'>
          {sortedMusicians.map((musician) => (
            <MusicianCard key={musician.slug} musician={musician} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
