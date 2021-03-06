import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("react hooks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  //First method
  // useEffect(() => {
  //   axios
  //     .get("http://hn.algolia.com/api/v1/search?query=reacthooks")
  //     .then(response => {
  //       console.log(response.data);
  //       setResults(response.data.hits);
  //     });
  // }, []);

  useEffect(() => {
    getResults();
  }, []); //getResults() will run when [query] is updated and first mount

  //writing async function inside useEffect is prohibited
  const getResults = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?query=${query}`
      );
      setResults(response.data.hits);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSearch = event => {
    event.preventDefault();
    getResults();
  };
  const handleClearSearch = () => {
    setQuery("");
    searchInputRef.current.focus();
  };

  return (
    <div className="container max-w-md mx-auto p-4 m-2 bg-purple-lightest shadow-lg rounded">
      <img
        src="https://icon.now.sh/react/c0c/"
        alt="react logo"
        className="float-right h-12"
      />
      <h1 className="text-grey-darkest font-thin">Hooks News</h1>
      <form onSubmit={handleSearch} className="mb-2">
        <input
          type="text"
          onChange={event => setQuery(event.target.value)}
          value={query}
          ref={searchInputRef}
          className="border p-1 rounded"
        />
        <button type="submit" className="bg-orange rounded m-1 p-1">
          Search
        </button>
        <button
          type="button"
          onClick={handleClearSearch}
          className="bg-teal text-black p-1 rounded"
        >
          Clear
        </button>
        {loading ? (
          <div className="font-bold text-orange-dark">Loading results..</div>
        ) : (
          <ul className="list-reset leading-normal">
            {results.map(result => (
              <li
                key={result.objectID}
                className="text-indigo-dark hover:text-indigo-darkest"
              >
                <a href={result.url} target="_blank">
                  {result.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </form>
      {error && <div className="text-red font-bold">{error.message}</div>}
    </div>
  );
}
