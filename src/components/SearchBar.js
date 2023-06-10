import React from "react";

const SearchBar = ({ tickerCallback }) => {
  const [search, setSearch] = React.useState("");

  return (
    <div>
      <input
        onChange={(e) => {
          let sanitized = e.target.value
            // Allow alphanumeric characters
            .replace(/[^\w\s]/gi, "")
            .trim()
            .toUpperCase();
          e.target.value = sanitized;
          setSearch(sanitized);
        }}
        type="text"
        placeholder="Search for a stock"
        className="mt-4 p-2 w-96 h-12 rounded-md border-2 border-gray-100"
      />
      {/* Green button that says "Search" */}
      <button
        onClick={() => {
          tickerCallback(search);
        }}
        className="ml-1 w-28 h-12 bg-green-500 text-white p-2 rounded-md mt-4"
      >
        Go
      </button>
    </div>
  );
};

export default SearchBar;
