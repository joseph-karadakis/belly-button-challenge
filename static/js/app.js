// Declare the data variable outside of the init function
let data = { metadata: [] }; // Initialize metadata as an empty array

// Function to build the Bar Chart
function buildBarChart(sample) {
  // Get the sample data
  let sampleData = data.samples.filter(obj => obj.id === sample)[0];
  
  // Slice and reverse the arrays to get the top 10 values
  let values = sampleData.sample_values.slice(0, 10).reverse();
  let labels = sampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  let hoverText = sampleData.otu_labels.slice(0, 10).reverse();

  // Build the bar chart
  let trace = {
    x: values,
    y: labels,
    text: hoverText,
    type: "bar",
    orientation: "h",
  };

  let barData = [trace];

  let barLayout = {
    title: "Top 10 OTUs",
  };

  Plotly.newPlot("bar", barData, barLayout);
}

// Function to build the Bubble Chart
function buildBubbleChart(sample) {
  // Get the sample data
  let sampleData = data.samples.filter(obj => obj.id === sample)[0];

  // Build the bubble chart
  let trace = {
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: "markers",
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: "Earth",
    },
  };

  let bubbleData = [trace];

  let bubbleLayout = {
    title: "OTU Sample Values",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Value" },
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

// Function to display the sample metadata
function showMetadata(sample) {
  // Get the metadata for the sample
  let metadata = data.metadata.filter(obj => obj.id === parseInt(sample))[0];
  
  // Select the panel for displaying the metadata
  let metadataPanel = d3.select("#sample-metadata");
  
  // Clear existing metadata
  metadataPanel.html("");
  
  // Add each key-value pair from the metadata to the panel
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Function to initialize the dashboard
function init() {
  // Read the data from the JSON file
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(jsonData => {
      data = jsonData;
      // Get the names (IDs) for the dropdown menu
      let names = data.names;
  
      // Populate the dropdown menu with names
      let dropdownMenu = d3.select("#selDataset");
      names.forEach(name => {
        dropdownMenu.append("option").property("value", name).text(name);
      });
  
      // Build the charts and display metadata for the first sample
      let firstSample = names[0];
      buildBarChart(firstSample);
      buildBubbleChart(firstSample);
      showMetadata(firstSample);
    })
    .catch(error => console.log("Error loading data: " + error));
}

// Function to update the charts and metadata when a new sample is selected
function optionChanged(newSample) {
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  showMetadata(newSample);
}

// Initialize the dashboard
init();
