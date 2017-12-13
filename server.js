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

// Routes for pages
app.get('/', onInitialLoad);
app.get('/NBAData/', showNBAData);
app.get('/updateNBAData/', updateNBAData);

// Routes for querying the data
app.get('/loadTableData/country/:country', query1);
app.get('/loadTableData/position/:position', query2);
app.get('/loadTableData/topPicks/', query3);
app.get('/loadTableData/bestColleges', query4);
app.get('/loadTableData/mostGamesPlayed', query5);
app.get('/loadTableData/collegeOne/:firstCollegeId/collegeTwo/:secondCollegeId', query6);
app.get('/loadTableData/multipleDrafts', query7);
app.get('/loadTableData/longestCareers', query8);
app.get('/loadTableData/allPlayers', query9);

// Routes for inserting, updating, and deleting
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
  var country = request.params.country;

  var result;
  var queryString = "SELECT player_name, country FROM Player WHERE country = ?";

  connection.query(queryString, country, function(err, rows, fields) {
    if (err) throw err;
    result = rows;
    response.send(result);
  });
}

function query2(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT p.player_name, s.field_goal_pct, p.position FROM Player p NATURAL JOIN ShootingStats s WHERE p.position = ? AND s.field_goal_pct >= (SELECT MAX(s.field_goal_pct) FROM Player p, ShootingStats s WHERE p.position = ? AND p.player_id = s.player_id);";

  connection.query(queryString, [position, position], function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query3(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT t.team_name, COUNT(*) AS first_picks FROM Player p, Team t, Draft d WHERE d.player_id = p.player_id AND d.round = 1 AND d.pick_number = 1 AND t.team_code = p.team_code GROUP BY p.team_code ORDER BY first_picks DESC;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query4(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT c.college_name, COUNT(*) AS first_picks FROM Player p, College c, Draft d WHERE d.player_id = p.player_id AND d.round = 1 AND d.pick_number = 1 AND c.college_id = p.college_id GROUP BY c.college_id ORDER BY first_picks DESC;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query5(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT c.college_name, SUM(s.games_played) AS games_played FROM PerGameStats s, College c, Player p WHERE p.player_id = s.player_id AND p.college_id = c.college_id GROUP BY p.college_id ORDER BY games_played DESC LIMIT 50;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query6(request, response) {
  var firstCollegeId = request.params.firstCollegeId;
  var secondCollegeId = request.params.secondCollegeId;
  var result;
  var queryString = "SELECT p.player_name, c.college_name, s.points FROM Player p, College c, PerGameStats s WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = ? HAVING s.points >= (SELECT MAX(s.points) FROM PerGameStats s, College c, Player p WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = ?)" +
    "UNION SELECT p.player_name, c.college_name, s.points FROM Player p, College c, PerGameStats s WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = ? HAVING s.points >= (SELECT MAX(s.points) FROM PerGameStats s, College c, Player p WHERE p.player_id = s.player_id AND p.college_id = c.college_id AND c.college_id = ?);";
  connection.query(queryString, [firstCollegeId, firstCollegeId, secondCollegeId, secondCollegeId], function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query7(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT player_name, COUNT(*) AS times_drafted FROM Player GROUP BY player_name HAVING COUNT(*) > 1;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query8(request, response) {
  var position = request.params.position;

  var result;
  var queryString = "SELECT p.player_name, d.to_year - d.from_year AS career_length FROM Player p, Draft d WHERE d.player_id = p.player_id ORDER BY career_length DESC LIMIT 10;";

  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
    result = rows;

    response.send(result);
  });
}

function query9(request, response) {
  var position = request.params.position;

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
      jsondata[i].position,
      jsondata[i].country,
      jsondata[i].college_id,
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
    jsondata.position,
    jsondata.country,
    jsondata.college_id,
    jsondata.team_code,
    jsondata.player_id
  ];
  connection.query("UPDATE Player SET player_name = ?," +
    " position = ?, country = ?, college_id = ?," +
    " team_code = ? WHERE player_id = ?;", values,
    function(err, result) {
      if (result.affectedRows == 0) {
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
