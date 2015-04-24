
var margin1 = {top1: 10, right1: 10, bottom1: 100, left1: 40},
    margin2 = {top1: 430, right1: 10, bottom1: 20, left1: 40},
    width1 = 960 - margin1.left1 - margin1.right1,
    height1 = 500 - margin1.top1 - margin1.bottom1,
    height21 = 500 - margin2.top1 - margin2.bottom1;

var parseDate = d3.time.format("%Y%m%d").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left1;

var title = d3.select(".chart-title2").text('A closer look at UK car deaths over time');


var x = d3.time.scale().range([0, width1]),
    x2 = d3.time.scale().range([0, width1]),
    y = d3.scale.linear().range([height1, 0]),
    y2 = d3.scale.linear().range([height21, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(height1)
    .y1(function(d) { return y(d.DriversKilled); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.date); })
    .y0(height21)
    .y1(function(d) { return y2(d.DriversKilled); });

var svg = d3.select(".chart2").append("svg")
    .attr("width", width1 + margin1.left1 + margin1.right1)
    .attr("height", height1 + margin1.top1 + margin1.bottom1);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width1)
    .attr("height", height1);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin1.left1 + "," + margin1.top1 + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left1 + "," + margin2.top1 + ")");

d3.csv("data/seatbelts2.csv", type, function(error, data) {
    x.domain(d3.extent(data.map(function(d) { return d.date; })));
    y.domain([0, d3.max(data.map(function(d) { return d.DriversKilled; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height21 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height21 + 7);

    var focus2 = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus2.append("line")
        //.attr("r", 4.5)
        .attr("x1", 0)
        .attr("y1", -margin1.top1 - margin1.bottom1)
        .attr("x2", 0)
        .attr("y2", height1 - margin1.top1 - 30)
        .style("stroke-width", 2)
        .style("stroke", "grey")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill", "none");

    focus2.append("text")
        .attr("x", 9)
        .attr("y", -margin1.top1 - margin1.bottom1)
        .attr("dy", ".35em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width1)
        .attr("height", height1)
        .on("mouseover", function() { focus2.style("display", null); })
        .on("mouseout", function() { focus2.style("display", "none"); })
        .on("mousemove", mousemove);

    var time_format = d3.time.format("%B %Y");

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus2.attr("transform", "translate(" + x(d.date) + "," + 50+ ")");
        focus2.select("text").text(
            //time_format(d.date)
            "hi"
        )}
});

function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
}

function type(d) {
    d.date = parseDate(d.date);
    d.DriversKilled = +d.DriversKilled;
    return d;
}
