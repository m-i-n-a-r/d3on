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

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

d3.json("patt3rn-data.json", function (error, data) {
    if (error) throw error;

    for (i in data) {
        var svg_number = "g" + i;
        console.log(i);
        // The group which represent the entire svg: the properties modify each element in the group
        var g = svg.append("g")
            // The opacity is defined for the entire group to avoid overlapping of the various pieces
            .style("opacity", svg_primary_opacity)
            .attr("class", "pattern")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click)
            // Rotate and translate (optional. The rotation has its axis in the top left corner)
            .attr("transform", "rotate(" + pattern_rotation_angle + ") translate(" + data[i][2]['value'] + "," + data[i][3]['value'] + ")");

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
    }
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
    // Pattern svgs
    d3.selectAll(".pattern").transition("pattern_in").duration(1000).style("opacity", 0)
        .on("end", function () {
            d3.selectAll(".pattern").transition("pattern_out").duration(1000).style("opacity", 1)
                .on("end", function () { continuousTransitionPattern(); });
        });
}

continuousTransitionPattern();
continuousTransitionBackground();
