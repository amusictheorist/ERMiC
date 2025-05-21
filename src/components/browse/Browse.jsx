import React from 'react';
import { Link } from "react-router-dom";
import { useData } from '../DataContext';
import '../../styles/Browse.css';

// this component renders the browse page, which lists all musicians that are entered into the databse
const Browse = () => {

  // fetches data from DataContext component
  const { data, loading, error } = useData();
  if (loading) return <p>Loading data...</p>
  if (error && !data) return <p>Failed to load data. Please Try again later.</p>

  // sort fetched data into alphabetical order
  const sortedMusicians = [...data.musicianCollection.items].sort((a, b) => {
    const surnameA = a.surname.toLowerCase();
    const surnameB = b.surname.toLowerCase();
    const firstNameA = a.firstName?.toLowerCase() || '';
    const firstNameB = b.firstName?.toLowerCase() || '';

    if (surnameA < surnameB) return -1;
    if (surnameA > surnameB) return 1;
    return firstNameA.localeCompare(firstNameB);
  });

  // rendering block, maps over fetched musicians and links to their musican page
  return (
    <div className="browse-page">
      <h2>Browse the Biographies</h2>
      {sortedMusicians.map((musician) => (
        <Link className="musician-link" key={musician.slug} to={`/musician/${musician.slug}`}>
          <p>{musician.firstName} {musician.surname}</p>
        </Link>
      ))}
    </div>
  );
};

export default Browse;
