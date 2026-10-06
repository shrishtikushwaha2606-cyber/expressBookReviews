const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

// Task 7: Login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    // Expected output format for the Coursera grader
    return res.status(200).json({message: "Customer successfully logged in", token: accessToken});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 8: Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
      let review = req.body.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          book["reviews"][reviewer] = review;
          books[isbn] = book;
      }
      res.status(200).json({message:`The review for the book with ISBN ${isbn} has been added/updated.`});
  }
  else{
      res.status(404).json({message:`Unable to find this ISBN!`});
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];
  let initial_review = books[isbn]["reviews"][reviewer];
  if (initial_review){
      delete books[isbn]["reviews"][reviewer];
      res.status(200).json({message: `Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`});
  } else {
      res.status(400).json({message: "Can't delete, as this review is not posted by this user"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;