import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../DataContext";

// this component renders a page listing results from a search if no specific musician, writing, or work is selected. if an occupation is selected, the page will return a list of musicians in the CMS who performed that occupation
const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useData();

  const searchParams = new URLSearchParams(location.search);
  const occupation = searchParams.get('occupation');

  if (loading) return <p className='text-center mt-6 text-lg'>Loading data...</p>;
  if (error && !data) return <p className='text-center mt-6 text-lg text-red-600'>Failed to load data. Please Try again later.</p>;
  if (!occupation) return <p className='text-center mt-6 text-lg text-gray-700'>No occupation specified.</p>;

  // filters musicians for chosen occupation and sorts them in alphabetical order
  const filteredMusicians = data.musicianCollection.items
    .filter(musician => musician.occupation?.includes(occupation))
    .sort((a, b) => {
      const nameA = `${a.surname} ${a.firstName}`.toLowerCase();
      const nameB = `${b.surname} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  // actual render block
  return (
    <div className="p-6 max-w-3xl m-auto text-center">
      <h1 className='text-4xl font-bold mb-6 sm:text-3xl'>Search results for: {occupation}</h1>
      {filteredMusicians.length === 0 ? (
        <p className='my-4 text-lg text-gray-700'>No musicians found for this occupation.</p>
      ) : (
        <ul className='list-none p-0 m-0'>
          {filteredMusicians.map(musician => (
            <li
              key={musician.slug}
              onClick={() => navigate(`/musician/${musician.slug}`)}
              tabIndex={0}
              className='p-3 mb-4 bg-gray-100 border border-gray-300 rounded cursor-pointer transition-colors hover:bg-blue-600 hover:text-white focus:outline-none focus:bg-blue-600 focus:text-white active:bg-blue-800'
            >
              {musician.firstName} {musician.surname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
