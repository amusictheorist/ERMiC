import { useState, useEffect } from "react";

const PASSWORD = process.env.REACT_APP_TEAM_PASSWORD;

const LoginGate = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [expired, setExpired] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem('authenticated', 'true');
      localStorage.setItem('auth_time', Date.now());
      setAuthenticated(true);
      setExpired(false);
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    const isAuthed = localStorage.getItem('authenticated') === 'true';
    const time = parseInt(localStorage.getItem('auth_time'), 10);
    const maxAge = 1000 * 60 * 60 * 24 * 7;

    if (isAuthed && !isNaN(time)) {
      if (Date.now() - time < maxAge) {
        setAuthenticated(true);
      } else {
        setExpired(true);
        localStorage.removeItem('authenticated');
        localStorage.removeItem('auth_time');
      }
    }
  }, []);

  if (authenticated) return children;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md">
        <h2 className="text-xl mb-4">Enter Password</h2>
        {expired && (
          <p className="text-red-600 mb-2">
            Your session has expired. Please log in again.
          </p>
        )}
        <input
          type="password"
          name="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">
          Access Site
        </button>
      </form>
    </div>
  );
};

export default LoginGate;
