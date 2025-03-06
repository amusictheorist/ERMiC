import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

const spaceID = process.env.REACT_APP_SPACE_ID;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
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

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceID}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((response) => response.json())
      .then(({ data, errors }) => {
        if (errors) {
          console.error(errors);
        }
        setData(data);
      });
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
