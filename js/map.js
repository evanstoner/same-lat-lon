$(function() {
  var width = $(window).width(), //960,
      height = (width / 960) * 500;

  var projection = SLL.projection = d3.geo.equirectangular()
      .scale((width / 900) * 150)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = SLL.svg = d3.select("svg#map")
      .attr("width", width)
      .attr("height", height);

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  d3.json("data/world-50m.json", function(error, world) {
    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");
});