// Dependencies
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');


// Our App
var app = express();

// Sets a static public directory for html, css, and java files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


// Routes
app.get('/', onInitialLoad);
app.get('/NBAData/', showNBAData);
app.get('/updateNBAData/', updateNBAData);
app.get('/loadTableDataQuery1/', query1);
app.post('/loadTableData/', insert);
app.put('/loadTableData/', update);
app.delete('/loadTableData/', del);

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

function showNBAData(request, response) {

  response.sendFile(path.join(__dirname + '/public/NBAData.html'));
}

function updateNBAData(request, response) {

  response.sendFile(path.join(__dirname + '/public/update.html'));
}


function query1(request, response) {
  var result;

  var queryString = "SELECT * FROM Player;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;
    response.send(result);
  });
}

function insert(request, response) {
  var jsondata = request.body;
  var values = [];

  for (var i = 0; i < jsondata.length; i++)
    values.push([
      jsondata[i].player_id,
      jsondata[i].player_name,
      jsondata[i].age_drafted,
      jsondata[i].position,
      jsondata[i].country,
      jsondata[i].college_id,
      jsondata[i].start_year,
      jsondata[i].graduate_year,
      jsondata[i].round_drafted,
      jsondata[i].pick_number,
      jsondata[i].team_code
    ]);

  connection.query('INSERT INTO Player VALUES ?;', [values], function(err, result) {
    if (err) {
      response.status(500).send(err.sqlMessage);
      console.log(err.sqlMessage);
    } else {
      response.send('Success');
    }
  });
}

function update(request, response) {
  var jsondata = request.body;
  var values = [
    jsondata.player_name,
    jsondata.age_drafted,
    jsondata.position,
    jsondata.country,
    jsondata.college_id,
    jsondata.start_year,
    jsondata.graduate_year,
    jsondata.round_drafted,
    jsondata.pick_number,
    jsondata.team_code,
    jsondata.player_id
  ];
  connection.query("UPDATE Player SET player_name = ?, age_drafted = ?," +
  " position = ?, country = ?, college_id = ?, from_year = ?, to_year = ?, round = ?," +
  " pick_number = ?, team_code = ? WHERE player_id = ?;", values, function(err, result) {
    console.log(result);
    if (result.rowCount == 0) {
      response.status(501).send("The row that you are trying to update doesn't exist.");
    } else {
      response.send('Success');
    }
  });
}

function del(request, response) {
  var jsondata = request.body.player_id;

  //Bulk insert using nested array [ [a,b],[c,d] ] will be flattened to (a,b),(c,d)
  connection.query('DELETE FROM Player WHERE player_id = ?', jsondata, function(err, result) {
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
