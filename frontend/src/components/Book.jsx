import React from 'react';

const Book = ({ data, reserveBook, disabled, buttonName, amount }) => {
  const { title, author } = data;
  return (
    <li>
      <span>{title} by {author} ({amount})</span>
      <button disabled={disabled} onClick={reserveBook}>{buttonName}</button>
    </li>
  );
};

export default Book;
