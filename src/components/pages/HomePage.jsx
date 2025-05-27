import React from 'react';
import { useData } from '../DataContext';
import SearchBar from "../searchBar/SearchBar";

// landing page for the site, where main search functionality is implemented
const HomePage = ({
  searchTerm,
  setSearchTerm,
  showDropdown,
  setShowDropdown,
  selectedIndex,
  setSelectedIndex
}) => {
  const { data, loading, error } = useData();
  
  const counts = data ? {
    musicians: data.musicianCollection?.items?.length || 0,
    works: data.workCollection?.items?.length || 0,
    writings: data.writingCollection?.items?.length || 0
  } : { musicians: 0, works: 0, writings: 0 };

  return (
    <div className="w-full max-w-[90%] sm:max-w-3xl mx-auto px-4py6 mt-36 text-center">
      <h1 className='text-xl sm:text-2xl md:text-4xl font-bold leading-tight'>
        Welcome to the European Refugee Musicians in Canada Online Biographical Dictionary
      </h1>
      <p className='text-sm sm:text-base md:text-lg my-4 text-gray-700'>
        Search by name or keyword and select an entry.
      </p>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />

      {!loading && !error && (
        <div className='mt-6 text-sm sm:text-base text-gray-600 italic'>
          Database currently includes {counts.musicians} musicians, {counts.works} works, {counts.writings} writings, and continues growing!
        </div>
      )}
    </div>
  );
};

export default HomePage;
