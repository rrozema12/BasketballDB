// Dependencies
var express = require('express');
var mysql = require("mysql");
var path = require('path');
var bodyParser = require('body-parser');


// Our App
var app = express();

// Sets a static public directory for html, css, and java files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


// Routes
app.get('/', onInitialLoad);
app.get('/test', test);
app.get('/loadTableData', loadTestTable);
app.post('/loadTableData', insertTestTable);
app.put('/loadTableData', updateTestTable);
app.delete('/loadTableData', deleteFromTestTable);

// Database connection info
var connection = mysql.createConnection({
  host: "147.222.163.1",
  port: "3306",
  user: "rrozema",
  password: "rrozema69492485",
  database: "rrozema_DB"
});

// Connect to the database
connection.connect();

// Functions for the route hits
function onInitialLoad(request, response) {
  response.sendFile(path.join(__dirname + '/index.html'));
}

function test(request, response) {

  response.sendFile(path.join(__dirname + '/public/test.html'));
}

function loadTestTable(request, response) {
  var result;

  console.log("Database connection successful.");

  var queryString = "SELECT * FROM Country;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    console.log("Database connection ended.");
    response.send(result);
    console.log("JSON data from the query has been sent.");

  });
}

function insertTestTable(req, res) {
  var jsondata = req.body;
  console.log("json data is: " + JSON.stringify(jsondata));
  var values = [];

  for (var i = 0; i < jsondata.length; i++)
    values.push([jsondata[i].code, jsondata[i].country_name, jsondata[i].gdp, jsondata[i].inflation]);

  console.log(values);
  console.log("values are " + values);
  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('INSERT INTO Country (code, country_name, gdp, inflation) VALUES ?;', [values], function(err, result) {
    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send('Success');
    }
  });
}

function updateTestTable(req, res) {
  var jsondata = req.body;
  console.log("json data is: " + jsondata);

  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('UPDATE Country SET country_name = ?, gdp = ?, inflation = ? WHERE code = ?;', [jsondata.country_name, jsondata.gdp, jsondata.inflation, jsondata.code], function(err, result) {
    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send('Success');
    }
  });
}

function deleteFromTestTable(req, res) {
  var jsondata = req.body.code;
  console.log("json data is: " + jsondata);

  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('DELETE FROM Country WHERE code = ?', jsondata, function(err, result) {
    if (err) {
      res.send(err.sqlMessage);
    } else {
      res.send('Success');
    }
  });
}

// Open up a port for our application
app.listen(3000, function() {
  console.log("Our server is listening to localhost:3000");
});
