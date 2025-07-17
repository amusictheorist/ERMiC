import { createBrowserRouter } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Browse from "./components/browse/Browse";
import MusicianPage from "./components/pages/MusicianPage";
import SearchResultsPage from "./components/pages/SearchResultsPage";
import App from "./App";
import GeneralResultsPage from "./components/pages/GeneralResultsPage";
import AboutPage from "./components/pages/AboutPage";
import AuthorResults from "./components/pages/AuthorResults";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'browse', element: <Browse /> },
      { path: 'musician/:slug', element: <MusicianPage /> },
      { path: 'results/occupation', element: <SearchResultsPage /> },
      { path: 'results/author', element: <AuthorResults /> },
      { path: 'results', element: <GeneralResultsPage /> },
      { path: 'about', element: <AboutPage /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

export default router;