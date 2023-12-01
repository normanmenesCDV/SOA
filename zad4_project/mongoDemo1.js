var MongoDB = require("mongodb");
var mongoc = MongoDB.MongoClient;
mongoc.connect("mongodb://127.0.0.1:27017/", function (err, db) {
  if (err) throw err;
  var dbo = db.db("demo");
  var query = { id: 2 };
  dbo
    .collection("users")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});
