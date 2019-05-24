// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#svgreat";
var width = 960;
var height = 480;
var svg_primary_height = 200;
var svg_primary_width = 200;
var svg_primary_opacity = 1.0;
var svg_primary_fill = "#000000";
var svg_data = undefined;
var pattern_rotation_angle = 70;
var first_bg_color = "#6666ff";
var second_bg_color = "#009999";

d3.json("svgreat-data.json", function (error, data) {
    if (error) throw error;
    console.log(data);
    window.svg_data = data;
});

console.log(svg_data);

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

// The group which represent the entire svg: the properties modify each element in the group
var g = svg.append("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", click)
    // Rotate and translate (optional. The rotation has its axis in the top left corner)
    .attr("transform", "rotate(" + pattern_rotation_angle + ") translate(60,-300)");

// The different pieces of the svg: others can be added and controlled using the variables above
g.append("image")
    .attr("xlink:href", "plane-wings.svg")
    .style("opacity", svg_primary_opacity)
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);

g.append("image")
    .attr("xlink:href", "plane-tail.svg")
    .style("opacity", svg_primary_opacity)
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);

g.append("image")
    .attr("xlink:href", "plane-body.svg")
    .style("opacity", svg_primary_opacity)
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);

// Animate the background continuously 
function continousTransition() {
    d3.select("body").transition().duration(3000).style("background-color", first_bg_color)
        .on("end", function () {
            d3.select(this).transition().duration(3000).style("background-color", second_bg_color)
                .on("end", function () { continousTransition(); });
        });
}
continousTransition();

// Mouse over an svg of the pattern
function mouseover() {
    icon.transition("wiggle_in")
        .duration(750)
        .attr("x", "80")
        .attr("height", 300)
        .attr("width", 300);
}

// Mouse out of an svg of the pattern
function mouseout() {
    icon.transition("wiggle_out")
        .duration(750)
        .attr("x", img_x)
        .attr("height", img_height)
        .attr("width", img_width);
}

// Mouse click on an svg of the pattern
function click() {
    icon.transition("boom")
        .duration(1000)
        .style("opacity", 0);
}