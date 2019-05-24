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

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

// The group which represent the entire svg: the properties modify each element in the group
var g = svg.append("g")
    .attr("x", 0)
    .attr("y", 0)
    //.on("mouseover", mouseover)
    //.on("mouseout", mouseout)
    //.on("click", click)

// The different pieces of the svg: others can be added and controlled using the variables above
g.append("image")
    .attr("xlink:href", "plane-wings.svg")
    .style("opacity", svg_primary_opacity)
    .attr("x", "40")
    .attr("y", "40")
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);

g.append("image")
    .attr("xlink:href", "plane-tail.svg")
    .style("opacity", svg_primary_opacity)
    .attr("x", "40")
    .attr("y", "40")
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);

g.append("image")
    .attr("xlink:href", "plane-body.svg")
    .style("opacity", svg_primary_opacity)
    .attr("x", "40")
    .attr("y", "40")
    .attr("width", svg_primary_width)
    .attr("height", svg_primary_height)
    .attr("fill", svg_primary_fill);