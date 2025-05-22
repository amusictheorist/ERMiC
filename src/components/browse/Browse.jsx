import React from 'react';
import { Link } from "react-router-dom";
import { useData } from '../DataContext';
import '../../styles/Browse.css';

const Browse = () => {
  const { data, loading, error } = useData();

  if (loading) return <p>Loading data...</p>;

  const musicians = data?.musicianCollection?.items || [];

  if (error && musicians.length === 0) {
    return <p>Failed to load data. Please Try again later.</p>;
  }

  if (musicians.length === 0) {
    return <p>No musicians found.</p>;
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
    <div className="browse-page">
      <h2>Browse the Biographies</h2>
      {error && (
        <p className="non-blocking-error">Some data may be missing: {error}</p>
      )}
      {sortedMusicians.map((musician) => (
        <Link className="musician-link" key={musician.slug} to={`/musician/${musician.slug}`}>
          <p>{musician.firstName} {musician.surname}</p>
        </Link>
      ))}
    </div>
  );
};

export default Browse;
