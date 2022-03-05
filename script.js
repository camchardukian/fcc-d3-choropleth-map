import { getEducationData, getLocationData } from './requests.js';

document.addEventListener("DOMContentLoaded", async () => {
    const [educationData, locationData] = await Promise.all([getEducationData(), getLocationData()])
    console.log('educationData', educationData)
    console.log('locationData', locationData)
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
        .data(topojson.feature(locationData, locationData.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d) => educationData.filter((item) => item?.fips === d?.id)?.[0]?.fips)
        .attr("data-education", (d) => educationData.filter((item) => item?.fips === d?.id)?.[0]?.bachelorsOrHigher)

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(locationData, locationData.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")

})