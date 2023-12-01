const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var MongoDB = require("mongodb");
var mongoc = MongoDB.MongoClient;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/api/match", function (req, res) {
  // #swagger.description = 'Pobiera wszystkie mecze lub mecze rozegrane przez podany kraj'
  // #swagger.tags = ['Match']
  /* #swagger.parameters['countryId'] = { 
        in: 'query',
        description: 'ID kraju (opcjonalne)',
        schema: {
          type: 'integer'
        }
      }
  */
  const countryId = req.query.countryId;

  if (countryId) {
    console.log("GET api/match/?countryId=" + countryId);

    const foundMatch = matchRepository.filter(
      (match) => match.country1Id == countryId || match.country2Id == countryId
    );

    if (foundMatch.length === 0) {
      res.status(404).send("Podany kraj nie ma wprowadzonej żadnej rozgrywki");
    } else {
      res.json(foundMatch);
    }
  } else {
    console.log("GET api/match");
    res.json(matchRepository);
  }
});

app.get("/api/match/:matchId", function (req, res) {
  // #swagger.description = 'Pobiera mecz o wskazanym id'
  // #swagger.tags = ['Match']
  /* #swagger.parameters['matchId'] = { 
        description: 'ID meczu',    
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'integer',
          minimum: 1
        }
      }
  */
  const matchId = req.params.matchId;
  console.log(`GET api/match/${matchId}`);

  const foundMatch = matchRepository.find((match) => match.id == matchId);

  if (!foundMatch) {
    res.status(404).send("Nie znaleziono takiego meczu");
  } else {
    res.json(foundMatch);
  }
});

app.post("/api/match", function (req, res) {
  // #swagger.description = 'Wstawia mecz'
  // #swagger.tags = ['Match']
  /*  #swagger.parameters['body'] = {
            description: 'dane potrzebne do utworzenia Meczu',
            in: 'body',
            required: true,
            schema: {
                dateOfMatch: "2000-01-01",
                country1Id: 1,
                country2Id: 2,
                pointsCountry1: 0,
                pointsCountry2: 0,
            }
    } */
  const newMatch = req.body;
  console.log(`POST api/match/ ${JSON.stringify(newMatch)}`);

  matchRepository.push(newMatch);
  res.status(201).json(newMatch);
});

app.delete("/api/match/:matchId", function (req, res) {
  // #swagger.description = 'Usuwa mecz o wskazanym id'
  // #swagger.tags = ['Match']
  // #swagger.parameters['matchId'] = { description: 'ID meczu' }
  const matchId = req.params.matchId;
  console.log(`DELETE api/match/${matchId}`);

  const indexMatch = matchRepository.findIndex((match) => match.id == matchId);

  if (indexMatch == -1) {
    res.status(404).send("Nie znaleziono takiego meczu");
  } else {
    removedItem = matchRepository.splice(indexMatch, 1);
    res.end(JSON.stringify(removedItem));
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
