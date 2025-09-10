import React from "react";
import MusicianCard from './MusicianCard';

const MusicianGroupList = ({ groups }) => (
  Object.entries(groups).map(([groupKey, musList]) => (
    <div key={groupKey} className="mb-10">
      <h3 className="text-2xl font-semibold mb-5 text-gray-800 text-left">{groupKey}</h3>

      {groupKey === "In Canada" ? (
        Object.entries(musList)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([provKey, provMus]) => (
            <div key={provKey} className="mb-6 pl-6 border-l-2 border-gray-300">
              <h4 className="text-xl font-medium mb-3 text-gray-700 text-left">{provKey}</h4>
              <div className="grid gap-4">
                {provMus.map((musician) => (
                  <MusicianCard key={musician.slug} musician={musician} />
                ))}
              </div>
            </div>
          ))
      ) : (
        <div className="grid gap-4">
          {musList.map((musician) => (
            <MusicianCard key={musician.slug} musician={musician} />
          ))}
        </div>
      )}
    </div>
  ))
);

export default MusicianGroupList;
