import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./components/DataContext";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Browse from "./components/Browse";
import MusicianPage from "./components/MusicianPage";
import './App.css';

function App() {

  return (
    <DataProvider>
      <Router>
        <div className="body">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/musician/:slug" element={<MusicianPage />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
