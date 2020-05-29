// select the svg conatiner first
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

d3.json("menu.json").then((data) => {
  const min = d3.min(data, (current) => current.orders);
  const max = d3.max(data, (current) => current.orders);
  const extent = d3.extent(data, (current) => current.orders);
  console.log(min, max, extent);

  const xAxis = d3
    .scaleBand()
    .domain(data.map((current) => current.name))
    .range([0, 800])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const yAxis = d3
    .scaleLinear()
    .domain([min - 20, max])
    .range([0, 500]);

  //console.log(y(600))

  // join the data to circs
  const rects = svg.selectAll("rect").data(data);

  // add attrs to circs already in the DOM
  rects
    .attr("width", xAxis.bandwidth)
    .attr("height", (data) => yAxis(data.orders))
    .attr("fill", "orange")
    .attr("x", (data, i) => xAxis(data.name));

  // append the enter selection to the DOM
  rects
    .enter()
    .append("rect")
    .attr("width", xAxis.bandwidth)
    .attr("height", (data) => yAxis(data.orders))
    .attr("fill", "orange")
    .attr("x", (data, i) => xAxis(data.name));
});
