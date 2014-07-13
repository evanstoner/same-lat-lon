var SLL = {};

var cities;

$(function() {
  loadCities();
  
  $('#closedBox').hide();
  
  $('#search').click(search_click);
  $('#hideBox').click(hideBox_click);
  $('#showBox').click(showBox_click);
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

  var g = SLL.svg.selectAll('g.city').data(cities)
      
  
  // create new `g` container elements for the city point and label
  var enter = g.enter().append('g').attr('class', 'city');
  
  var newCircles = enter.append('circle')
      .attr('r', 5)
      .attr('cx', 0)
      .attr('cy', 0);
  
  // set/update the position of the `g`s
  g.attr('transform', function(d) { 
    var xy = SLL.projection([d.lon, d.lat]);
    return 'translate(' + xy[0] + ',' + xy[1] + ')';
  }).sort(function(a, b) { return b.lon - a.lon; }) // avoid text appearing under circles by placing right to left
      .order();
  
  // show/hide the city name on mouseover/out
  newCircles.on('mouseover', function(d) {
    // add the text and fade it in
    var parent = d3.select(this.parentNode);
    
    parent.append('text')
      .text(d.city)
      .attr('class', 'shadow')
      .attr('x', 13)
      .attr('dy', 5)
      .attr('opacity', 0);
    
    parent.append('text')
      .text(d.city)
      .attr('x', 13)
      .attr('dy', 5)
      .attr('opacity', 0);
    
    parent.selectAll('text')
      .transition().attr('opacity', 1)
    
    // expand the cirlce
    d3.select(this).transition().attr('r', 8).ease('elastic');
  }).on('mouseout', function() {
    // remove the text
    d3.select(this.parentNode).selectAll('text')
      .transition().attr('opacity', 0).remove();
    
    // contract the circle
    d3.select(this).transition().attr('r', 5).ease('elastic');
    
  });
  
  // remove extra `g`s
  g.exit().remove();
}

function hideBox_click() {
  var width = $('#searchBox').width()
  var height = $('#searchBox').outerHeight()
  $('#closedBox').css({ width: width, top: -height + 'px' });
  $('#searchBox').animate({ top: -height + 'px' }, 200, function() {
    $('#closedBox').show().animate({ top: '0px' }, 200);
  });
}

function showBox_click() {
  var height = $('#searchBox').outerHeight()
  $('#closedBox').animate({ top: -height + 'px' }, 200, function() {
    $('#searchBox').animate({ top: '0px' }, 200);
  });
}