// svg container
var svgWidth = 1000;
var svgHeight = 600;

// margins
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};
// chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create svg container
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData){

// Parse the data
censusData.forEach(function(data){
  data.poverty = +data.poverty;
  data.income = +data.income;
});

// scale x to chart width
var xLinearScale = d3.scaleLinear()
  .domain([8,
  d3.max(censusData, d => d.poverty)])
  .range([0, width]);

// scale y to chart height
var yLinearScale = d3.scaleLinear()
  .domain([35000, 80000])
  .range([height, 0]);

// create axes
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// set x to the bottom of the chart
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);
// set y to the left of the chart
chartGroup.append("g")
  .call(leftAxis);

// Create axes labels
var labels = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height + 20})`);
labels.append("text")
.attr("x", 0)
.attr("y", 20)
.classed("active", true)
.text("Poverty(%)")
.attr("fill", "black");

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.classed("active", true)
.text("Income ($)")
.attr("fill", "black");

// create circles
var circles = chartGroup
.append("g")
.selectAll("circle")
.data(censusData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.income))
.attr("r", "15")
.attr("fill", "#21adde")
.attr("opacity", ".5");

// add abbreviations
chartGroup
.append("g")
.selectAll("text")
.data(censusData)
.enter()
.append("text")
.text(function(w){return w.abbr})
.attr("x", d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.income))
.attr("text-anchor", 'middle')
.attr("font-size", "12px")
.attr("fill", "white");


});
