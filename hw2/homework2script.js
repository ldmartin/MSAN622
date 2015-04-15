// Install these in order to generate the map:
// $ brew install gdal
// $ brew install node
// $ npm install -g topojson

// References:
// http://d3-geomap.github.io/map/choropleth/us-states/

d3.csv("data/stateData.csv", function(d) {
    return {
        name: d.name,
        abbrev: d.abbrev,
        pop: +d.pop,
        income: +d.income,
        illiteracy: +d.illiteracy,
        lifeExp: +d.lifeExp,
        murder: +d.murder,
        hsGrad: +d.hsGrad,
        frost: +d.frost,
        area: +d.area,
        region: d.region,
        division: d.division
    };
}, function(error, rows) {
    console.log(rows);
});













