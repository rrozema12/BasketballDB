function sendInsertJSON() {

  var http = new XMLHttpRequest();
  var data = JSON.stringify([{ // Insert needs to have ([{}])
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
    if (http.readyState === 4 && http.status === 200) {}
    if (http.status === 500) {
      alert(http.responseText);
    }
  };
  http.send(data);
  window.open("http://localhost:3000/", "_self");
}

function sendUpdateJSON() {

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
    if (http.readyState === 4 && http.status === 200) {}
    if (http.status === 501) {
      alert(http.responseText);
    }

  };
  http.send(data);
  window.open("http://localhost:3000/", "_self");
}


function sendDeleteJSON() {

  var http = new XMLHttpRequest();
  var data = JSON.stringify({
    player_id: document.getElementById("id-delete").value,
  });
  http.open("DELETE", "http://localhost:3000/loadTableData");
  console.log(data);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() { // Call a function when the state changes.
    if (http.readyState === 4 && http.status === 200) {}
    if (http.status === 502) {
      alert(http.responseText);
    }
  };
  http.send(data);
  window.open("http://localhost:3000/", "_self");
}

$("document").ready(function() {
  document.getElementById("update").style.display ="none";
  $("#mainselect").change(function() {
    console.log("test");
    var service = 'http://localhost:3000/';
    jQuery.support.cors = true;
    var e = document.getElementById("mainselect");
    var test = e.options[e.selectedIndex].value;
    console.log(test);
    $("#button").click(function() {
      document.getElementById("querypicker").style.display = "none";
      document.getElementById("position").style.display = "none";
      document.getElementById("country").style.display = "none";
      document.getElementById("colleges1").style.display = "none";
      document.getElementById("colleges2").style.display = "none";
      document.getElementById("button").style.display = "none";
      document.getElementById("header").innerHTML = "BasketballDB";
      if (test == "query1") {
        var e = document.getElementById("countryselect");
        var country = e.options[e.selectedIndex].value;
        console.log(country);
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/country/' + country,
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            //alert(jsondata);
            var txt = '';
            data = JSON.parse(jsondata);
            console.log(jsondata);
            //alert("data" + data);
            txt += "<tr><th>player_name</th><th>country</th></tr>";
            for (var j in data) {
              txt += "<tr><td>" + data[j].player_name + "</td><td>" + data[j].country + "</td></tr>";
            }
            //alert(txt);
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);

          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query2") {
        var x = document.getElementById("positionselect");
        var position = x.options[x.selectedIndex].value;
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/position/' + position,
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>player_name</th><th>field_goal_pct</th><th>position</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].player_name + "</td><td>" + data[j].field_goal_pct + "</td><td>" + data[j].position + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query3") {
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/topPicks/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>team_name</th><th>first_picks</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].team_name + "</td><td>" + data[j].first_picks + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query4") {
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/bestColleges/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>college_name</th><th>first_picks</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].college_name + "</td><td>" + data[j].first_picks + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query5") {
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/mostGamesPlayed/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>college_name</th><th>games_played</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].college_name + "</td><td>" + data[j].games_played + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query6") {
        var a = document.getElementById("firstcollege");
        var firstcollege = a.options[a.selectedIndex].value;
        var b = document.getElementById("secondcollege");
        var secondcollege = b.options[b.selectedIndex].value;
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/collegeOne/' + firstcollege + '/collegeTwo/' + secondcollege,
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>player_name</th><th>college_name</th><th>points</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].player_name + "</td><td>" + data[j].college_name + "</td><td>" + data[j].points + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query7") {
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/multipleDrafts/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>player_name</th><th>times_drafted</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].player_name + "</td><td>" + data[j].times_drafted + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query8") {
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/longestCareers/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>player_name</th><th>career_length</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].player_name + "</td><td>" + data[j].career_length + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      } else if (test == "query9") {
        document.getElementById("update").style.display = "";
        $.ajax({
          type: "GET",
          url: service + 'loadTableData/allPlayers/',
          contentType: "application/json; charset=utf-8",
          success: function(data) {
            jsondata = JSON.stringify(data);
            var txt = '';
            data = JSON.parse(jsondata);
            txt += "<tr><th>player_id</th><th>player_name</th><th>age_drafted</th>" +
              "<th>position</th><th>country</th><th>college_id</th>" +
              "<th>from_year</th><th>to_year</th><th>round</th>" +
              "<th>pick_number</th><th>team_code</th></tr>";

            for (var j in data) {
              txt += "<tr><td>" + data[j].player_id + "</td><td>" + data[j].player_name + "</td><td>" +
                data[j].age_drafted + "</td><td>" + data[j].position + "</td><td>" + data[j].country +
                "</td><td>" + data[j].college_id + "</td><td>" + data[j].from_year +
                "</td><td>" + data[j].to_year + "</td><td>" + data[j].round + "</td><td>" + data[j].pick_number +
                "</td><td>" + data[j].team_code + "</td></tr>";
            }
            newtxt = txt;
            var template = $("#tableData").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
              tableData: txt
            });
            $("#location").html(rendered);
            console.log(document.getElementById("location").innerHTML);
          },

          error: function(msg) {
            alert(msg.responseText);
          }
        });
      }
    });
    $("#reset").click(function() {
      location.reload();
      document.getElementById("querypicker").style.display = "";
    });

    $("#update").click(function() {
      window.open("http://localhost:3000/updateNBAData", "_self");
    });

  });
});

function queryselection(selectObject) {
  var value = selectObject.value;
  if (value == "query1") {
    document.getElementById("position").style.display = "none";
    document.getElementById("country").style.display = "";
    document.getElementById("colleges1").style.display = "none";
    document.getElementById("colleges2").style.display = "none";
  } else if (value == "query2") {
    document.getElementById("position").style.display = "";
    document.getElementById("country").style.display = "none";
    document.getElementById("colleges1").style.display = "none";
    document.getElementById("colleges2").style.display = "none";
  } else if (value == "query6") {
    document.getElementById("position").style.display = "none";
    document.getElementById("country").style.display = "none";
    document.getElementById("colleges1").style.display = "";
    document.getElementById("colleges2").style.display = "";
  } else {
    document.getElementById("position").style.display = "none";
    document.getElementById("country").style.display = "none";
    document.getElementById("colleges1").style.display = "none";
    document.getElementById("colleges2").style.display = "none";
  }
}
