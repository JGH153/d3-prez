const dimensions = { height: 300, width: 300, radius: 150 };
const center = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 5 };
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dimensions.width + 150)
  .attr("height", dimensions.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${center.x}, ${center.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value((data) => data.cost);

// const angles = pie([
//   { name: "rent", cost: 500 },
//   { name: "bills", cost: 300 },
//   { name: "gaming", cost: 200 },
// ]);

const arcPath = d3
  .arc()
  .outerRadius(dimensions.radius)
  .innerRadius(dimensions.radius / 2);

// console.log(arcPath(angles[0])); //M9.184850993605149e-15,-150A150,150,0,1,1,9.184850993605149e-15,150LNaN,NaNZ

const color = d3.scaleOrdinal(d3.schemeSet3);
// console.log("d3", d3);

// update function
const update = (data) => {
  // update the color scale domain
  color.domain(data.map((current) => current.name));

  // join enhanced (pie) data to path elements
  const paths = graph.selectAll("path").data(pie(data));

  // 3 remove exit selection
  paths.exit().transition().duration(750).attrTween("d", arcTweenExit).remove();

  // update existing
  paths.transition().duration(750).attrTween("d", arcTweenUpdate);

  // paths.enter() is a for each map
  paths
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr('d', arcPath)
    .attr("fill", (current) => color(current.data.name))
    .each(function (current) {
      this._current = current;
    })
    .transition()
    .duration(750)
    .attrTween("d", arcTweenEnter);
};

const data = [];

db.collection("expenses")
  .orderBy("cost")
  .onSnapshot((response) => {
    response.docChanges().forEach((change) => {
      const doc = { ...change.doc.data(), id: change.doc.id };
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

const arcTweenEnter = (element) => {
  let interpolate = d3.interpolate(element.endAngle - 0.1, element.startAngle);

  // what is t? time?
  return function (t) {
    element.startAngle = interpolate(t);
    return arcPath(element);
  };
};

const arcTweenExit = (element) => {
  let interpolate = d3.interpolate(element.startAngle, element.endAngle);

  // what is t? time?
  return function (t) {
    element.startAngle = interpolate(t);
    return arcPath(element);
  };
};

// use function keyword to allow use of 'this'
function arcTweenUpdate(element) {
  console.log(this._current, element);
  // interpolate between the two objects
  let interpolate = d3.interpolate(this._current, element);
  // update the current prop with new updated data
  this._current = interpolate(1);

  return function (timeTick) {
    // i(t) returns a value of d (data object) which we pass to arcPath
    return arcPath(interpolate(timeTick));
  };
}
