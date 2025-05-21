import React, { createContext, useContext, useState, useEffect } from "react";

// this is what provides data for all the app components
const DataContext = createContext();

// these are the secrets from Contentful CMS
const spaceID = process.env.REACT_APP_SPACE_ID;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

/* IMPORTANT: this GraphQL API query fetches all the structured data from the CMS upon mounting the ERMiC website. Do not change anything about this query or about the content types in the ERMiC Contentful space without corroborating changes between the two or the site will break. If changes need to be made, visit Contentful's GraphQL documentation here: https://www.contentful.com/developers/docs/references/graphql/. You'll need the spaceID and accessToken from the ERMiC site and authorization from the project managers to obtain them.
*/
const query = `
{
  musicianCollection {
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
      photosCollection {
        items {
          url
        }
      }
      bibliography {
        json
      }
    }
  }
  workCollection {
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
  writingCollection {
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

  // fetch call to CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceID}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ query }),
        });
      
        const { data, errors } = await response.json();
      
        if (errors) {
          console.warn('GraphQL Errors:', errors);
        }

        if (!data) {
          throw new Error('No data received from CMS.');
        }

        setData(data);
        console.log('data:', data);
      } catch (err) {
        console.error('Network error:', err);
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
