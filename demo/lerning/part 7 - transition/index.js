const totalWidth = 900;
const totalHeight = 600;

// select the svg conatiner first
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", totalWidth)
  .attr("height", totalHeight);

const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = totalWidth - margin.left - margin.right;
const graphHeight = totalHeight - margin.top - margin.bottom;

const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = graph
  .append("g")
  .attr("transform", `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append("g");

// scales, new name?
const xScaleAxis = d3
  .scaleBand()
  .range([0, totalWidth - 100])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const yScaleAxis = d3.scaleLinear().range([graphHeight, 0]);

const xAxis = d3.axisBottom(xScaleAxis);
const yAxis = d3
  .axisLeft(yScaleAxis)
  .ticks(3)
  .tickFormat((i) => i + " Orders");

xAxisGroup
  .selectAll("text")
  .attr("transform", `rotate(40)`)
  .attr("text-anchor", "start")
  .attr("fill", "orange");

const transition = d3.transition().duration(500);

// Tweens
const widthTween = (d) => {
  let i = d3.interpolate(0, xScaleAxis.bandwidth());
  return function (t) {
    return i(t);
  };
};

const update = (data) => {
  // 1 updating scales domain
  xScaleAxis.domain(data.map((current) => current.name));
  yScaleAxis.domain([0, d3.max(data, (d) => d.orders)]);

  // 2 join the data to rect
  const rects = graph.selectAll("rect").data(data);

  // 3 remove exit selection
  rects.exit().remove();

  // 4 update attrs to elements already in the DOM
  rects
    .attr("width", xScaleAxis.bandwidth)
    .attr("fill", "orange")
    .attr("x", (data, i) => xScaleAxis(data.name))
    .transition(transition); // transition attr after x ms
  // .attr("height", (data) => graphHeight - yScaleAxis(data.orders))
  // .attr("y", (d) => yScaleAxis(d.orders));

  // 5 append the enter selection to the DOM
  rects
    .enter()
    .append("rect")
    .attr("width", 0) //not needed, handled by widthTween
    .attr("height", 0)
    .attr("fill", "orange")
    .attr("x", (data, i) => xScaleAxis(data.name))
    .attr("y", graphHeight)
    .merge(rects) // anything after will apply to enter and update (4 & 5)
    .transition(transition) // transition attr after x ms
    .attrTween('width', widthTween)
    .attr("height", (data) => graphHeight - yScaleAxis(data.orders))
    .attr("y", (data, i) => yScaleAxis(data.orders));

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

const data = [];
db.collection("dishes").onSnapshot((response) => {
  response.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };
    // console.log(doc);
    // console.log(change);
    // console.log(change.doc.data());
    if (change.type === "added") {
      data.push(doc);
    }
    if (change.type === "modified") {
      data[change.newIndex] = doc; //or use find index with ID
    }
    if (change.type === "removed") {
      data.splice(change.oldIndex, 1); //or use filter
    }
  });
  update(data);
});

