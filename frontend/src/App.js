import React, { useState, useEffect } from 'react';
import { Book, Pagination, Search } from './components';
import './App.css';

const API_URL = 'http://localhost:8000';
const PAGINATION_LIMIT = 3;

function App() {
  const [books, setBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const reserveBook = async (bookId) => {
    try {
      const response = await fetch(`${API_URL}/reserved/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookId,
        })
      });
      const result = await response.json();
      // update books and reserved books manually in state to avoid making redundant calls to the API
      updateBooks(bookId, true);
      updateReservedBooks(result, true)
    } catch (err) {
      setError(err.message || 'Failed to reserve a book');
    }
  };

  const unreserveBook = async (reservedBook) => {
    try {
      const response = await fetch(`${API_URL}/reserved/${reservedBook.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'unreserve',
        })
      });
      const result = await response.json();
      // update books and reserved books manually in state to avoid making redundant calls to the API
      updateBooks(reservedBook.book_id, false);
      updateReservedBooks(reservedBook, false)
    } catch (err) {
      setError(err.message || 'Failed to unreserve a book');
    }
  };

  const updateBooks = (bookId, reserve) => {
    const bookIndex = books.findIndex(book => book.id === bookId);
    // only manually update the books in state if they are currently present on the page
    if (bookIndex >= 0) {
      const updatedBooks = [...books];
      const currentQuantity = updatedBooks[bookIndex].quantity;
      updatedBooks[bookIndex] = {
        ...updatedBooks[bookIndex],
        quantity: reserve ? currentQuantity - 1 : currentQuantity + 1,
      };
      setBooks(updatedBooks);
    }
  };

  const updateReservedBooks = (updatedBook, reserve) => {
    const updatedReservedBooks = [...reservedBooks];

    // if user is reserving a book
    if (reserve) {
      updatedReservedBooks.push(updatedBook);
    }
    // otherwise user is unreserving a book
    else {
      const removedBookIndex = reservedBooks.indexOf(updatedBook);
      updatedReservedBooks.splice(removedBookIndex, 1);
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
        const response = await fetch(`${API_URL}/books?limit=${PAGINATION_LIMIT}&page=${page}&search=${searchInput}`, {
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
        const response = await fetch(`${API_URL}/reserved`, {
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
            reserveBook={() => reserveBook(book.id)}
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
          return <Book
            key={`reserved-${reservedBook.id}`}
            data={reservedBook}
            buttonName={'Unreserve'}
            reserveBook={() => unreserveBook(reservedBook)}
          />
        })}
      </ul>

      {error && <div>Error: {error}</div>}
    </div >
  );
}

export default App;
