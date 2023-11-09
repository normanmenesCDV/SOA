const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/rest", (req, res) => {
  res.json({
    items: [
      { id: 1, name: "Apples", price: "$3" },
      { id: 2, name: "Oranges", price: "$6" },
    ],
  });
});

app.get("/rest2", (req, res) => {
  res.json({
    items: [
      { id: 1, name: "Apples", price: "$3" },
      { id: 2, name: "Oranges", price: "$6" },
    ],
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
