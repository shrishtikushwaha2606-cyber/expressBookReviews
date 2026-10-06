const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      books[isbn]["isbn"] = isbn;
      booksbyauthor.push(books[isbn]);
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      books[isbn]["isbn"] = isbn;
      booksbytitle.push(books[isbn]);
    }
  });
  res.send(JSON.stringify({booksbytitle}, null, 4));
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});

// ==========================================
// Task 10-13: Axios & Promises
// ==========================================
const axios = require('axios');

// Task 10
public_users.get('/async-books', async function (req, res) {
    try {
        let response = await axios.get('http://localhost:5000/');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11
public_users.get('/async-isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(404).json({message: "ISBN not found"});
    });
});

// Task 12
public_users.get('/async-author/:author', async function (req, res) {
    try {
        let author = req.params.author;
        let response = await axios.get(`http://localhost:5000/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).json({message: "Author not found"});
    }
});

// Task 13
public_users.get('/async-title/:title', function (req, res) {
    let title = req.params.title;
    axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(404).json({message: "Title not found"});
    });
});

module.exports.general = public_users;
