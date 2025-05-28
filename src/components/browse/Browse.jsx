import React from 'react';
import { Link } from "react-router-dom";
import { useData } from '../DataContext';

const Browse = () => {
  const { data, loading, error } = useData();

  if (loading) return <p className='text-center mt-8 text-lg'>Loading data...</p>;

  const musicians = data?.musicianCollection?.items || [];

  if (error && musicians.length === 0) {
    return <p className='text-center mt-8 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;
  }

  if (musicians.length === 0) {
    return <p className='text-center mt-8 text-lg text-gray-700'>No musicians found.</p>;
  }

  const sortedMusicians = [...musicians].sort((a, b) => {
    const surnameA = a.surname.toLowerCase();
    const surnameB = b.surname.toLowerCase();
    const firstNameA = a.firstName?.toLowerCase() || '';
    const firstNameB = b.firstName?.toLowerCase() || '';

    if (surnameA < surnameB) return -1;
    if (surnameA > surnameB) return 1;
    return firstNameA.localeCompare(firstNameB);
  });

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className='font-serif text-2xl sm:text-3xl font-bold mb-6'>Browse the Biographies</h2>

      {error && (
        <p className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded px-4 py-2 mb-4">
        Some data may be missing: {error}
      </p>
      )}

      <div className='grid gap-4'>
        {sortedMusicians.map((musician) => (
          <Link
            key={musician.slug}
            to={`/musician/${musician.slug}`}
            className="block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg"
          >
            <p className="font-serif text-lg md:text-base">
              {musician.firstName} {musician.surname}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Browse;
