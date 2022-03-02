console.log('confirm D3 methods are available', d3)

import { getEducationData, getCountyData } from './requests.js';

document.addEventListener("DOMContentLoaded", async () => {
    const [educationData, countyData] = await Promise.all([getEducationData(), getCountyData()])
    console.log('educationData', educationData)
    console.log('countyData', countyData)
    const width = 1200;
    const height = 600;
    const padding = 60;
    const path = d3.geoPath()
    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(countyData, countyData.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)

})