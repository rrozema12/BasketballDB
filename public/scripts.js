// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

function sendInsertJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify([{ // T insert needs to have ([{}]) format for some weird reason
        player_id: document.getElementById("id").value,
        player_name: document.getElementById("name").value,
        age_drafted: document.getElementById("age").value,
        position: document.getElementById("position").value,
        country: document.getElementById("country").value,
        college_id: document.getElementById("college").value,
        start_year: document.getElementById("start").value,
        graduate_year: document.getElementById("end").value,
        round_drafted: document.getElementById("round").value,
        pick_number: document.getElementById("pick").value,
        team_code: document.getElementById("team").value
  }]);
  console.log(data);
  http.open("POST", "http://localhost:3000/loadTableData");


  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() { // Call a function when the state changes.
    if (http.readyState === 4 && http.status === 200) {
    }
    if (http.status === 500) {
      alert(http.responseText);
    }
  };
  http.send(data);
  window.open("http://localhost:3000/NBAData", "_self");
}

function sendUpdateJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify({
    player_id: document.getElementById("id-update").value,
    player_name: document.getElementById("name-update").value,
    age_drafted: document.getElementById("age-update").value,
    position: document.getElementById("position-update").value,
    country: document.getElementById("country-update").value,
    college_id: document.getElementById("college-update").value,
    start_year: document.getElementById("start-update").value,
    graduate_year: document.getElementById("end-update").value,
    round_drafted: document.getElementById("round-update").value,
    pick_number: document.getElementById("pick-update").value,
    team_code: document.getElementById("team-update").value
  });
  http.open("PUT", "http://localhost:3000/loadTableData");
  console.log(data);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() { // Call a function when the state changes.
    if (http.readyState === 4 && http.status === 200) {
    }
    if (http.status === 501) {
      alert(http.responseText);
    }

  };
  http.send(data);
  window.open("http://localhost:3000/NBAData", "_self");
}


function sendDeleteJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify({
        player_id: document.getElementById("id-delete").value,
  });
  http.open("DELETE", "http://localhost:3000/loadTableData");
  console.log(data);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() { // Call a function when the state changes.
    if (http.readyState === 4 && http.status === 200) {
    }
    if (http.status === 502) {
      alert(http.responseText);
    }
  };
  http.send(data);
  window.open("http://localhost:3000/NBAData", "_self");
}


$(document).ready(function() {
  var service = 'http://localhost:3000/';
  jQuery.support.cors = true;
  $.ajax({
    type: "GET",
    url: service + 'loadTableData',
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      console.log(data);
      // EXTRACT VALUE FOR HTML HEADER.
      var col = [];
      for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }

      // CREATE DYNAMIC TABLE.
      var table = document.getElementById("location");

      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

      var tr = table.insertRow(-1); // TABLE ROW.

      for (i = 0; i < col.length; i++) {
        var th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
      }

      // ADD JSON DATA TO THE TABLE AS ROWS.
      for (i = 0; i < data.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = data[i][col[j]];
        }
      }
    },

    error: function(msg) {
      alert(msg.responseText);
    }
  });
});
