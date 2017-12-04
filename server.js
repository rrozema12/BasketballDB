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


// Test Routes
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

  var queryString = "SELECT * FROM Country;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;
    response.send(result);
  });
}

function insertTestTable(request, response) {
  var jsondata = request.body;
  var values = [];

  for (var i = 0; i < jsondata.length; i++)
    values.push([jsondata[i].code, jsondata[i].country_name, jsondata[i].gdp, jsondata[i].inflation]);

  connection.query('INSERT INTO Country (code, country_name, gdp, inflation) VALUES ?;', [values], function(err, result) {
    if (err) {
      response.status(500).send(err.sqlMessage);
      console.log(err.sqlMessage);
    } else {
      response.send('Success');
    }
  });
}

function updateTestTable(request, response) {
  var jsondata = request.body;

  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('UPDATE Country SET country_name = ?, gdp = ?, inflation = ? WHERE code = ?;', [jsondata.country_name, jsondata.gdp, jsondata.inflation, jsondata.code], function(err, result) {
    if (result.affectedRows == 0) {
      response.status(501).send("The row that you are trying to update doesn't exist.");
    } else {
      response.send('Success');
    }
  });
}

function deleteFromTestTable(request, response) {
  var jsondata = request.body.code;

  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('DELETE FROM Country WHERE code = ?', jsondata, function(err, result) {
    if (result.affectedRows == 0) {
      response.status(502).send("The row that you are trying to delete doesn't exist.");
    } else {
      response.send('Success');
    }
  });
}

// Open up a port for our application
app.listen(3000, function() {
  console.log("Our server is listening to localhost:3000");
});
