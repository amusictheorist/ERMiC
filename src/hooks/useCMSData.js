import { useState, useEffect } from 'react';

const useCMSData = (query) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fetch('https://graphql.contentful.com/content/v1/spaces/lsaglqw7atjk/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer JEUyOw04eq02knEmUeHpfao4_TMxCcB_48C6Pk91a7E',
          },
          body: JSON.stringify({ query }),
        });
        const result = await response.json();

        if (result.errors) {
          setError(result.errors);
        } else {
          setData(result.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
};

export default useCMSData;
