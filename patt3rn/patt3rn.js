// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#patt3rn";
var width = 960;
var height = 480;
var svg_primary_height = 100;
var svg_primary_width = 100;
var svg_primary_opacity = 0.4;
// The color is controlled directly in the svg files atm
var svg_primary_fill = "#eeeeee";
var pattern_rotation_angle = 70;
var first_bg_color = "#6666ff";
var second_bg_color = "#009999";
var pattern_svgs = [];

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

var pattern = svg.append("g")
    .attr("class", "pattern");

d3.json("patt3rn-data.json", function (error, data) {
    if (error) throw error;

    // Using a forEach instead of a simple for is mandatory to avoid redefining everything in each iteration
    data.forEach(function (d, i) {
        // The group which represent the entire svg: the properties modify each element in the group
        pattern_svgs[i] = pattern.append("g")
            // The opacity is defined for the entire group to avoid overlapping of the various pieces
            .style("opacity", svg_primary_opacity)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click)
            // Rotate and translate (optional. The rotation has its axis in the top left corner)
            .attr("transform", "rotate(" + pattern_rotation_angle + ") translate(" + data[i][2]['value'] + "," + data[i][3]['value'] + ")");

        // The different pieces of the svg: others can be added and controlled using the variables above
        pattern_svgs[i].append("image")
            .attr("xlink:href", "plane-wings.svg")
            // Example of parameter taken from the json
            // The scaling isn't from the center, and the image needs to be translated to the right to be centered
            .attr("width", data[i][4]['value'])
            .attr("x", (svg_primary_width - data[i][4]['value']) / 2)
            .attr("height", svg_primary_height);

        pattern_svgs[i].append("image")
            .attr("xlink:href", "plane-tail.svg")
            .attr("width", svg_primary_width)
            .attr("height", svg_primary_height);

        pattern_svgs[i].append("image")
            .attr("xlink:href", "plane-body.svg")
            .attr("width", svg_primary_width)
            .attr("height", svg_primary_height);

    });
});

// Animate the background and the pattern svgs continuously 
function continuousTransitionBackground() {
    // Background
    d3.select("body").transition("background_in").duration(3000).style("background-color", first_bg_color)
        .on("end", function () {
            d3.select(this).transition("background_out").duration(3000).style("background-color", second_bg_color)
                .on("end", function () { continuousTransitionBackground(); });
        });
}

function continuousTransitionPattern() {
    // Pattern svgs: to modify g elements, a transformation is needed
    d3.selectAll(".pattern").transition("pattern_in").duration(10000)
        .attr("transform", "translate(" + 400 + "," + -100 + ")")
        .on("end", function () {
            d3.select(this).transition("pattern_out").duration(10000)
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .on("end", function () { continuousTransitionPattern(); });
        });
}

// Mouse over an svg of the pattern
function mouseover() {
    d3.select(this).transition("wiggle_in")
        .duration(750)
        .style("opacity", 1);
}

// Mouse out of an svg of the pattern
function mouseout() {
    d3.select(this).transition("wiggle_out")
        .duration(750)
        .style("opacity", svg_primary_opacity);
}

// Mouse click on an svg of the pattern
function click() {
    d3.select(this).transition("boom")
        .duration(1000)
        .style("opacity", 0)
        .transition()
        .duration(10)
        .attr("width", 0);
}

// Animate the pattern after a certain time
setTimeout(continuousTransitionPattern, 1500);
continuousTransitionBackground();
