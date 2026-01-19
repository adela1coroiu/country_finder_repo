const HISTORY_KEY = 'search_history';
const FAVORITES_KEY = 'favorite_countries';

export async function fetchCountryData(countryName) {
    try {
        
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if(!response.ok) {
            throw new Error('Country not found!');
        }

        const data = await response.json();
        const country = data[0];

        return {
            flag: country.flags.png,
            name: country.name.common,
            capital: country.capital ? country.capital[0] : 'N/A',
            population: country.population.toLocaleString(),
            currencies: country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A',
            mapUrl: country.maps.googleMaps
        };
    }
    catch (error) {
        throw error;
    }
    
}

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