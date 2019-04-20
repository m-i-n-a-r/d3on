// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed
 
// Some useful variables
var id_to_select = "#fancy-s3t";
var border = 4;
var border_radius = 10;
var background_color = "#00ff00";
var border_color = "#000000"
var opacity = "0.0";
var width = 960;
var height = 500;

var svg = d3.select(id_to_select).append("svg")
    .attr("width", width)
    .attr("height", height);

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
    .distance(70) // Minimum distance between linked nodes
    .charge(-80) // How much a node repulse the others
    .size([width, height]); // Area where the force is active

// Load the json file containing the graph. This can't be done locally without an httpserver
// Refer to https://stackoverflow.com/questions/17214293/importing-local-json-file-using-d3-json-does-not-work
d3.json("graph.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  // The image used to represent a node
  node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

  // The label of each node
  node.append("text")
      .attr("dx", 0) // Distance from the center of the node
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
