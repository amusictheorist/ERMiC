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

  if (loading) return <p className="text-center mt-8 text-lg">Loading data...</p>;
  if (error && !data) return <p className="text-center mt-8 text-lg text-red-600">Failed to load data. Please try again later.</p>;
  if (!occupation) return <p className="text-center mt-8 text-lg text-gray-700">No occupation specified.</p>;

  // filters musicians for chosen occupation and sorts them in alphabetical order
  const filteredMusicians = data.musicianDetailsCollection.items
    .filter(musician => musician.occupation?.includes(occupation))
    .sort((a, b) => {
      const nameA = `${a.surname} ${a.firstName}`.toLowerCase();
      const nameB = `${b.surname} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  // actual render block
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h1 className='font-serif text-3xl sm:text-4xl font-bold mb-6'>
        Search results for: "{occupation}"
      </h1>

      {filteredMusicians.length === 0 ? (
        <p className='font-serif text-lg text-gray-700'>No musicians found for this occupation.</p>
      ) : (
        <ul className='grid gap-4 text-center'>
          {filteredMusicians.map(musician => (
            <li
              key={musician.slug}
              onClick={() => navigate(`/musician/${musician.slug}`)}
              className='font-serif text-xl sm:text-2xl cursor-pointer px-4 py-3 rounded bg-slate-100 border border-gray-300 transition hover:bg-blue-600 hover:text-white'
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
