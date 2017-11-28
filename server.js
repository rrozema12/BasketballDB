var express = require('express');
var mysql = require("mysql");
var path = require('path');
var tableify = require('tableify');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', onInitialLoad);

app.get('/test', test);
app.get('/loadTableData', loadTestTable);

var connection = mysql.createConnection({
  host: "147.222.163.1",
  port: "3306",
  user: "rrozema",
  password: "rrozema69492485",
  database: "rrozema_DB"
});

function onInitialLoad(request, response) {
  response.sendFile(path.join(__dirname + '/index.html'));
}

function test(request, response) {
  response.sendFile(path.join(__dirname + '/public/test.html'));
}

function loadTestTable(request, response) {
    var result;
    connection.connect();
    console.log("Database connection successful.");

    var queryString = 'SELECT * FROM Country;';

    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        result = rows;
        connection.end();
        console.log("Database connection ended.");
        response.send(result);
        console.log("JSON data from the query has been sent.");

    });
}

app.listen(3000, function() {
  console.log("Our server is listening to localhost:3000");
});

/* Ending the connection on the database
con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
  if(err) console.log('err: ', err);
  else console.log('Terminated done: ');
});
*/
