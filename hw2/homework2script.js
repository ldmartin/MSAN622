// Install these in order to generate the map:
// $ brew install gdal
// $ brew install node
// $ npm install -g topojson

// References:
// http://d3-geomap.github.io/map/choropleth/us-states/

var width = 960,
    height = 500;

var projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/d/4090846/us.json", function(error, us) {
  svg.insert("path", ".graticule")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && !(a.id / 1000 ^ b.id / 1000); }))
      .attr("class", "county-boundary")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "state-boundary")
      .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");












