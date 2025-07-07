import React from "react";
import MusicianCard from "./MusicianCard";

const MusicianGroupList = ({ groups, label }) => (
  Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupKey, musList]) => (
      <div key={groupKey} className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 text-left">
          {groupKey}
        </h3>
        <div className="grid gap-4">
          {musList.map((musician) => (
            <MusicianCard key={musician.slug} musician={musician} />
          ))}
        </div>
      </div>
    ))
);

export default MusicianGroupList;