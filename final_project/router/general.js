const express = require('express');
const axios = require("axios");

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user or missing username or password"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:3000/books");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get("http://localhost:3000/books");
    const books = response.data;

    const book = books[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book",
      error: error.message
    });
  }
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
