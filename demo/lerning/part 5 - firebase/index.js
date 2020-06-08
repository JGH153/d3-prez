// select the svg conatiner first
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", 600)
  .attr("height", 600);

const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

db.collection("dishes")
  .get()
  .then((response) => {
    const data = response.docs.map((current) => current.data());

    const min = d3.min(data, (current) => current.orders);
    const max = d3.max(data, (current) => current.orders);
    const extent = d3.extent(data, (current) => current.orders);
    // console.log(min, max, extent);

    //console.log(y(600))

    // join the data to circs
    const rects = graph.selectAll("rect").data(data);

    // add attrs to circs already in the DOM
    rects
      .attr("width", xScaleAxis.bandwidth)
      .attr("height", (data) => graphHeight - yScaleAxis(data.orders))
      .attr("fill", "orange")
      .attr("x", (data, i) => xScaleAxis(data.name));

    // append the enter selection to the DOM
    rects
      .enter()
      .append("rect")
      .attr("width", xScaleAxis.bandwidth)
      .attr("height", (data) => graphHeight - yScaleAxis(data.orders))
      .attr("fill", "orange")
      .attr("x", (data, i) => xScaleAxis(data.name))
      .attr("y", (data, i) => yScaleAxis(data.orders));

    const xAxis = d3.axisBottom(xScaleAxis);
    const yAxis = d3
      .axisLeft(yScaleAxis)
      .ticks(3)
      .tickFormat((i) => i + " Orders");

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup
      .selectAll("text")
      .attr("transform", `rotate(40)`)
      .attr("text-anchor", "start")
      .attr("fill", "orange");
  });
