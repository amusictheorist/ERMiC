import React from 'react';
import { Link } from "react-router-dom";
import { useData } from '../DataContext';

const Browse = () => {
  const { data, loading, error } = useData();

  if (loading) return <p className='text-center mt-6 text-lg'>Loading data...</p>;

  const musicians = data?.musicianCollection?.items || [];

  if (error && musicians.length === 0) {
    return <p className='text-center mt-6 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;
  }

  if (musicians.length === 0) {
    return <p className='text-center mt-6 text-lg text-gray-700'>No musicians found.</p>;
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
    <div className="p-6 max-w-3xl m-auto text-center">
      <h2 className='text-3xl font-bold my-6'>Browse the Biographies</h2>
      {error && (
        <p className="text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded px-4 py-2 mb-4">
        Some data may be missing: {error}
      </p>
      )}
      {sortedMusicians.map((musician) => (
        <Link className="block px-4 py-2 bg-slate-100 text-gray-700 rounded mb-4 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white" key={musician.slug} to={`/musician/${musician.slug}`} >
        <p className="text-lg md:text-base">
          {musician.firstName} {musician.surname}
        </p>
      </Link>
      ))}
    </div>
  );
};

export default Browse;
