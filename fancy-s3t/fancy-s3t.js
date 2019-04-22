// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed
 
// Some useful variables, all in the same place to simplify the configuration
// By default, the nodes contain a text on a rounded rectangle, and the rest is commented
var id_to_select = "#fancy-s3t";

var border = 3;
var border_radius = 10;
var background_color = "#00ff00";
var border_color = "#000000";
var opacity = "0.0";

var node_rect_height = 24;
var node_rect_width = 80;
var node_rect_corners = 6;
var node_rect_border = 3;
var node_rect_border_color = "#00ff00";
var node_rect_color = "#44dd44";

var node_circle_radius = 28;
var node_circle_border = 3;
var node_circle_border_color = "#00ff00";
var node_circle_color = "#44dd44";

var node_text_color = "#ffffff";
var node_text_color_alt = "#0000ff";

var circle_rect_boundaries = 0; // 0 if rectangles are being used or 1 if circle are being used

var width = 960;
var height = 480;

// The main container, it should scale to fit the screen div size
var svg = d3.select(id_to_select).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

// The border of the graph, to make it more consistent 
var borderPath = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", border_radius)
    .attr("ry", border_radius)
    .attr("height", height)
    .attr("width", width)
    .attr("fill", "none")
    .style("stroke", border_color)
    .style("stroke-width", border);

// The background of the graph    
var bgPath = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", border_radius)
    .attr("ry", border_radius)
    .attr("height", height)
    .attr("width", width)
    .attr("opacity", opacity)
    .style("fill", background_color);

var force = d3.layout.force()
    .gravity(0.05) // Defines the cohesion force between the nodes
    .distance(90) // Minimum distance between linked nodes
    .charge(-90) // How much a node repulse the others
    .linkDistance(100) // Length of the link line
    .size([width, height]); // Area where the force is active

// Load the json file containing the graph. This can't be done locally without an httpserver
// Refer to https://stackoverflow.com/questions/17214293/importing-local-json-file-using-d3-json-does-not-work
d3.json("graph.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .on("tick", tick)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");
  
  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click)
      .call(force.drag);

  // Image as node background
  /*node.append("image")
      .attr("xlink:href", "https://direct.link.to.image")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);*/

  // Rectangle as node background
  node.append("rect")
      .attr("x", (node_rect_width - (node_rect_width * 2)) / 2)
      .attr("y", (node_rect_height - (node_rect_height * 2)) / 2)
      .attr("height", node_rect_height)
      .attr("width", node_rect_width)
      .attr("rx", node_rect_corners)
      .attr("ry", node_rect_corners)
      .attr("fill", node_rect_color)
      .style("stroke", node_rect_border_color)
      .style("stroke-width", node_rect_border);

  // Circle as node background
  /*node.append("circle")
      .attr("r", node_circle_radius)
      .attr("fill", node_circle_color)
      .style("stroke", node_circle_border_color)
      .style("stroke-width", node_circle_border);*/

  // The label of each node
  node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", node_text_color)
      .attr("font-size", "0.8em")
      .text(function(d) { return d.name });

  // This function bounds the node inside the container, since there's no point in dragging them outside
  function tick() {
      node.attr("transform", function(d) {
          if (circle_rect_boundaries == 0) {
              var border_width = node_rect_width / 2 + 3;
              var border_height = node_rect_height / 2 + 3;
          }
          else { 
              var border_width = node_circle_radius + 3;
              var border_height = node_circle_radius + 3;
          }
          d.x = Math.max(border_width, Math.min(width - border_width, d.x));
          d.y = Math.max(border_height, Math.min(height - border_height, d.y));
          return "translate(" + d.x + "," + d.y + ")"
  });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  // The rectangle grows a bit when the mouse is over it
  function mouseover() {
      let new_height = node_rect_height + node_rect_height / 4;
      let new_width = node_rect_width + node_rect_width / 4
      d3.select(this).select("rect").transition()
        .duration(750)
        .attr("height", new_height)
        .attr("width", new_width)
        .attr("x", (new_width - (new_width * 2)) / 2)
        .attr("y", (new_height - (new_height * 2)) / 2);
      d3.select(this).select("text").transition()
        .duration(750)
        .attr("font-size", "1.0em")
        .style("font-weight", "bold")
  }
  function mouseout() {
      d3.select(this).select("rect").transition()
          .duration(750)
          .attr("height", node_rect_height)
          .attr("width", node_rect_width)
          .attr("x", (node_rect_width - (node_rect_width * 2)) / 2)
          .attr("y", (node_rect_height - (node_rect_height * 2)) / 2);
      d3.select(this).select("text").transition()
          .duration(750)
          .attr("font-size", "0.8em")
          .style("font-weight", "bold")
  }

  // Same, but for circles
  /*function mouseover() {
      d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", node_circle_radius + 10);
  }
  function mouseout() {
      d3.select(this).select("circle").transition()
          .duration(750)
          .attr("r", node_circle_radius + 10);
  }*/

  // Action to take on mouse click
  function click() {
      d3.select(this).select("text").transition("highlight1")
          .duration(500)
          .style("opacity", 0.5)
          .style("fill", node_text_color_alt)
          .transition("highlight2")
          .duration(500)
          .style("opacity", 1.0)
          .style("fill", node_text_color);
}

});