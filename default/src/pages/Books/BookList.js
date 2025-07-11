import React, { useEffect, useState } from "react";

// Utility to parse a line into a Book365Base-like object
function parseBookLine(line) {
  const [
    nybooksSN, Title, Author, weekNo1, gptPublicationYear, ggurl, gptFirstPublication,
    ggimage, description, gptAuthorDescription, gptGenre, gptGenre2, gptGenre3, gptGenre4, ggShelfsn
  ] = line.split("||");

  return {
    nybooksSN: Number(nybooksSN),
    Title,
    Author,
    weekNo1: Number(weekNo1),
    gptPublicationYear: Number(gptPublicationYear),
    ggurl,
    gptFirstPublication,
    ggimage,
    description,
    gptAuthorDescription,
    gptGenre,
    gptGenre2,
    gptGenre3,
    gptGenre4,
    ggShelfsn,
    // Add other fields as needed
  };
}

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/data/books/NumberOneMaster.txt")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").filter(Boolean);
        const parsed = lines.map(parseBookLine);
        setBooks(parsed);
      });
  }, []);

  return (
    <div className="container">
      <h1>Book List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Genres</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.nybooksSN}>
              <td>{book.nybooksSN}</td>
              <td>{book.Title}</td>
              <td>{book.Author}</td>
              <td>{book.gptPublicationYear}</td>
              <td>
                {[book.gptGenre, book.gptGenre2, book.gptGenre3, book.gptGenre4]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td>{book.description}</td>
              <td>
                {book.ggimage && (
                  <img src={book.ggimage} alt={book.Title} style={{ width: 60 }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;