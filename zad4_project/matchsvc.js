const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// dopisać do swaggera opisy funkcjonalności

const countryRepository = [
  { id: 1, name: "Polska" },
  { id: 2, name: "Niemcy" },
  { id: 3, name: "Słowacja" },
  { id: 4, name: "Chiny" },
  { id: 4, name: "Norwegia" },
];


const matchRepository = [
  { id: 1, country1Id: 1, country1Id: 2 },
  { id: 2, country2Id: "zzz", price: 10 },
];


app.get("/match", function (req, res) {
  console.log("GET /match");
  res.end(JSON.stringify(matchRepository));
});


app.get("/match/:matchId", function (req, res) {
  console.log("GET /match/" + req.params.matchId);
  foundIndex = -1;
  for (i in matchRepository) {
    if (matchRepository[i].id == req.params.matchId) {
      foundIndex = i;
      break;
    }
  }
  if (foundIndex == -1) {
    res.status(404);
    res.send("");
  } else {
    res.send(JSON.stringify(matchRepository[foundIndex]));
  }
});


app.post("/match/", function (req, res) {
  console.log("POST /match/" + JSON.stringify(req.body));
  matchRepository.push(req.body);
  res.status(201);
  res.send(JSON.stringify(req.body));
});


app.delete("/match/:matchId", function (req, res) {
  console.log("DELETE /match/" + req.params.matchId);
  let indexItem = -1;
  for (i in matchRepository) {
    if (matchRepository[i].id == req.params.matchId) {
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
