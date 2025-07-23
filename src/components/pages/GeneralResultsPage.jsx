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
  const queryRaw = searchParams.get('search') || '';
  const query = queryRaw.trim().toLowerCase();

  if (!query) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-10">
          Please enter a search term to seee results.
        </h1>
      </div>
    );
  }

  if (loading) return <p className="text-center mt-8 text-lg">Loading data...</p>;
  if (error && !data) return <p className="text-center mt-8 text-lg text-red-600">Failed to load data. Please try again later.</p>;

  const m = match(query);

  const musicianMap = Object.fromEntries(data.musicianCollection.map(m => [m.slug, m]));

  const matchedMusicians = data.musicianCollection.filter(mus => m(mus.firstName) || m(mus.surname));
  const matchedOccupations = [...new Set(data.musicianCollection.flatMap(mus => mus.occupation?.filter(o => m(o)) || []))];

  const enrichedWorks = enrichWithMusician(data.workCollection.filter(w => m(w.title)), musicianMap);
  const enrichedWritings = enrichWithMusician(data.writingCollection.filter(w => m(w.title)), musicianMap);
  const enrichedPerformances = enrichWithMusician(data.performanceAndMediaCollection.filter(p => m(p.title)), musicianMap);

  const groupedWorks = groupByMusician(enrichedWorks);
  const groupedWritings = groupByMusician(enrichedWritings);
  const groupedPerformances = groupByMusician(enrichedPerformances);

  const hasMatches =
    matchedMusicians.length > 0 ||
    matchedOccupations.length > 0 ||
    enrichedWorks.length > 0 ||
    enrichedWritings.length > 0 ||
    enrichedPerformances.length > 0;

  const shouldItalicizeItem = (title, item) => {
    if (title === 'Works' || title === 'Performances and Media') {
      return true;
    }
    if (title === 'Writings') {
      return item.type === 'Book';
    }
    return false;
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 max-w-5xl mx-auto text-left">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-10 text-center underline underline-offset-4 decoration-2">
        Search results for: "{query}"
      </h1>

      {!hasMatches ? (
        <p className="text-center text-gray-500 mt-8">No results found</p>
      ) : (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {matchedMusicians.length > 0 && (
            <>
              <section className="mb-6">
                <h2 className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm font-serif text-2xl sm:text-3xl font-semibold py-2 px-2 border-b border-gray-200">
                  Musicians
                </h2>
                <ul className="grid gap-3 mt-3">
                  {matchedMusicians.map(m => (
                    <li
                      key={m.slug}
                      onClick={() => navigate(`/musician/${m.slug}`)}
                      className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg transition hover:bg-gray-200 font-serif text-lg sm:text-xl shadow-sm"
                    >
                      {m.firstName} {m.surname}
                    </li>
                  ))}
                </ul>
              </section>
              <hr className="my-6 border-gray-300" />
            </>
          )}

          {matchedOccupations.length > 0 && (
            <>
              <section className="mb-6">
                <h2 className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm font-serif text-2xl sm:text-3xl font-semibold py-2 px-2 border-b border-gray-200">
                  Occupations
                </h2>
                <ul className="grid gap-3 mt-3">
                  {matchedOccupations.map(o => (
                    <li
                      key={o}
                      onClick={() => navigate(`/results/occupation?occupation=${o}`)}
                      className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg transition hover:bg-gray-200 font-serif text-lg sm:text-xl shadow-sm"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </section>
              <hr className="my-6 border-gray-300" />
            </>
          )}

          <GroupedResultsSection
            title='Works'
            groupedItems={groupedWorks}
            shouldItalicizeItem={(item) => shouldItalicizeItem('Works', item)}
          />
          <GroupedResultsSection
            title='Writings'
            groupedItems={groupedWritings}
            shouldItalicizeItem={(item) => shouldItalicizeItem('Writings', item)}
          />
          <GroupedResultsSection
            title='Performances and Media'
            groupedItems={groupedPerformances}
            shouldItalicizeItem={(item) => shouldItalicizeItem('Performances and Media', item)}
          />
        </div>
      )}
    </div>
  );
};

export default GeneralResultsPage;