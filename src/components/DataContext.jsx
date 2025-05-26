import React, { createContext, useContext, useState, useEffect } from "react";

// this is what provides data for all the app components
const DataContext = createContext();

// these are the secrets from Contentful CMS
const spaceID = process.env.REACT_APP_SPACE_ID;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

/* IMPORTANT: these GraphQL API queries fetch all the structured data from the CMS upon mounting the ERMiC website. Do not change anything about the queries or about the content types in the ERMiC Contentful space without corroborating changes between the two or the site will break. If changes need to be made, visit Contentful's GraphQL documentation here: https://www.contentful.com/developers/docs/references/graphql/. You'll need the spaceID and accessToken from the ERMiC site and authorization from the project managers to obtain them.
*/

// limit cannot exceed 100
// TO DO: put photograph fetch back in query
const musicianQuery = `
{
  musicianCollection(limit: 100) {
    items {
      slug
      firstName
      surname
      birthdate
      birthPlace
      deathdate
      deathPlace
      occupation
      biography {
        json
      }
      bibliography {
        json
      }
    }
  }
}
`;

const workQuery = `
{
  workCollection(limit: 1000) {
    items {
      musician {
        slug
      }
      title
      year
      type
      instrumentation
      publicationInfo {
        json
      }
    }
  }
}
`;

const writingQuery = `
{
  writingCollection(limit: 1000) {
    items {
      musician {
        slug
      }
      title
      year
      type
      publicationInfo {
        json
      }
    }
  }
}
`;

// the actual component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper function makes fetch calls to CMS
  useEffect(() => {
    const fetchSection = async (query, label) => {
      try {
        const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceID}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ query }),
        });

        const { data, errors } = await response.json();

        if (errors) {
          console.warn(`GraphQL Errors in ${label}:`, errors);
        }

        if (!data) {
          throw new Error(`No data received for ${label}`);
        }

        return data;
      } catch (err) {
        throw err;
      }
    };

    // this function combines the split collections into one array
    const fetchData = async () => {
      try {
        const [musicianData, workData, writingData] = await Promise.all([
          fetchSection(musicianQuery, 'musicians'),
          fetchSection(workQuery, 'works'),
          fetchSection(writingQuery, 'writings')
        ]);

        setData({
          musicianCollection: musicianData.musicianCollection,
          workCollection: workData.workCollection,
          writingCollection: writingData.writingCollection
        });
      } catch (err) {
        console.error('Data fetch failed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
