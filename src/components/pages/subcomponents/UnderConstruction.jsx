import React from "react";

// this component is rendered when a musician's page does not have a biography
const UnderConstruction = () => {
  return (
    <div className="mt-8 text-center text-gray-600">
      <h2 className="text-3xl font-serif font-semibold mb-4">Page Under Construction</h2>
      <p className="text-xl font-serif">
        We're still working on this musician's biography. Please check back later!
      </p>
    </div>
  );
};

export default UnderConstruction;