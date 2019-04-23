// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed
 
// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#sparky-icon";
var width = 960;
var height = 480;

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

    var icon = svg.append("image")
            .attr("xlink:href", "icon.png")
            .style("opacity", 1.0)
            .attr("x", "40")
            .attr("y", "40")
            .attr("width", "200")
            .attr("height", "200")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("click", click)

    function mouseover() {
        icon.transition("zoom_rect")
            .duration(750)
            .attr("x","80")
            .attr("height", 300)
            .attr("width", 300);
    }
    function mouseout() {
        icon.transition("dezoom_rect")
            .duration(750)
            .attr("x", "40")
            .attr("height", 200)
            .attr("width", 200);
    }
      
    // Action to take on mouse click
    function click() {
        icon.transition("highlight")
            .duration(500)
            .style("opacity", 0.5)
            .style("fill", "#ff0000")
            .transition("highlight2")
            .duration(500)
            .style("opacity", 1.0)
            .style("fill", "#ffffff");
    }