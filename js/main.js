var SLL = {};

var cities;

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
  
  foundCities = findCities(city, distance);
  
  displayCities(foundCities);
}

function findCities(targetCity, distance) {
  var filteredCities = cities.filter(function(city) {
    if (Math.abs(targetCity.lat - city.lat) <= distance || Math.abs(targetCity.lon - city.lon) <= distance) {
      return true;
    } else {
      return false;
    }
  });
  return filteredCities;
}

function displayCities(cities) {
  console.log(cities);

  var g = SLL.svg.selectAll('g.city').data(cities);
  
  // create new `g` elements for the city point and label
  var enter = g.enter().append('g').attr('class', 'city');
  
  enter.append('circle')
      .attr('r', 5)
      .attr('cx', 0)
      .attr('cy', 0);
  
  enter.append('text')
      .attr('x', 10)
      .attr('dy', 5);
  
  // set the position of the new and existing `g`s
  g.attr('transform', function(d) { 
    var xy = SLL.projection([d.lon, d.lat]);
    return 'translate(' + xy[0] + ',' + xy[1] + ')';
  });
  
  g.selectAll('text')
      .text(function(d) { return d.city; });
  
  // remove extra `g`s
  g.exit().remove();
}