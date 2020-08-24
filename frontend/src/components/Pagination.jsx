import React from 'react';

const Pagination = ({ page, totalPages, setPage, paginationLimit }) => {
  return (
    <>
      <h2>Current Page: {page}</h2>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous Page</button>
      <button disabled={page === Math.ceil(totalPages / paginationLimit)} onClick={() => setPage(page + 1)}>Next Page</button>
    </>
  );
};

export default Pagination;
