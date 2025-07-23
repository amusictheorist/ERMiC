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
  const performanceTitle = searchParams.get('performance');

  if (loading) return <p className="text-center mt-8 text-lg">Loading data...</p>;
  if (error && !data) return <p className="text-center mt-8 text-lg text-red-600">Failed to load data. Please try again later.</p>;
  if (!occupation && !performanceTitle) return <p className="text-center mt-8 text-lg text-gray-700">No search parameters provided.</p>;

  
  // filters musicians for chosen occupation and sorts them in alphabetical order
  let filteredMusicians = [];
  
  if (occupation) {
    filteredMusicians = data.musicianCollection
      .filter(musician => musician.occupation?.includes(occupation)).sort((a, b) => {
        const nameA = `${a.surname} ${a.firstname}`.toLowerCase();
        const nameB = `${b.surname} ${b.firstname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }

  if (performanceTitle) {
    const performanceItem = data.performanceAndMediaCollection.find(
      p => p.title === performanceTitle
    );
    const slugs = performanceItem?.musiciansCollection?.items?.map(m => m.slug) || [];

    filteredMusicians = data.musicianCollection.filter(m =>
      slugs.includes(m.slug)
    );
  }
    
  // actual render block
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className='font-serif text-3xl sm:text-4xl font-bold mb-6'>
        {occupation
          ? `Search results for: "${occupation}"`
          : `Performers for: "${performanceTitle}"`}
      </h2>

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
