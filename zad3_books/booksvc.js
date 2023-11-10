const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const bookRepository = [
  { id: 1, title: "abc", price: 20 },
  { id: 2, title: "zzz", price: 10 },
];

app.get("/books", function (req, res) {
  console.log("GET /books");
  res.end(JSON.stringify(bookRepository));
});

// http://localhost:3000/legacy/book/1
app.get("/legacy/book/:bookid", function (req, res) {
  console.log("GET /legacy/book/" + req.params.bookid);
  foundIndex = -1;
  for (i in bookRepository) {
    if (bookRepository[i].id == req.params.bookid) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex == -1) {
    res.status(404);
    res.send("");
  } else {
    res.send(JSON.stringify(bookRepository[foundIndex]));
  }
});

// http://localhost:3000/book?id=1
app.get("/book", function (req, res) {
  var bookid = req.query.id;
  console.log("GET /book/?id=" + bookid);
  foundIndex = -1;
  for (i in bookRepository) {
    if (bookRepository[i].id == bookid) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex == -1) {
    res.status(404);
    res.send("");
  } else {
    res.send(JSON.stringify(bookRepository[foundIndex]));
  }
});

app.post("/book/", function (req, res) {
  console.log("POST /book/" + JSON.stringify(req.body));
  bookRepository.push(req.body);
  res.status(201);
  res.send(JSON.stringify(req.body));
});

app.delete("/book/:bookid", function (req, res) {
  console.log("DELETE /book/" + req.params.bookid);
  let indexItem = -1;
  for (i in bookRepository) {
    if (bookRepository[i].id == req.params.bookid) {
      indexItem = i;
      break;
    }
  }
  if (indexItem != -1) {
    removedItem = bookRepository.splice(indexItem, 1);
    res.end(JSON.stringify(removedItem));
  } else {
    res.status(404);
    res.send("");
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
