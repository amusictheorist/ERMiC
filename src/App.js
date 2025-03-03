import './App.css';
import { useState, useEffect } from 'react';
import Homepage from './components/HomePage';
import Navbar from './components/Navbar';


// const query = `{
//   pageCollection {
//     items {
//       title
//       logo {
//         url
//       }
//     }
//   }
// }`

function App() {
  // const [page, setPage] = useState(null);

  // useEffect(() => {
  //   window
  //     .fetch(`https://graphql.contentful.com/content/v1/spaces/lsaglqw7atjk/`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer JEUyOw04eq02knEmUeHpfao4_TMxCcB_48C6Pk91a7E'
  //       },
  //       body: JSON.stringify({ query })
  //     })
  //     .then((response) => response.json())
  //     .then(({ data, errors }) => {
  //       if (errors) {
  //         console.error(errors);
  //       }

  //       setPage(data.pageCollection.items[0]);
  //     });
  // }, []);

  // if (!page) {
  //   return 'Loading...'
  // }

  return (
    <div>
      <Navbar />
      <Homepage />
    </div>
  );
}

export default App;
