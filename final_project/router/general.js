const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented a"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorName = req.params.author;

  const matchingBooks = Object.values(books).filter(book =>
    book.author.toLowerCase() === authorName.toLowerCase()
  );

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send("No books found for this author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const matchingBooks = Object.values(books).filter(book =>
    book.title.toLowerCase() === title.toLowerCase()
  );

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send("No books found for this title");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).send("No review found for this book");
  }
});

module.exports.general = public_users;
