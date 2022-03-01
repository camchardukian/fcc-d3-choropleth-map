console.log('confirm D3 methods are available', d3)

import { getEducationData, getCountyData } from './requests.js';

document.addEventListener("DOMContentLoaded", async () => {

    let educationData = await getEducationData()
    let countyData = await getCountyData()

    console.log('educationData', educationData)
    console.log('countyData', countyData)
})