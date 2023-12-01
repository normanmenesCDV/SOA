const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors");

// nie działa połączenie z bazą danych
const MongoDB = require("mongodb");
const mongoc = MongoDB.MongoClient;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const matchRepository = [
  {
    _id: {
      $oid: "6568fe37227389562b5ba297",
    },
    dateOfMatch: "2023-05-05",
    country1Id: "6568fa5c227389562b5ba28b",
    country2Id: "6568fa5c227389562b5ba28c",
    pointsCountry1: 0,
    pointsCountry2: 0,
  },
  {
    _id: {
      $oid: "6568fe37227389562b5ba298",
    },
    dateOfMatch: "2023-10-23",
    country1Id: "6568fa5c227389562b5ba28c",
    country2Id: "6568fa5c227389562b5ba28f",
    pointsCountry1: 2,
    pointsCountry2: 1,
  },
];

const countryRepository = [
  {
    _id: {
      $oid: "6568fa5c227389562b5ba28b",
    },
    name: "Polska",
  },
  {
    _id: {
      $oid: "6568fa5c227389562b5ba28c",
    },
    name: "Niemcy",
  },
  {
    _id: {
      $oid: "6568fa5c227389562b5ba28d",
    },
    name: "Czechy",
  },
  {
    _id: {
      $oid: "6568fa5c227389562b5ba28e",
    },
    name: "Słowacja",
  },
  {
    _id: {
      $oid: "6568fa5c227389562b5ba28f",
    },
    name: "USA",
  },
];

app.get("/api/country", function (req, res) {
  // #swagger.description = 'Pobiera wszystkie kraje'
  // #swagger.tags = ['Country']

  console.log("GET api/country");
  res.json(countryRepository);
});

app.get("/api/country/:countryId", function (req, res) {
  // #swagger.description = 'Pobiera mecz o wskazanym id'
  // #swagger.tags = ['Country']
  /* #swagger.parameters['countryId'] = { 
        description: 'ID kraju',    
        in: 'path',
        required: true,
        schema: {
          type: 'string'
        }
      }
  */
  const countryId = req.params.countryId;
  console.log(`GET api/country/${countryId}`);

  const foundCountry = countryRepository.find(
    (country) => country._id.$oid == countryId
  );

  if (!foundCountry) {
    res.status(404).send("Nie znaleziono takiego państwa");
  } else {
    res.json(foundCountry);
  }
});

app.post("/api/country", function (req, res) {
  // #swagger.description = 'Wstawia kraj'
  // #swagger.tags = ['Country']
  /*  #swagger.parameters['body'] = {
            description: 'dane potrzebne do utworzenia kraju',
            in: 'body',
            required: true,
            schema: {
                name: "name",
            }
    } */

  const newCountry = {
    _id: {
      $oid: makeId(),
    },
    name: req.body.name,
  };
  console.log(`POST api/country/ ${JSON.stringify(newCountry)}`);

  countryRepository.push(newCountry);
  res.status(201).json(newCountry);
});

app.get("/api/match", function (req, res) {
  // #swagger.description = 'Pobiera wszystkie mecze lub mecze rozegrane przez podany kraj'
  // #swagger.tags = ['Match']
  /* #swagger.parameters['countryId'] = { 
        in: 'query',
        description: 'ID kraju (opcjonalne)',
        schema: {
          type: 'string'
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
          type: 'string'
        }
      }
  */
  const matchId = req.params.matchId;
  console.log(`GET api/match/${matchId}`);

  const foundMatch = matchRepository.find((match) => match._id.$oid == matchId);

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
                country1Id: "",
                country2Id: "",
                pointsCountry1: 0,
                pointsCountry2: 0,
            }
    } */

  const newMatch = {
    _id: {
      $oid: makeId(),
    },
    dateOfMatch: req.body.dateOfMatch,
    country1Id: req.body.country1Id,
    country2Id: req.body.country2Id,
    pointsCountry1: req.body.pointsCountry1,
    pointsCountry2: req.body.pointsCountry2,
  };
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

  const indexMatch = matchRepository.findIndex(
    (match) => match._id.$oid == matchId
  );

  if (indexMatch == -1) {
    res.status(404).send("Nie znaleziono takiego meczu");
  } else {
    removedItem = matchRepository.splice(indexMatch, 1);
    res.end(JSON.stringify(removedItem));
  }
});

function makeId() {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 24) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.listen(3000, () => {
  console.log("Server started");
});
