// In your Javascript (external .js resource or <script> tag)
$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

var elements = $(document).find('select.form-control');
for (var i = 0, l = elements.length; i < l; i++) {
  var $select = $(elements[i]), $label = $select.parents('.form-group').find('label');

  $select.select2({
    allowClear: false,
    placeholder: $select.data('placeholder'),
    minimumResultsForSearch: 0,
    theme: 'bootstrap',
		width: '100%' // https://github.com/select2/select2/issues/3278
  });

  // Trigger focus
  $label.on('click', function (e) {
    $(this).parents('.form-group').find('select').trigger('focus').select2('focus');
  });

  // Trigger search
  $select.on('keydown', function (e) {
    var $select = $(this), $select2 = $select.data('select2'), $container = $select2.$container;

    // Unprintable keys
    if (typeof e.which === 'undefined' || $.inArray(e.which, [0, 8, 9, 12, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 44, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123, 124, 144, 145, 224, 225, 57392, 63289]) >= 0) {
      return true;
    }

    // Opened dropdown
    if ($container.hasClass('select2-container--open')) {
      return true;
    }

    $select.select2('open');

    // Default search value
    var $search = $select2.dropdown.$search || $select2.selection.$search, query = $.inArray(e.which, [13, 40, 108]) < 0 ? String.fromCharCode(e.which) : '';
    if (query !== '') {
      $search.val(query).trigger('keyup');
    }
  });

  // Format, placeholder
  $select.on('select2:open', function (e) {
		var $select = $(this), $select2 = $select.data('select2'), $dropdown = $select2.dropdown.$dropdown || $select2.selection.$dropdown, $search = $select2.dropdown.$search || $select2.selection.$search, data = $select.select2('data');

    // Above dropdown
    if ($dropdown.hasClass('select2-dropdown--above')) {
      $dropdown.append($search.parents('.select2-search--dropdown').detach());
    }

    // Placeholder
    $search.attr('placeholder', (data[0].text !== '' ? data[0].text : $select.data('placeholder')));
  });
}


function sendInsertJSON(){

  var http = new XMLHttpRequest();
  var data = JSON.stringify([{
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
})
