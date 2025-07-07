import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useData } from '../DataContext';

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

  const extractBirthYear = (dateString) => {
    if (typeof dateString !== 'string') return null;
    const match = dateString.match(/\b(1[7-9]\d{2}|20\d{2})\b/);
    return match ? match[0] : null;
  };

  const sortedMusicians = [...musicians].sort((a, b) => {
    const getCountry = (place) =>
      place?.includes(',') ? place.split(',').pop().trim().toLowerCase() : '';

    if (sortOption === 'birthCountry') {
      return getCountry(a.birthPlace).localeCompare(getCountry(b.birthPlace));
    } else if (sortOption === 'deathCountry') {
      return getCountry(a.deathPlace).localeCompare(getCountry(b.deathPlace));
    } else if (sortOption === 'birthYear') {
      const yearA = parseInt(extractBirthYear(a.birthdate)) || Infinity;
      const yearB = parseInt(extractBirthYear(b.birthdate)) || Infinity;
      return yearA - yearB;
    } else {
      const surnameA = a.surname.toLowerCase();
      const surnameB = b.surname.toLowerCase();
      const firstNameA = a.firstName?.toLowerCase() || '';
      const firstNameB = b.firstName?.toLowerCase() || '';
      if (surnameA < surnameB) return -1;
      if (surnameA > surnameB) return 1;
      return firstNameA.localeCompare(firstNameB);
    }
  });

  const groupByCountry = (list, placeKey) => {
    const groups = {};
    list.forEach((musician) => {
      const rawPlace = musician[placeKey] || '';
      const country = rawPlace.includes(',') ? rawPlace.split(',').pop().trim() : null;
      const group = country || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(musician);
    });
    return groups;
  };

  const groupByBirthYear = (list) => {
    const groups = {};
    list.forEach((musician) => {
      const year = extractBirthYear(musician.birthdate) || 'Unknown';
      if (!groups[year]) groups[year] = [];
      groups[year].push(musician);
    });
    return groups;
  }

  const groupedByBirthYear = sortOption === 'birthYear' ? groupByBirthYear(sortedMusicians) : null;

  const groupedByBirthCountry = sortOption === 'birthCountry'
    ? groupByCountry(sortedMusicians, 'birthPlace')
    : null;

  const groupedByDeathCountry = sortOption === 'deathCountry'
    ? groupByCountry(sortedMusicians, 'deathPlace')
    : null;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className='font-serif text-2xl sm:text-3xl font-bold mb-6'>Browse the Biographies</h2>

      {error && (
        <p className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded px-4 py-2 mb-4">
          Some data may be missing: {error}
        </p>
      )}

      <div className='mb-6 text-left'>
        <label htmlFor="sort" className='mr-2 font-medium'>Sort by:</label>
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

      {sortOption === 'birthCountry' && groupedByBirthCountry ? (
        Object.entries(groupedByBirthCountry)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([country, musList]) => (
            <div key={country} className="mb-8">
              <h3 className='text-xl font-semibold mb-4 text-gray-800 text-left'>{country}</h3>
              <div className="grid gap-4">
                {musList.map((musician) => (
                  <Link
                    key={musician.slug}
                    to={`/musician/${musician.slug}`}
                    className='block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg'
                  >
                    <p className='font-serif text-lg md:text-base'>
                      {musician.firstName} {musician.surname}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
      ) : sortOption === 'deathCountry' && groupedByDeathCountry ? (
        Object.entries(groupedByDeathCountry)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([country, musList]) => (
            <div key={country} className="mb-8">
              <h3 className='text-xl font-semibold mb-4 text-gray-800 text-left'>{country}</h3>
              <div className="grid gap-4">
                {musList.map((musician) => (
                  <Link
                    key={musician.slug}
                    to={`/musician/${musician.slug}`}
                    className='block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg'
                  >
                    <p className='font-serif text-lg md:text-base'>
                      {musician.firstName} {musician.surname}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
      ) : sortOption === 'birthYear' && groupedByBirthYear ? (
        Object.entries(groupedByBirthYear)
          .sort(([a], [b]) =>
            a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : parseInt(a) - parseInt(b)
          )
          .map(([year, musList]) => (
            <div key={year} className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-800 text-left'>{year}</h3>
              <div className='grid gap-4'>
                {musList.map((musician) => (
                  <Link
                    key={musician.slug}
                    to={`/musician/${musician.slug}`}
                    className='block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg'
                  >
                    <p className='font-serif text-lg md:text-base'>
                      {musician.firstName} {musician.surname}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
      ) : (
        <div className='grid gap-4'>
          {sortedMusicians.map((musician) => (
            <Link
              key={musician.slug}
              to={`/musician/${musician.slug}`}
              className='block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg'
            >
              <p className='font-serif text-lg md:text-base'>
                {musician.firstName} {musician.surname}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;
