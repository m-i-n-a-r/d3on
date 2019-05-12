// Separate script to render the visualization
// D3 is imported in the html file, where this script is executed

// Some useful variables, all in the same place to simplify the configuration
var id_to_select = "#rad3ar";
var width = 960;
var height = 450;
var max_value = 100;
var levels = 5;
var extra_width_x = 300;
var data_colors = ["#ff3300", "#ff9900", "#cccc00", "#669900", "#00cc00", "#00cc99", "#006699", "#6600ff", "#cc00ff", "#ff3399"];
var detail_levels = 10; // Number of guidelines in the chart for each sector
var vertex_radius = 4;
var vertex_stroke_color = "#000000";
var factor = 1;
var factor_legend = .85;
var radians = 2 * Math.PI;
var opacity_area = 0.5;
var to_right = 0;
var translate_x = 0;
var translate_y = 30;
var extra_width_x = 0;
var extra_width_y = 0;
var color = d3.scaleOrdinal().range(data_colors);
var max_value = 100;

// Draw the star chart
d3.json("data-points.json", function (error, data) {
    if (error) throw error;
    startChart.draw(id_to_select, data);
});

var svg = d3.select(id_to_select)
    .selectAll("svg")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height);

var startChart = {
    draw: function (id, d) {
        var all_axis = (d[0].map(function (i, j) { return i.area }));
        var total = all_axis.length;
        var radius = factor * Math.min(width / 2, height / 2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            .append("g")
            .attr("transform", "translate(" + translate_x + "," + translate_y + ")");

        var tooltip;

        // Circular segments
        for (var j = 0; j < detail_levels; j++) {
            var level_factor = factor * radius * ((j + 1) / detail_levels);
            g.selectAll(".levels")
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

        // Text indicating at what % each level is
        for (var j = 0; j < detail_levels; j++) {
            var level_factor = factor * radius * ((j + 1) / levels);
            g.selectAll(".levels")
                .enter()
                .append("svg:text")
                .attr("x", function (d) { return level_factor * (1 - factor * Math.sin(0)); })
                .attr("y", function (d) { return level_factor * (1 - factor * Math.cos(0)); })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (width / 2 - level_factor + to_right) + ", " + (height / 2 - level_factor) + ")")
                .attr("fill", "#737373")
                .text((j + 1) * 100 / detail_levels);
        }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(all_axis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", width / 2)
            .attr("y1", height / 2)
            .attr("x2", function (d, i) { return width / 2 * (1 - factor * Math.sin(i * radians / total)); })
            .attr("y2", function (d, i) { return height / 2 * (1 - factor * Math.cos(i * radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function (d) { return d })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) { return "translate(0, -10)" })
            .attr("x", function (d, i) { return width / 2 * (1 - factor_legend * Math.sin(i * radians / total)) - 60 * Math.sin(i * radians / total); })
            .attr("y", function (d, i) { return height / 2 * (1 - Math.cos(i * radians / total)) - 20 * Math.cos(i * radians / total); });


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
                .style("stroke-width", "2px")
                .style("stroke", color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style("fill", function (j, i) { return color(series) })
                .style("fill-opacity", opacity_area)
                .on("click", function (d) {
                    z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                /*.on('mouseout', function () {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", opacity_area);
                });*/
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
                    return width / 2 * (1 - (Math.max(j.value, 0) / max_value) * factor * Math.sin(i * radians / total));
                })
                .attr("cy", function (j, i) {
                    return height / 2 * (1 - (Math.max(j.value, 0) / max_value) * factor * Math.cos(i * radians / total));
                })
                .attr("data-id", function (j) { return j.axis })
                .style("fill", color(series))
                .style("stroke-width", "2px")
                .style("stroke", vertex_stroke_color)
                .style("fill-opacity", .9)
                .on('mouseover', function (d) {
                    // A bubble showing the value of the selected vertex
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.axis) + "<br><span>" + (d.value) + "</span>");
                })
                .on("mouseout", function (d) { tooltip.style("display", "none"); });

            series++;
        });
    }
};