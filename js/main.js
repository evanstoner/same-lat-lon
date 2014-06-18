var cities;

var LAT = 1;
var LON = 2;

$(function() {
  loadCities();
  $('#search').click(search_click);
});
  
function loadCities() {
  d3.json('data/cities-array.json', function(data) {
    // sort and store the cities
    cities = data.cities.sort(function(a, b) {
      if (a.city < b.city) {
        return -1;
      } else {
        return 1;
      }
    });
    
    // append an `option` for each city
    for (var i = 0; i < cities.length; i++) {
      var c = cities[i];
      $('#city').append('<option value="' + i + '">' + c.city + ' (' + c.lat + ', ' + c.lon + ')</option>'); 
    }
  });
}

function search_click(e) {
  // prevent form submission
  e.preventDefault();
  
  var city = cities[$('#city').val()];
  var dir = $('input:radio[name=direction]:checked').val();
  var distance = $('#distance').val();
  var foundCities;
  
  
  //TODO: error checking for distance
  
  if (dir === 'lat') {
    foundCities = findCities(city, LAT, distance);
  } else {
    foundCities = findCities(city, LON, distance); 
  }
  
  displayCities(foundCities);
}

function findCities(targetCity, direction, distance) {
  var filteredCities = cities.filter(function(city) {
    var targetLoc;
    var loc;
    
    if (direction === LAT) {
      targetLoc = targetCity.lat;
      loc = city.lat;
    } else {
      targetLoc = targetCity.lon;
      loc = city.lon;
    }
    
    if (Math.abs(targetLoc - loc) <= distance) {
      return true;
    } else {
      return false;
    }
  });
  return filteredCities;
}

function displayCities(cities) {
  $('#foundCities').empty();
  for (var i = 0; i < cities.length; i++) {
    var c = cities[i];
    console.log(c);
    $('#foundCities').append('<li>' + c.city + ' (' + c.lat + ', ' + c.lon + ')</li>');
  }
}