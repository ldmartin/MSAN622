/**
 * Created by laylamartin on 4/23/15.
 */

var margin_ = {top: 10, right: 10, bottom: 100, left: 40},
    margin2_ = {top: 430, right: 10, bottom: 20, left: 40},
    width_ = 960 - margin_.left - margin_.right,
    height_ = 500 - margin_.top - margin_.bottom,
    height2_ = 500 - margin2_.top - margin2_.bottom;

var parseDate_ = d3.time.format("%Y%m%d").parse,
    bisectDate_ = d3.bisector(function(d) { return d.date; }).left;

var title2 = d3.select(".chart-title2").text('A closer look at car drivers versus van drivers killed');

//var description2 = d3.select(".chart-description2").text('Brush a region below to zoom in on a specific time perion.');


var x_ = d3.time.scale().range([0, width_]),
    x2_ = d3.time.scale().range([0, width_]),
    y_ = d3.scale.linear().range([height_, 0]),
    y2_ = d3.scale.linear().range([height2_, 0]);

var xAxis_ = d3.svg.axis().scale(x_).orient("bottom"),
    xAxis2_ = d3.svg.axis().scale(x2_).orient("bottom"),
    yAxis_ = d3.svg.axis().scale(y_).orient("left");

var brush_ = d3.svg.brush()
    .x(x2_)
    .on("brush", brushed2);

var area_ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x_(d.date); })
    .y0(height_)
    .y1(function(d) { return y_(d.DriversKilled); });


// delete here
var area3_ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x_(d.date); })
    .y0(height_)
    .y1(function(d) { return y_(d.VanKilled); });
//


var area2_ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2_(d.date); })
    .y0(height2_)
    .y1(function(d) { return y2_(d.DriversKilled); });

//delete here
var area4_ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2_(d.date); })
    .y0(height2_)
    .y1(function(d) { return y2_(d.VanKilled); });
//

var svg2 = d3.select(".chart2").append("svg")
    .attr("width", width_ + margin_.left + margin_.right)
    .attr("height", height_ + margin_.top + margin_.bottom);

svg2.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width_)
    .attr("height", height_);


var focus1 = svg2.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin_.left + "," + margin_.top + ")");

var context2 = svg2.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2_.left + "," + margin2_.top + ")");

d3.csv("data/seatbelts_killed.csv", type, function(error, data) {
    x_.domain(d3.extent(data.map(function(d) { return d.date; })));
    y_.domain([0, d3.max(data.map(function(d) { return d.DriversKilled; }))]);
    // delete here
    //y3_.domain([0, d3.max(data.map(function(d) { return d.VanKilled; }))]);
    //
    x2_.domain(x_.domain());
    y2_.domain(y_.domain());

    focus1.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area_);

    // delete here
    focus1.append("path")
        .datum(data)
        .attr("class", "area2")
        .attr("d", area3_);
    //

    focus1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_ + ")")
        .call(xAxis_);

    focus1.append("g")
        .attr("class", "y axis")
        .call(yAxis_);

    context2.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2_);

    // delete here
    context2.append("path")
        .datum(data)
        .attr("class", "area2")
        .attr("d", area4_);
    //

    context2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2_ + ")")
        .call(xAxis2_);

    context2.append("g")
        .attr("class", "x brush")
        .call(brush_)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2_ + 7);

    var focus2_ = svg2.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus2_.append("line")
        //.attr("r", 4.5)
        .attr("x1", 0)
        .attr("y1", -margin_.top - margin_.bottom)
        .attr("x2", 0)
        .attr("y2", height_ - margin_.top - 30)
        .style("stroke-width", 2)
        .style("stroke", "grey")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill", "none");

    focus2_.append("text")
        .attr("x", 9)
        .attr("y", -margin_.top - margin_.bottom)
        .attr("dy", ".35em");

    //svg2.append("rect")
    //    .attr("class", "overlay")
    //    .attr("width", width_)
    //    .attr("height", height_)
    //    .on("mouseover", function() { focus2_.style("display", null); })
    //    .on("mouseout", function() { focus2_.style("display", "none"); })
    //    .on("mousemove", mousemove2);

    //var time_format2 = d3.time.format("%B %Y");
    //
    //function mousemove2() {
    //    var x0 = x_.invert(d3.mouse(this)[0]),
    //        i = bisectDate_(data, x0, 1),
    //        d0 = data[i - 1],
    //        d1 = data[i],
    //        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //    focus2_.attr("transform", "translate(" + x_(d.date) + "," + 50+ ")");
    //    focus2_.select("text").text(
    //        //time_format2(d.date)
    //    )}
});

svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis_)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin_.left + 8)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of people");

// add some white rectangle to cover up a random black line idk why it's being created...
var cover = svg2.append("rect")
    .attr("width",10)
    .attr("height",height_)
    .attr("x",0)
    .attr("y",0)
    .style("fill", "#FFFFFF");
    //.style("fill", "#00FFFF");

function brushed2() {
    x_.domain(brush_.empty() ? x2_.domain() : brush_.extent());
    focus1.select(".area").attr("d", area_);
    focus1.select(".area2").attr("d", area3_);
    focus1.select(".x.axis").call(xAxis_);
}

function type(d) {
    d.date = parseDate_(d.date);
    d.DriversKilled = +d.DriversKilled;
    d.VanKilled = +d.VanKilled;
    return d;
}
