/**
 * Created by laylamartin on 4/23/15.
 */

var margin__ = {top: 10, right: 10, bottom: 100, left: 40},
    margin2__ = {top: 430, right: 10, bottom: 20, left: 40},
    width__ = 960 - margin__.left - margin__.right,
    height__ = 500 - margin__.top - margin__.bottom,
    height2__ = 500 - margin2__.top - margin2__.bottom;

var parseDate__ = d3.time.format("%Y%m%d").parse,
    bisectDate__ = d3.bisector(function(d) { return d.date; }).left;

var title2 = d3.select(".chart-title3").text('A closer look at front seat versus rear seat deaths & injuries');

//var description2 = d3.select(".chart-description2").text('Brush a region below to zoom in on a specific time perion.');


var x__ = d3.time.scale().range([0, width__]),
    x2__ = d3.time.scale().range([0, width__]),
    y__ = d3.scale.linear().range([height__, 0]),
    y2__ = d3.scale.linear().range([height2__, 0]);

var xAxis__ = d3.svg.axis().scale(x__).orient("bottom"),
    xAxis2__ = d3.svg.axis().scale(x2__).orient("bottom"),
    yAxis__ = d3.svg.axis().scale(y__).orient("left");

var brush__ = d3.svg.brush()
    .x(x2__)
    .on("brush", brushed3);

var area__ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x__(d.date); })
    .y0(height__)
    .y1(function(d) { return y__(d.front); });


// delete here
var area3__ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x__(d.date); })
    .y0(height__)
    .y1(function(d) { return y__(d.rear); });
//


var area2__ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2__(d.date); })
    .y0(height2__)
    .y1(function(d) { return y2__(d.front); });

//delete here
var area4__ = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2__(d.date); })
    .y0(height2__)
    .y1(function(d) { return y2__(d.rear); });
//

var svg3 = d3.select(".chart3").append("svg")
    .attr("width", width__ + margin__.left + margin__.right)
    .attr("height", height__ + margin__.top + margin__.bottom);

svg3.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width__)
    .attr("height", height__);


var focus11 = svg3.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin__.left + "," + margin__.top + ")");

var context21 = svg3.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2__.left + "," + margin2__.top + ")");

d3.csv("data/seatbelts_inj.csv", type, function(error, data) {
    x__.domain(d3.extent(data.map(function(d) { return d.date; })));
    y__.domain([0, d3.max(data.map(function(d) { return d.front; }))]);
    // delete here
    //y3_.domain([0, d3.max(data.map(function(d) { return d.rear; }))]);
    //
    x2__.domain(x__.domain());
    y2__.domain(y__.domain());

    focus11.append("path")
        .datum(data)
        .attr("class", "area3")
        .attr("d", area__);

    // delete here
    focus11.append("path")
        .datum(data)
        .attr("class", "area4")
        .attr("d", area3__);
    //

    focus11.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height__ + ")")
        .call(xAxis__);

    focus11.append("g")
        .attr("class", "y axis")
        .call(yAxis__);

    context21.append("path")
        .datum(data)
        .attr("class", "area3")
        .attr("d", area2__);

    // delete here
    context21.append("path")
        .datum(data)
        .attr("class", "area4")
        .attr("d", area4__);
    //

    context21.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2__ + ")")
        .call(xAxis2__);

    context21.append("g")
        .attr("class", "x brush")
        .call(brush__)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2__ + 7);

    var focus2__ = svg3.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus2__.append("line")
        //.attr("r", 4.5)
        .attr("x1", 0)
        .attr("y1", -margin__.top - margin__.bottom)
        .attr("x2", 0)
        .attr("y2", height__ - margin__.top - 30)
        .style("stroke-width", 2)
        .style("stroke", "grey")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill", "none");

    focus2__.append("text")
        .attr("x", 9)
        .attr("y", -margin__.top - margin__.bottom)
        .attr("dy", ".35em");

    //svg3.append("rect")
    //    .attr("class", "overlay")
    //    .attr("width", width__)
    //    .attr("height", height__)
    //    .on("mouseover", function() { focus2__.style("display", null); })
    //    .on("mouseout", function() { focus2__.style("display", "none"); })
    //    .on("mousemove", mousemove3);

    //var time_format2 = d3.time.format("%B %Y");
    //
    //function mousemove3() {
    //    var x0 = x__.invert(d3.mouse(this)[0]),
    //        i = bisectDate__(data, x0, 1),
    //        d0 = data[i - 1],
    //        d1 = data[i],
    //        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //    focus2__.attr("transform", "translate(" + x__(d.date) + "," + 50+ ")");
    //    focus2__.select("text").text(
    //        //time_format2(d.date)
    //    )}
});

svg3.append("g")
    .attr("class", "y axis")
    .call(yAxis__)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin__.left + 8)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of people");

// add some white rectangle to cover up a random black line idk why it's being created...
var cover2 = svg3.append("rect")
    .attr("width",7)
    .attr("height",height__)
    .attr("x",0)
    .attr("y",0)
    .style("fill", "#FFFFFF");
    //.style("fill", "#00FFFF");

function brushed3() {
    x__.domain(brush__.empty() ? x2__.domain() : brush__.extent());
    focus11.select(".area3").attr("d", area__);
    focus11.select(".area4").attr("d", area3__);
    focus11.select(".x.axis").call(xAxis__);
}

function type(d) {
    d.date = parseDate__(d.date);
    d.front = +d.front;
    d.rear = +d.rear;
    return d;
}
