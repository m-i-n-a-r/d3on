// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#rad3ar";
var width = 450;
var height = 450;
var padding_height = 20;
var padding_width = 0;
var data_colors = ["#ff3300", "#ff9900", "#cccc00", "#669900", "#00cc00", "#00cc99", "#006699", "#6600ff", "#cc00ff", "#ff3399"];
var detail_levels = 10; // Number of guidelines in the chart for each sector
var factor = 1;
var factor_legend = .85;
var radians = 2 * Math.PI;
var opacity_area = 0.4; // The opacity of each area 
var legend_to_right = 10; // Horizontal translation for the legend labels
var label_translate_y = -16; // Vertical translation for the axis labels
var translate_x = (width / 2) ;
var translate_y = 30;
var color = d3.scaleOrdinal().range(data_colors);
var vertex_radius = 4;
var vertex_stroke_color = "#000000";
var vertex_stroke = 1;
var legend_font_color = "#111111";
var max_value = 100; // Max possible value for a data point attribute

// Draw the star chart
d3.json("data-points.json", function (error, data) {
    if (error) throw error;
    star_chart.draw(id_to_select, data);
});

var svg = d3.select(id_to_select)
    .selectAll("svg")
    .append("svg");

var star_chart = {
    draw: function (id, d) {
        var all_axis = (d[0].map(function (i, j) { return i.axis }));
        var total = all_axis.length;
        var radius = factor * Math.min(width / 2, height / 2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 " + ((width * 2) + padding_width) + " " + (height + padding_height))
            .append("g")
            .attr("transform", "translate(" + translate_x + "," + translate_y + ")");

        var tooltip;

        // Segments for each detail level
        for (var j = 0; j < detail_levels; j++) {
            var level_factor = factor * radius * ((j + 1) / detail_levels);
            g.selectAll(".detail_levels")
                .data(all_axis)
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) { return level_factor * (1 - factor * Math.sin(i * radians / total)); })
                .attr("y1", function (d, i) { return level_factor * (1 - factor * Math.cos(i * radians / total)); })
                .attr("x2", function (d, i) { return level_factor * (1 - factor * Math.sin((i + 1) * radians / total)); })
                .attr("y2", function (d, i) { return level_factor * (1 - factor * Math.cos((i + 1) * radians / total)); })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (width / 2 - level_factor) + ", " + (height / 2 - level_factor) + ")");
        }

        // Text indicating the value of each level
        for (var j = 0; j < detail_levels; j++) {
            var level_factor = factor * radius * ((j + 1) / detail_levels);
            g.selectAll(".detail_levels")
                .data([1]) // Dummy data
                .enter()
                .append("svg:text")
                .attr("x", function (d) { return level_factor * (1 - factor * Math.sin(0)); })
                .attr("y", function (d) { return level_factor * (1 - factor * Math.cos(0)); })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (width / 2 - level_factor + legend_to_right) + ", " + (height / 2 - level_factor) + ")")
                .attr("fill", legend_font_color)
                .text((j + 1) * 100 / detail_levels);
        }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(all_axis)
            .enter()
            .append("g")
            .attr("class", "axis");
        
        // Axis
        axis.append("line")
            .attr("x1", width / 2)
            .attr("y1", height / 2)
            .attr("x2", function (d, i) { return width / 2 * (1 - factor * Math.sin(i * radians / total)); })
            .attr("y2", function (d, i) { return height / 2 * (1 - factor * Math.cos(i * radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        // Axis labels
        axis.append("text")
            .attr("class", "legend")
            .text(function (d) { return d })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) { return "translate(0, "+ label_translate_y + ")" })
            .attr("x", function (d, i) { return width / 2 * (1 - factor_legend * Math.sin(i * radians / total)) - 60 * Math.sin(i * radians / total); })
            .attr("y", function (d, i) { return height / 2 * (1 - Math.cos(i * radians / total)) - 20 * Math.cos(i * radians / total); });

        // Polygons
        d.forEach(function (y, x) {
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function (j, i) {
                    dataValues.push([
                        width / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / max_value) * factor * Math.sin(i * radians / total)),
                        height / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / max_value) * factor * Math.cos(i * radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "4px")
                .style("stroke", color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", "none")
                .style("fill-opacity", 0)
                // Click action
                .on("click", function (d) {
                    z = "polygon." + d3.select(this).attr("class");
                    /*g.selectAll("polygon").transition(800)
                        .style("fill-opacity", 0.15);*/
                    g.selectAll(z).transition(800)
                        .style("fill", color(series))
                        .style("fill-opacity", .8);
                })
                // Mouseout action
                .on('mouseout', function () {
                    g.selectAll("polygon").transition(800)
                        .style("fill", "none")
                        //.style("fill-opacity", opacity_area);
                });
            series++;
        });
        series = 0;

        // Circular nodes for each polygon
        var tooltip = d3.select(id_to_select).append("div").attr("class", "toolTip");
        d.forEach(function (y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', vertex_radius)
                .attr("alt", function (j) { return Math.max(j.value, 0) })
                .attr("cx", function (j, i) {
                    dataValues.push([
                        width / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / max_value) * factor * Math.sin(i * radians / total)),
                        height / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / max_value) * factor * Math.cos(i * radians / total))
                    ]);
                    return (height / 2 * (1 - (Math.max(j.value, 0) / max_value) * factor * Math.sin(i * radians / total)));
                })
                .attr("cy", function (j, i) {
                    return height / 2 * (1 - (Math.max(j.value, 0) / max_value) * factor * Math.cos(i * radians / total));
                })
                .attr("data-id", function (j) { return j.axis })
                .style("fill", color(series))
                .style("stroke-width", vertex_stroke)
                .style("stroke", vertex_stroke_color)
                .style("stroke-opacity", .8)
                .style("fill-opacity", .7)
                .on('mouseover', function (d) {
                    // A bubble showing the value of the selected vertex, refer to the css
                    tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.axis) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function (d) { tooltip.style("display", "none"); });

            series++;
        });
    }
};