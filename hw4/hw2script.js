
var colors = {
    "grey":   "#bbbbbb",
    "blue":   "#377eb8",
    "purple": "#984ea3",
    "green":  "#4daf4a",
    "orange": "#ff7f00",
    "lightpink": "#fec0ff",
    "lightteal": "#b7fbf6",
    "black": "#000000",
    "darkpurple": "#6a5acd",
    "lavender": "#e6e6fa",
    "redorange": "#ff4500"
};


var genres = ["action", "animation", "comedy", "documentary", "drama", "romance"];

var budgets = [31505915, 27114378, 10511049, 797504, 9700095, 5343502];
var budgets_simp = budgets.map(function(x) { return Math.round(x/1000000); });


function create_dict(keys, values){
    var dict = {};
    for (var i = 0; i < keys.length; i++) {
        var genre = keys[i];
        var avg_budget = values[i];
        dict[genre] = avg_budget
    }
    return dict
}

var num_genres = genres.length;

var budget_by_genre = create_dict(genres, budgets_simp);

console.log(budget_by_genre);

var data = d3.entries(budget_by_genre);


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960/2 - margin.left - margin.right,
    height = 500/1.5 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)
    .domain(data.map(function(d) { return d.key; }));

var y = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, function(d) { return d.value; })]);

var formatAxis = d3.format('.0f');

var num_ticks = d3.max(data, function(d) { return d.value/5; });
console.log(num_ticks);

function make_y_axis(num_ticks, formatAxis) {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        // .tickFormat(formatxAxis)
        .ticks(num_ticks)
}

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatAxis)
        .ticks(num_ticks)
        //.tickSize(-width)
        .tickSize(4)
// .style("fill", colors.grey)
    ;

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Budget:</strong> <span style='color:white'>" + d.value + " million dollars" + "</span>";
    })

var svg = d3.select(".chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("text")      // text label for the x axis
    .attr("x", width / 2 )
    .attr("y",  height + margin.bottom + 0.5)
    .style("text-anchor", "middle")
    //.text("Genre")
;

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
;

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Avg. Budget (millions of dollars)");

var maxval = d3.max(data, function(d) { return d.value });

bars = svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .style("fill", colors.lavender)
;


bars.attr("class", "bar")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })  // change this to the line above if you dont want bars to grow:
;

svg.selectAll(".bar")
    .on('mouseover.tip', tip.show)
    .on('mouseout.tip', tip.hide)
;




