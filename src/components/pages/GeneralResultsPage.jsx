import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../DataContext";
import { enrichWithMusician, groupByMusician, match } from "../../utils/searchHelpers";
import GroupedResultsSection from "./subcomponents/GroupedResultsSection";

const GeneralResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useData();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('search')?.toLowerCase() || '';

  if (loading) return <p className="text-center mt-8 text-lg">Loading data...</p>;
  if (error && !data) return <p className="text-center mt-8 text-lg text-red-600">Failed to load data. Please try again later.</p>;

  const m = match(query);

  const musicianMap = Object.fromEntries(data.musicianCollection.items.map(m => [m.slug, m]));

  const matchedMusicians = data.musicianCollection.items.filter(mus => m(mus.firstName) || m(mus.surname));
  const matchedOccupations = [...new Set(data.musicianCollection.items.flatMap(mus => mus.occupation?.filter(o => m(o)) || []))];

  const enrichedWorks = enrichWithMusician(data.workCollection.items.filter(w => m(w.title)), musicianMap);
  const enrichedWritings = enrichWithMusician(data.writingCollection.items.filter(w => m(w.title)), musicianMap);
  const enrichedPerformances = enrichWithMusician(data.performanceAndMediaCollection.items.filter(p => m(p.title)), musicianMap);

  const groupedWorks = groupByMusician(enrichedWorks);
  const groupedWritings = groupByMusician(enrichedWritings);
  const groupedPerformances = groupByMusician(enrichedPerformances);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-left">
      <h1 className="font-serif text-xl sm:text-2xl font-semibold mb-6 text-center">
        Search results for: "{query}"
      </h1>

      {matchedMusicians.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-lg sm:text-xl font-semibold mb-3">Musicians</h2>
          <ul className="grid gap-2">
            {matchedMusicians.map(m => (
              <li
                key={m.slug}
                onClick={() => navigate(`/musician/${m.slug}`)}
                className="cursor-pointer px-3 py-2 text-gray-800 rounded transition hover:bg-gray-200 font-serif text-sm sm:text-base"
              >
                {m.firstName} {m.surname}
              </li>
            ))}
          </ul>
        </section>
      )}

      {matchedOccupations.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-lg sm:text-xl font-semibold mb-3">Occupations</h2>
          <ul className="grid gap-2">
            {matchedOccupations.map(o => (
              <li
                key={o}
                onClick={() => navigate(`/results/occupation?occupation=${o}`)}
                className="cursor-pointer px-3 py-2 text-gray-800 rounded transition hover:bg-gray-200 font-serif text-sm sm:text-base"
              >
                {o}
              </li>
            ))}
          </ul>
        </section>
      )}

      <GroupedResultsSection title='Works' groupedItems={groupedWorks} />
      <GroupedResultsSection title='Writings' groupedItems={groupedWritings} />
      <GroupedResultsSection title='Performances' groupedItems={groupedPerformances} />
    </div>
  );
};

export default GeneralResultsPage;