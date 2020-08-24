import React, { useState, useEffect } from 'react';
import { Book, Pagination, Search } from './components';
import './App.css';

const API_URL = 'http://localhost:8000/books';
const PAGINATION_LIMIT = 3;

function App() {
  const [books, setBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const reserveBook = async (bookId, wantsToReserve) => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookId,
          reserve: wantsToReserve, // true = reserve, false = unreserve
        })
      });
      const result = await response.json();
      // update books and reserved books manually in state to avoid making redundant calls to the API
      updateBooks(result);
      updatedReservedBooks(result, wantsToReserve);
    } catch (err) {
      setError(err.message || 'Failed to reserve or unreserve a book');
    }
  };

  const updateBooks = (updatedBook) => {
    const bookIndex = books.findIndex(book => book.id === updatedBook.id)
    const updatedBooks = [...books];
    updatedBooks[bookIndex] = updatedBook;
    setBooks(updatedBooks);
  };

  const updatedReservedBooks = (updatedBook, wantsToReserve) => {
    const reservedBookIndex = reservedBooks.findIndex(reservedBook => reservedBook.id === updatedBook.id);
    const updatedReservedBooks = [...reservedBooks];

    // if user is reserving a book
    if (wantsToReserve) {
      if (reservedBookIndex >= 0) {
        updatedReservedBooks[reservedBookIndex] = updatedBook;
      } else {
        updatedReservedBooks.push(updatedBook);
      }
    }
    // otherwise user is unreserving a book
    else {
      const quantityReservedRemaining = reservedBooks[reservedBookIndex].quantity_reserved - 1;
      if (quantityReservedRemaining === 0) {
        updatedReservedBooks.splice(reservedBookIndex, 1);
      } else {
        updatedReservedBooks[reservedBookIndex].quantity_reserved = quantityReservedRemaining;
      }
    }

    // sort reserved books by increasing ID,
    // in case insertion or deletion of items messed up the initial order
    const sorted = updatedReservedBooks.sort((a, b) => a.id - b.id);
    setReservedBooks(sorted);
  };

  // fetch books after initial render, when user changes page and when search input changes
  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/?limit=${PAGINATION_LIMIT}&page=${page}&search=${searchInput}`, {
          method: 'GET',
        });
        const result = await response.json();
        setBooks(result.results);
        setPage(page);
        setTotalPages(result.count);
      } catch (err) {
        setError(err.message || 'Failed to fetch books');
      }
    };
    getBooks();
  }, [page, searchInput]);

  // only fetch reserved books after initial render
  // so user knows immediately which books are reserved (even those beyond the current page)
  useEffect(() => {
    const getReservedBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/?reserved=true`, {
          method: 'GET',
        });
        const result = await response.json();
        setReservedBooks(result)
      } catch (err) {
        setError(err.message || 'Failed to fetch reserved books');
      }
    };
    getReservedBooks();
  }, []);

  return (
    <div className="App">
      <h1>Saasvile Public Library Books</h1>

      <Search
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setPage={setPage}
      />

      <ul>
        {books.map(book =>
          <Book
            key={book.id}
            data={book}
            disabled={book.quantity === 0}
            amount={book.quantity}
            buttonName={'Reserve'}
            reserveBook={() => reserveBook(book.id, true)}
          />
        )}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        paginationLimit={PAGINATION_LIMIT}
      />

      <h1>Reserved Books</h1>
      <ul>
        {reservedBooks.map(reservedBook => {
          return reservedBook.quantity_reserved > 0 && <Book
            key={reservedBook.id}
            data={reservedBook}
            disabled={reservedBook.quantity_reserved === 0}
            amount={reservedBook.quantity_reserved}
            buttonName={'Unreserve'}
            reserveBook={() => reserveBook(reservedBook.id, false)}
          />
        })}
      </ul>

      {error && <div>Error: {error}</div>}
    </div >
  );
}

export default App;
