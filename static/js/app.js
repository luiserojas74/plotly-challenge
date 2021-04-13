var jsonPath = "./data/samples.json";

function buildPanel(sample) {
    d3.json(jsonPath).then((data) => {
      var metadata= data.metadata;
      var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]
      var customPanel = d3.select("#sample-metadata");
      customPanel.html("");
      Object.entries(result).forEach(([key, value]) => {
        customPanel.append("h6").text(`${key}: ${value}`);
      });
      buildGauge(result.wfreq);
    });
  }

function buildBubbleChart(values, ids, labels){
    var LayoutBubble = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        showlegend: false
    };
    var trace1 = {
        x: ids,
        y: values,
        text: labels,
        mode: 'markers',
        marker: {
            size: values,
            color: ids,
            colorscale:"Earth"
        }
    };
    var DataBubble = [trace1];
    Plotly.newPlot("bubble", DataBubble, LayoutBubble);  
}

function  buildBarChart(sample, values, ids, labels){
    var trace2 = {
        x: values.slice(0,10).reverse(), 
        y: ids.slice(0, 10).map(d=>`OTU ${d}`).reverse(),
        text: labels.slice(0, 10).reverse(),
        hoverinfo: "hovertext",
        name: "Bar",
        type: "bar",
        orientation: "h"
    };
    // data
    var chartData = [trace2];
    // Apply the group bar mode to the layout
    var layout = {
        title: "Top Ten OTUs for Individual " +sample,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
    },
    font: { color: "#49a81d", family: "Arial, Helvetica, sans-serif" }
    };
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData, layout);
}

function buildCharts(sample) {
  d3.json(jsonPath).then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    buildBubbleChart(values, ids, labels);
    buildBarChart(sample, values, ids, labels);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json(jsonPath).then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildPanel(firstSample);
    buildCharts(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildPanel(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();