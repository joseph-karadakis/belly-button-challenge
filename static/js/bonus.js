// Function to fetch data from the provided URL
function fetchData() {
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
  return fetch(url).then(response => response.json());
}

// Function to initialize the dashboard
function init() {
  // Fetch the data from the URL
  fetchData()
    .then(data => {
      // Store the data in a global variable (data is already defined in app.js)
      window.data = data;

      // Set the initial sample to the first one in the list
      let firstSample = data.names[0];
      updateGaugeChart(firstSample);
    })
    .catch(error => {
      console.error("Error loading data:", error);
    });
}

// Function to build the Gauge Chart
// JavaScript
function buildGaugeChart(wfreq) {
  // Define colors for the gauge chart (shades of green)
  const greenColors = [
    "rgba(248,243,236,255)",
    "rgba(244,241,228,255)",
    "rgba(233,231,201,255)",
    "rgba(229,232,176,255)",
    "rgba(213,229,153,255)",
    "rgba(183,205,143,255)",
    "rgba(139,192,134,255)",
    "rgba(137,188,141,255)",
    "rgba(132,181,137,255)",
  ];

  // Calculate the index for the color based on wfreq
  let colorIndex = Math.floor(wfreq / 1) - 1;
  colorIndex = colorIndex < 0 ? 0 : colorIndex; // Ensure the index is not negative

  // Calculate the angle of the needle
  const angle = (wfreq / 9) * 180 - 45; // Assuming the scale of the gauge is from 0 to 9

  // SVG path for the needle
  const needlePath = `M 200 320 L 210 250 L 190 250 Z`;

  // Build the gauge chart
  let trace = {
    type: "indicator",
    mode: "gauge",
    value: wfreq,
    title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
    gauge: {
      axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkgreen" },
      bar: {color: "darkgreen"},
      bgcolor: "white",
      steps: [
        { range: [0, 1], color: greenColors[0] },
        { range: [1, 2], color: greenColors[1] },
        { range: [2, 3], color: greenColors[2] },
        { range: [3, 4], color: greenColors[3] },
        { range: [4, 5], color: greenColors[4] },
        { range: [5, 6], color: greenColors[5] },
        { range: [6, 7], color: greenColors[6] },
        { range: [7, 8], color: greenColors[7] },
        { range: [8, 9], color: greenColors[8] },
      ],
    },
  };

  let gaugeData = [trace];

  let gaugeLayout = {
    width: 400,
    height: 350,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    font: { color: "darkgreen", family: "Helvetica" },
  };

  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}



// Function to update the Gauge Chart with the new sample's washing frequency
function updateGaugeChart(sample) {
  // Get the washing frequency for the selected sample
  let wfreq = data.metadata.filter((obj) => obj.id === parseInt(sample))[0]?.wfreq;

  if (wfreq !== undefined) {
    buildGaugeChart(wfreq);
  } else {
    console.error("Sample washing frequency not found for the selected ID.");
  }
}

// Event listener for the dropdown menu to update the gauge chart when a new sample is selected
document.getElementById("selDataset").addEventListener("change", function () {
  let newSample = this.value;
  updateGaugeChart(newSample);
});

// Initialize the dashboard
init();
