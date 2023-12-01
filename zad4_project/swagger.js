const swaggerAutogen = require("swagger-autogen")();
const outputFile = "./swagger.json";
const endpointsFiles = ["./matchsvc.js"];
const doc = {
  info: {
    version: "1",
    title: "Program obsługi meczy - dokumentacja Swagger",
    description: "Dokumentacja REST API",
  },
  host: "localhost:3000",
};
swaggerAutogen(outputFile, endpointsFiles, doc);
