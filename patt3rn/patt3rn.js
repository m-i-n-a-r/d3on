// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#patt3rn";
var width = 960;
var height = 480;
var svg_primary_height = 100;
var svg_primary_width = 100;
var svg_primary_opacity = 0.6;
// The color is controlled directly in the svg files atm
var svg_primary_fill = "#eeeeee";
var pattern_rotation_angle = 70;
var first_bg_color = "#6666ff";
var second_bg_color = "#009999";

d3.json("patt3rn-data.json", function (error, data) {
    if (error) throw error;

    // The main container, it should scale to fit the screen div size
    var svg = d3.select(id_to_select).append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height);

    // The group which represent the entire svg: the properties modify each element in the group
    var g = svg.append("g")
        // The opacity is defined for the entire group to avoid overlapping of the various pieces
        .attr("opacity", svg_primary_opacity)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", click)
        // Rotate and translate (optional. The rotation has its axis in the top left corner)
        .attr("transform", "rotate(" + pattern_rotation_angle + ") translate(60,-200)");

    // The different pieces of the svg: others can be added and controlled using the variables above
    g.append("image")
        .attr("xlink:href", "plane-wings.svg")
        .attr("width", svg_primary_width)
        .attr("height", svg_primary_height);

    g.append("image")
        .attr("xlink:href", "plane-tail.svg")
        .attr("width", svg_primary_width)
        .attr("height", svg_primary_height);

    g.append("image")
        .attr("xlink:href", "plane-body.svg")
        .attr("width", svg_primary_width)
        .attr("height", svg_primary_height);

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
        g.transition("wiggle_in")
            .duration(750);
    }

    // Mouse out of an svg of the pattern
    function mouseout() {
        g.transition("wiggle_out")
            .duration(750);
    }

    // Mouse click on an svg of the pattern
    function click() {
        g.transition("boom")
            .duration(1000)
            .style("opacity", 0)
            .transition()
            .duration(10)
            .attr("width", 0);
    }
});