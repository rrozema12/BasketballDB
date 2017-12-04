// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

function sendInsertJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify([{ // T insert needs to have ([{}]) format for some weird reason
        code: document.getElementById("code").value,
        country_name: document.getElementById("name").value,
        gdp: document.getElementById("gdp").value,
        inflation: document.getElementById("inflation").value
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
  document.location.reload();
}

function sendUpdateJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify({
        code: document.getElementById("update-code").value,
        country_name: document.getElementById("update-name").value,
        gdp: document.getElementById("update-gdp").value,
        inflation: document.getElementById("update-inflation").value
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
  document.location.reload();
}


function sendDeleteJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify({
        code: document.getElementById("delete-code").value,
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
  document.location.reload();
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
