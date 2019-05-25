// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#sparky-icon";
var width = 960;
var height = 480;
var img_x = 40;
var img_y = 40;
var img_width = 200;
var img_height = 200;

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

var icon = svg.append("image")
    .attr("xlink:href", "icon.png")
    .style("opacity", 1.0)
    .attr("x", img_x)
    .attr("y", img_y)
    .attr("width", img_width)
    .attr("height", img_height)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", click)

// Mouse over the image
function mouseover() {
    icon.transition("zoom_rect")
        .duration(750)
        .attr("x", "80")
        .attr("height", 250)
        .attr("width", 250);
}

// Mouse out of the image
function mouseout() {
    icon.transition("dezoom_rect")
        .duration(750)
        .attr("x", img_x)
        .attr("height", img_height)
        .attr("width", img_width);
}

// Mouse click
function click() {
    icon.transition("highlight")
        .duration(500)
        .style("opacity", 0.5)
        .transition("highlight2")
        .duration(500)
        .style("opacity", 1.0);
}