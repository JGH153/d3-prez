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

const angles = pie([
  { name: "rent", cost: 500 },
  { name: "bills", cost: 300 },
  { name: "gaming", cost: 200 },
]);

const arcPath = d3
  .arc()
  .outerRadius(dimensions.radius)
  .innerRadius(dimensions.radius / 2);

// console.log(arcPath(angles[0])); //M9.184850993605149e-15,-150A150,150,0,1,1,9.184850993605149e-15,150LNaN,NaNZ

// update function
const update = (data) => {
  
	console.log(data);
	// join enhanced (pie) data to path elements
	const paths = graph.selectAll('path').data(pie(data));

	// paths.enter() is a for each map
	paths.enter().append('path').attr('class', 'arc').attr('d', arcPath).attr('stroke', '#fff').attr('stroke-width', 3)

	console.log(paths.enter());

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
