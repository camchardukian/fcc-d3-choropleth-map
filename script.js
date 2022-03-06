import { getEducationData, getLocationData } from './requests.js';

document.addEventListener("DOMContentLoaded", async () => {
    const [educationData, locationData] = await Promise.all([getEducationData(), getLocationData()])
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
        ZERO: 0,
        TWELVE: 12,
        TWENTY_ONE: 21,
        THIRTY: 30,
        THIRTY_NINE: 39,
        FORTY_EIGHT: 48,
        FIFTY_SEVEN: 57,
        SIXTY_SIX: 66,
    };

    const COLORS_SCALE = {
        LIGHTEST: "#e5f5e0",
        LIGHTER: "#c7e9c0",
        LIGHT: "#a1d99b",
        BASELINE: "#74c476",
        DARK: "#41ab5d",
        DARKER: "#238b45",
        DARKEST: "#006d2c",
    }

    const handleApplyFillColor = (percentHoldingDegree) => {
        if (percentHoldingDegree < EDUCATION_SCALE.TWELVE) return COLORS_SCALE.LIGHTEST;
        if (percentHoldingDegree < EDUCATION_SCALE.TWENTY_ONE) return COLORS_SCALE.LIGHTER;
        if (percentHoldingDegree < EDUCATION_SCALE.THIRTY) return COLORS_SCALE.LIGHT;
        if (percentHoldingDegree < EDUCATION_SCALE.THIRTY_NINE) return COLORS_SCALE.BASELINE;
        if (percentHoldingDegree < EDUCATION_SCALE.FORTY_EIGHT) return COLORS_SCALE.DARK;
        if (percentHoldingDegree < EDUCATION_SCALE.FIFTY_SEVEN) return COLORS_SCALE.DARKER;
        else return COLORS_SCALE.DARKEST;
    };

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip");

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
        .on("mouseenter", (e) => {
            const itemData = e.target?.__data__
            const countyData = educationData.filter((item) => item?.fips === itemData?.id)?.[0]
            tooltip
                .style('top', `${e.pageY - 30}px`)
                .style('left', `${e.pageX + 15}px`)
                .transition()
                .style("visibility", "visible")
                .text(
                    `${countyData?.area_name}, ${countyData?.state}
                     ${countyData?.bachelorsOrHigher}%`
                ).attr("data-education", countyData?.bachelorsOrHigher);
        })
        .on("mouseout", () => tooltip.transition().style("visibility", "hidden"));

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(locationData, locationData.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "state")

    const legendScale = d3.scaleLinear()
        .domain([0, 100])
        .range([width - (1 / 3 * width), width - padding]);

    const thresholdPercentagesArray = Object.values(EDUCATION_SCALE)
    const legendWidth = width - (2 / 3 * width) - padding;

    const legend = svg.append("g")
        .attr("id", "legend")

    legend.selectAll("rect")
        .data(thresholdPercentagesArray)
        .enter()
        .append("rect")
        .attr("x", d => legendScale(d))
        .attr("y", (padding / 2.5) - 20)
        .attr("width", legendWidth / 2.925)
        .attr("height", 20)
        .style("fill", d => handleApplyFillColor(d));

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(thresholdPercentagesArray.length)

    svg.append("g")
        .attr("transform", "translate(0," + padding / 2.5 + ")")
        .call(legendAxis);
})