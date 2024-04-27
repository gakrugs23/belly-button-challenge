// Read in samples.json from website using D3

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Make the dropdown menu to switch between subjects
// let objectValue  = "";
let selector = d3.select("#selDataset");

// Declare functions

// Make Bar Graph Function
function makeBarGraph(sampleID){  
    // Get data for selected sampleID
    d3.json(url).then(function(data){
        let samples = data.samples;
        let sampleData = samples.filter(samples => samples.id == sampleID);
        console.log(sampleData);

        let sampleValues = sampleData[0].sample_values.slice(0,10).reverse();
        let otuIDs = sampleData[0].otu_ids.slice(0,10).reverse();
        let otuLabels = sampleData[0].otu_labels.slice(0,10).reverse();
        let yticks = otuIDs.slice(0,10).map(otuID => `OTU ${otuID}`);

        // Draw graph with Plotly
        let barChartData = {
            type: "bar",
            x: sampleValues,
            y: yticks,
            text: otuLabels,
            orientation: "h"
        };
        
        let barLayout = {
            title: "Top 10 OTUs Found in Samples",
            height: 400
        };

        let barTraceData = [barChartData];
        
        Plotly.newPlot("bar", barTraceData, barLayout);
    });
};
    
// Make Bubble Chart Function
function makeBubbleChart(sampleID){  

    d3.json(url).then(function(data){
    // Get data for selected sampleID
        let samples = data.samples;
        let sampleData = samples.filter(samples => samples.id == sampleID);
        
        let sampleValues = sampleData[0].sample_values;
        let otuIDs = sampleData[0].otu_ids;
        let otuLabels = sampleData[0].otu_labels;
        
    // Make Bubble Chart with Plotly
        let bubbleChartData = {
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIDs,
                size: sampleValues,
                colorscale: 'Electric'
            }
        };

        let bubbleTraceData = [bubbleChartData];

        let bubbleLayout = {
            title: 'All OTU Groups Found in Sample',
            width: 600
        }
        
        Plotly.newPlot("bubble", bubbleTraceData, bubbleLayout);
        samples = "";
    });
};

// Show Metadata Function
function showMetadata(sampleID){  
    // Obtain data to display
    d3.json(url).then(function(data){
        // Get data for selected sampleID
        let metadata = data.metadata;
        let sampleMetadata = metadata.filter(metadata => metadata.id == sampleID);

        // Extract data from JSON object to display
        let sampleMetaID = sampleMetadata[0].id;
        let sampleEthnicity = sampleMetadata[0].ethnicity;
        let sampleGender = sampleMetadata[0].gender;
        let sampleAge = sampleMetadata[0].age;
        let sampleLocation = sampleMetadata[0].location;
        let sampleBellyButtonType = sampleMetadata[0].bbtype;
        let sampleWashFrequency = sampleMetadata[0].wfreq;

        // Display the data
        d3.select("#sample-metadata").html("");

        d3.select("#sample-metadata").append("p").text(`Sample ID: ${sampleMetaID}`);
        d3.select("#sample-metadata").append("p").text(`Ethnicity: ${sampleEthnicity}`);
        d3.select("#sample-metadata").append("p").text(`Gender: ${sampleGender}`);
        d3.select("#sample-metadata").append("p").text(`Age: ${sampleAge}`);
        d3.select("#sample-metadata").append("p").text(`Location: ${sampleLocation}`);
        d3.select("#sample-metadata").append("p").text(`Belly Button Type: ${sampleBellyButtonType}`);
        d3.select("#sample-metadata").append("p").text(`Wash Frequency (per week): ${sampleWashFrequency}`);
        });
};

function optionChanged(sampleID) {
    makeBarGraph(sampleID);
    makeBubbleChart(sampleID);
    showMetadata(sampleID);
    // createGauge(sampleID);
    sampleID = "";
};

//Create the dashboard
d3.json(url).then(function(data){
    // Create an HTML object line for each ID number, create <object> tags and add them to HTML with D3
    for (let j = 0; j < data.names.length; j++){
        let objectValue = data.names[j];
        selector.append("option").property("value", objectValue).text(objectValue);
    }
    
    // Find the value of the dropdown
        let sampleID = selector.property("value");
        optionChanged(sampleID);
        sampleID = "";
});