import React from 'react';

const Pagination = ({ page, totalBooks, setPage, paginationLimit }) => {
  const lastPage = page === Math.ceil(totalBooks / paginationLimit) || 1;
  return (
    <>
      <h2>Current Page: {page}</h2>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous Page</button>
      <button disabled={page === lastPage} onClick={() => setPage(page + 1)}>Next Page</button>
    </>
  );
};

export default Pagination;
