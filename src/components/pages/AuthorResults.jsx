import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../DataContext";

const AuthorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useData();

  const searchParams = new URLSearchParams(location.search);
  const author = searchParams.get('author');

  if (loading) return <p className="text-center mt-8 text-lg">Loading data...</p>;
  if (error && !data) return <p className="text-center mt-8 text-lg text-red-600">Failed to load data. Please try again later.</p>;
  if (!author) return <p className="text-center mt-8 text-lg text-gray-700">No author specified.</p>;

  const filteredMusicians = data.musicianCollection
    .filter(musician => {
      const authors = musician.authorCollection?.items || [];
      return authors.some(a => {
        const fullName = `${a.names} ${a.surnames}`.trim().toLowerCase();
        return fullName === author.trim().toLowerCase();
      });
    })
    .sort((a, b) => {
      const nameA = `${a.surname} ${a.firstName}`.toLowerCase();
      const nameB = `${b.surname} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
      <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6">
        Biographies by {author}
      </h2>

      {filteredMusicians.length === 0 ? (
        <p className="font-serif text-lg text-gray-700">No biographies found for this author.</p>
      ) : (
        <ul className="grid gap-4 text-center">
          {filteredMusicians.map(musician => (
            <li
              key={musician.slug}
              onClick={() => navigate(`/musician/${musician.slug}`)}
              className="font-serif text-xl sm:text-2xl cursor-pointer px-4 py-3 rounded bg-slate-100 border border-gray-300 transition hover:bg-blue-600 hover:text-white"
            >
              {musician.firstName} {musician.surname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorResults;