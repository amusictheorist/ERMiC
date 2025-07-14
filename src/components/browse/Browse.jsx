import React, { useState } from 'react';
import { useData } from '../DataContext';
import { groupByBirthYear, groupByCountry, sortMusicians } from '../../utils/browseHelpers';
import MusicianGroupList from './MusicianGroupList';
import MusicianCard from './MusicianCard';

const Browse = () => {
  const { data, loading, error } = useData();
  const [sortOption, setSortOption] = useState('surname');

  if (loading) return <p className='text-center mt-8 text-lg'>Loading data...</p>;

  const musicians = data?.musicianCollection?.items || [];

  if (error && musicians.length === 0) {
    return <p className='text-center mt-8 text-lg text-red-600'>Failed to load data. Please try again later.</p>;
  }

  if (musicians.length === 0) {
    return <p className='text-center mt-8 text-lg text-gray-700'>No musicians found.</p>;
  }

  // this manages musician sorting and options
  const sortedMusicians = sortMusicians(musicians, sortOption);

  const grouped =
    sortOption === 'birthCountry'
      ? groupByCountry(sortedMusicians, 'birthPlace')
      : sortOption === 'deathCountry'
      ? groupByCountry(sortedMusicians, 'deathPlace')
      : sortOption === 'birthYear'
      ? groupByBirthYear(sortedMusicians)
      : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className='font-serif text-3xl sm:text-4xl font-bold mb-6'>Browse the Biographies</h2>

      {error && (
        <p className="text-base sm:text-lg text-yellow-800 bg-yellow-100 border border-yellow-300 rounded px-4 py-2 mb-4">
          Some data may be missing: {error}
        </p>
      )}

      <div className='mb-6 text-left text-base sm:text-lg'>
        <label htmlFor="sort" className='mr-2 font-medium'>
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className='px-3 py-1 border rounded'
        >
          <option value="surname">Surname (A-Z)</option>
          <option value="birthCountry">Country of Birth</option>
          <option value="deathCountry">Country of Death</option>
          <option value="birthYear">Birth Year (Oldest-Youngest)</option>
        </select>
      </div>
      
      {grouped ? (
        <MusicianGroupList
          groups={grouped}
          sortOption={sortOption}
        />
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
