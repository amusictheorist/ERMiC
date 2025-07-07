import React from "react";
import { Link } from "react-router-dom";

const MusicianCard = ({ musician }) => (
  <Link
    to={`/musician/${musician.slug}`}
    className="block w-full px-4 py-3 bg-slate-100 text-gray-700 rounded transition hover:bg-blue-600 hover:text-white text-base sm:text-lg"
  >
    <p className="font-serif text-lg md:text-base">
      {musician.firstName} {musician.surname}
    </p>
  </Link>
);

export default MusicianCard;