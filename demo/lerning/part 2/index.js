const data = [
  { width: 200, height: 100, fill: "purple" },
  { width: 100, height: 60, fill: "pink" },
  { width: 50, height: 30, fill: "red" },
  { width: 20, height: 20, fill: "blue" },
];

// select the svg container first
const svg = d3.select("svg");

// console.log(d3.selectAll('rect').data(data))
const rects = svg.selectAll("rect").data(data);

rects
  .attr("width", (data) => data.width)
  .attr("height", (data) => data.height)
  .attr("fill", (data) => data.fill);

	// create and update rects not in dom yet
rects
  .enter()
  .append("rect")
  .attr("width", (data) => data.width)
  .attr("height", (data) => data.height)
  .attr("fill", (data) => data.fill);
