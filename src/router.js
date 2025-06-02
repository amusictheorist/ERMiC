import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Browse from "./components/browse/Browse";
import MusicianPage from "./components/pages/MusicianPage";
import SearchResultsPage from "./components/pages/SearchResultsPage";
import App from "./App";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'browse', element: <Browse /> },
      { path: 'musician/:slug', element: <MusicianPage /> },
      { path: 'search-results', element: <SearchResultsPage /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

export default router;