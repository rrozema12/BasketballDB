var express = require('express');
var mysql = require("mysql");
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', onInitialLoad);

function onInitialLoad(request, response) {
  response.sendFile(path.join(__dirname + '/../index.html'));
}

app.listen(3000, function() {
  console.log("Our server is listening to localhost:3000");
});


/*
// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "147.222.163.1",
  port: "3306",
  user: "rrozema",
  password: "rrozema69492485",
  database: "rrozema_DB"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
  if(err) console.log('err: ', err);
  else console.log('Terminated done: ');
});
*/
