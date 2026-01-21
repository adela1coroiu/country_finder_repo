const HISTORY_KEY = 'search_history';
const FAVORITES_KEY = 'favorite_countries';

function mapCountryData(country) {
    return {
        flag: country.flags.png,
        name: country.name.common,
        capital: country.capital ? country.capital[0] : 'N/A',
        population: country.population.toLocaleString(),
        currencies: country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A',
        mapUrl: country.maps.googleMaps
    }
}

//~~~~~~~~~~~~~~API fetching functions~~~~~~~~~~~~~~

export async function fetchCountryData(countryName) { 
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if(!response.ok) {
        throw new Error('Country not found!');
    }
    const data = await response.json();
    return data.map(mapCountryData);
}

export async function fetchCountriesByRegion(region) {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    
    if(!response.ok) {
        throw new Error('Region not found!');
    }
    
    const data = await response.json();
    if(!response.ok) {
        throw new Error('Region not found!');
    }
    return data.map(mapCountryData);
}

export async function fetchAllCountriesRanked() {
    const response = await fetch(`https://restcountries.com/v3.1/all?fields=name,flags,capital,population,currencies,maps`);
    if (!response.ok) {
        throw new Error('Failed to fetch rankings');
    }
    const data = await response.json();

    return data
        .sort((a, b) => b.population - a.population)
        .slice(0, 10)
        .map((country, index) => ({
            ...mapCountryData(country),
            rank: index + 1
        }));
}

export async function fetchDiscoveryCountry() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,currencies,maps,region,subregion');
    if (!response.ok) {
        throw new Error('Failed to fetch discovery data');
    }
    const data = await response.json();
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    
    return {
        ...mapCountryData(randomCountry),
        region: randomCountry.region,
        subregion: randomCountry.subregion
    };
}

export async function fetchTravelNews(countryName) {
    try {
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`;
        const response = await fetch(wikiUrl);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (e) {
        return null;
    }
}

//~~~~~~~~~~~~~~~Local storage functions~~~~~~~~~~~~~~~

export function getSearchHistory() {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
}

export function addToSearchHistory(countryName) {
    let history = getSearchHistory();
    history = history.filter(name => name.toLowerCase() !== countryName.toLowerCase()); //removes duplicates
    history.unshift(countryName); //adding it to the beginning
    if(history.length > 10) {
        history.pop();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getFavoriteCountries() {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
}

export function addToFavoriteCountries(countryName) {
    let favorites = getFavoriteCountries();
    const index = favorites.indexOf(countryName);
    if(index === -1) {
        favorites.push(countryName);
    }
    else {
        favorites.splice(index, 1);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
}