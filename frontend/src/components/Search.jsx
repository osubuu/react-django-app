import React from 'react';

const Search = ({ searchInput, setSearchInput, setPage }) => {
  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor='search-input'>
        Search by title:
          <input type="text" id="search-input" value={searchInput} onChange={e => {
          setPage(1);
          setSearchInput(e.target.value)
        }} />
      </label>
    </form>
  );
};

export default Search;
