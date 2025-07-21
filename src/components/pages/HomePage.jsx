import React from 'react';
import { useData } from '../DataContext';
import { sortMusicians } from '../../utils/browseHelpers';
import SearchBar from "../searchBar/SearchBar";
import { Link, useOutletContext } from 'react-router-dom';

// landing page for the site, where main search functionality is implemented
const HomePage = () => {
  const {
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    selectedIndex,
    setSelectedIndex
  } = useOutletContext();

  const { data, loading, error } = useData();

  // counts update on the front page the status of the database
  const counts = data ? {
    musicians: data.musicianCollection?.length || 0,
    works: data.workCollection?.length || 0,
    writings: data.writingCollection?.length || 0,
    performances: data.performanceAndMediaCollection?.length || 0
  } : { musicians: 0, works: 0, writings: 0, performances: 0 };

  // sorting musicians into alphabetical order to show browse preview
  const sortedMusicians = data?.musicianCollection
    ? sortMusicians(data.musicianCollection, 'surname')
    : [];

  return (
    <div className="w-full max-w-[90%] sm:max-w-3xl mx-auto px-4 py-6 mt-20 text-center">
      <h1 className='font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight'>
        Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary
      </h1>
      <p className='font-serif text-base sm:text-lg md:text-xl my-4 text-gray-700'>
        Search by name or keyword.
      </p>

      {/* main search functionality */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {/* browse preview window */}
      <div>
        <p className='font-serif text-base sm:text-lg md:text-xl mt-10 mb-2 text-gray-700'>
          Or browse the entries below:
        </p>
        <div className='mt-2 mx-auto max-h-56 max-w-xs overflow-y-auto rounded p-4 shadow-sm bg-white'>
          <ul className='space-y-1 text-center'>
            {sortedMusicians.map(m => (
              <li key={m.slug}>
                <Link
                  to={`/musician/${m.slug}`}
                  className='text-blue-700 hover:underline'
                >
                  {m.firstName} {m.surname}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* updated counts from CMS */}
      {!loading && !error && (
        <div className='font-sans mt-6 text-base sm:text-lg text-gray-600 italic'>
          Database currently includes {counts.musicians} musicians, {counts.works} works, {counts.writings} writings, {counts.performances} performance and media works, and continues to grow!
        </div>
      )}
    </div>
  );
};

export default HomePage;