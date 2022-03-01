const handleFetch = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`;
        throw new Error(errorMessage);
    }
    return response.json();
}

const getEducationData = () => {
    return handleFetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
}

const getCountyData = () => {
    return handleFetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
}

export { getEducationData, getCountyData };