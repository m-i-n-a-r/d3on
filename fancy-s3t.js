// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

var width = window.innerWidth,
  height = window.innerHeight;

var svg = d3.select("#fancy-s3t").append("svg")
  .attr("width", width)
  .attr("height", height);

var nodes_data = [
  { "name": "Travis", "sex": "M" },
  { "name": "Rake", "sex": "M" },
  { "name": "Diana", "sex": "F" },
  { "name": "Rachel", "sex": "F" },
  { "name": "Shawn", "sex": "M" },
  { "name": "Emerald", "sex": "F" }
]

// Set up the simulation 
// Nodes only for now 
var simulation = d3.forceSimulation()
  // Add nodes
  .nodes(nodes_data);

// Add forces
// we're going to add a charge to each node 
// Also going to add a centering force
simulation
  .force("charge_force", d3.forceManyBody())
  .force("center_force", d3.forceCenter(width / 2, height / 2));

// Draw circles for the nodes 
var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes_data)
  .enter()
  .append("circle")
  .attr("r", 5)
  .attr("fill", "red");

// Add tick instructions: 
simulation.on("tick", tickActions);

// Create links data 
var links_data = [
  { "source": "Travis", "target": "Rake" },
  { "source": "Diana", "target": "Rake" },
  { "source": "Diana", "target": "Rachel" },
  { "source": "Rachel", "target": "Rake" },
  { "source": "Rachel", "target": "Shawn" },
  { "source": "Emerald", "target": "Rachel" }
]

// Create the link force 
// We need the id accessor to use named sources and targets 

var link_force = d3.forceLink(links_data)
  .id(function (d) { return d.name; })

// Add a links force to the simulation
// Specify links  in d3.forceLink argument   
simulation.force("links", link_force)

// Draw lines for the links 
var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links_data)
  .enter().append("line")
  .attr("stroke-width", 2);

function tickActions() {
  // Update circle positions each tick of the simulation 
  node
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; });

  // update link positions 
  // Simply tells one end of the line to follow one node around
  // And the other end of the line to follow the other node around
  link
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

}

