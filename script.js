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

    const EDUCATION_SCALE = {
        TWELVE: 12,
        TWENTY_ONE: 21,
        THIRTY: 30,
        THIRTY_NINE: 39,
        FORTY_EIGHT: 48,
        FIFTY_SEVEN: 57,
        SIXTY_SIX: 66,
    };

    const handleApplyFillColor = (percentHoldingDegree) => {
        if (percentHoldingDegree <= EDUCATION_SCALE.TWELVE) return "#e5f5e0";
        if (percentHoldingDegree <= EDUCATION_SCALE.TWENTY_ONE) return "#c7e9c0";
        if (percentHoldingDegree <= EDUCATION_SCALE.THIRTY) return "#a1d99b";
        if (percentHoldingDegree <= EDUCATION_SCALE.THIRTY_NINE) return "#74c476";
        if (percentHoldingDegree <= EDUCATION_SCALE.FORTY_EIGHT) return "#41ab5d";
        if (percentHoldingDegree <= EDUCATION_SCALE.FIFTY_SEVEN) return "#238b45";
        if (percentHoldingDegree <= EDUCATION_SCALE.SIXTY_SIX) return "#006d2c";
    };

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(locationData, locationData.objects.counties).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "county")
        .attr("data-fips", (d) => educationData.filter((item) => item?.fips === d?.id)?.[0]?.fips)
        .attr("data-education", (d) => educationData.filter((item) => item?.fips === d?.id)?.[0]?.bachelorsOrHigher)
        .attr("fill", (d) => handleApplyFillColor(educationData.filter((item) => item?.fips === d?.id)?.[0]?.bachelorsOrHigher))

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(locationData, locationData.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")

})