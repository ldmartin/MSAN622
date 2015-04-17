/**
 * Created by laylamartin on 4/17/15.
 */
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

//var color = d3.scale.category10();
var color = d3.scale.ordinal().range(["#e7ba52", "#de9ed6", "#17becf"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(".chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//append title to chart:
var title = d3.select(".chart-title").text('State murder rate versus life expectancy by US region');

d3.csv("data/stateData6.csv", function(error, data) {
    data.forEach(function(d) {
        d.Murder = +d.Murder;
        d.LifeExp = +d.LifeExp;
    });

    x.domain(d3.extent(data, function(d) { return d.LifeExp; })).nice();
    //x.domain([0,100]).nice();

    y.domain(d3.extent(data, function(d) { return d.Murder; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Life Expectancy");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 8)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Murder Rate (per 100,000 Population)")

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        // remove border around dots:
        //.attr("class", "dot")
        .attr("r", 7)
        .attr("cx", function(d) { return x(d.LifeExp); })
        .attr("cy", function(d) { return y(d.Murder); })
        .style("fill", function(d) { return color(d.Region); });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

});
