import { addToSearchHistory, fetchCountryData, getFavoriteCountries, getSearchHistory, addToFavoriteCountries, fetchCountriesByRegion, fetchAllCountriesRanked, fetchDiscoveryCountry, fetchTravelNews } from "./server.js";
import { renderCountryList, renderRegionOptions, renderSearchHistory, renderSingleCountryCard, renderRankingsList, renderTripSuggestion } from "./ui.js";
import { switchView } from "./views.js";

const input = document.querySelector('.input-class');
const searchButton = document.querySelector('.search-button');
const countryInfo = document.querySelector('.country-info');
const listContainer = document.getElementById('countries-bubbles-list');
const favoritesButton = document.getElementById('favorites-button');
const historyButton = document.getElementById('history-button');
const regionsMenuButton = document.getElementById('menu-regions');
const menuHomeButton = document.getElementById('menu-home');
const regionsBubblesList = document.getElementById('regions-bubbles-list');
const rankingsMenuButton = document.getElementById('menu-rankings');
const rankingsListContainer = document.getElementById('rankings-list-container');
const discoveryMenuButton = document.getElementById('menu-discovery');
const shuffleDiscoveryButton = document.getElementById('shuffle-discovery');

let currentView = 'history';

function refreshListUI() {
    const data = currentView === 'history' ? getSearchHistory() : getFavoriteCountries();
    renderSearchHistory(listContainer, data, (countryName) => {
        performSearchForSingularCountry(countryName);
    })
}

async function performSearchForSingularCountry(name) {
    try {
        const countriesList = await fetchCountryData(name); 
        const favorites = getFavoriteCountries(); 
        const exactMatch = countriesList.find(c => c.name.toLowerCase() === name.toLowerCase()) || countriesList[0];

        countryInfo.innerHTML = ''; 
        
        const card = renderSingleCountryCard(
            exactMatch, 
            favorites.includes(exactMatch.name), 
            (countryName) => {
                const isNowFavorite = addToFavoriteCountries(countryName);
                refreshListUI();
                return isNowFavorite;
            }
        );
        countryInfo.appendChild(card); 
    } 
    catch (error) {
        handleSearchError(error);
    }
}

async function performSearchForCountriesThatMatch(name) {
    if (name.length < 3) {
        return;
    } 

    try {
        const countriesList = await fetchCountryData(name); 
        const favorites = getFavoriteCountries(); 

        renderCountryList(countryInfo, countriesList, favorites, (countryName) => {
            const isNowFavorite = addToFavoriteCountries(countryName);
            refreshListUI();
            return isNowFavorite;
        });
        
        if (countriesList.length > 0) {
            addToSearchHistory(countriesList[0].name); 
            refreshListUI(); 
        }
    } 
    catch (error) {
        handleSearchError(error);
    }
}

function handleSearchError(error) {
    console.error(error);
    countryInfo.innerHTML = '<p class="country-info-text">Country not found!</p>';
}

async function performRegionSearch(region) {
    try {
        countryInfo.innerHTML = '<p class="country-info-text">Loading countries...</p>';
        const countriesList = await fetchCountriesByRegion(region);
        const favorites = getFavoriteCountries();

        renderCountryList(countryInfo, countriesList, favorites, (countryName) => {
            return addToFavoriteCountries(countryName);
        });
    } catch (error) {
        console.error(error);
        countryInfo.textContent = "Error loading region.";
    }
}

async function loadDiscoveryTrip() {
    countryInfo.innerHTML = '<p class="country-info-text">🌍 Planning your next trip...</p>';
    
    try {
        const country = await fetchDiscoveryCountry();
        const wikiData = await fetchTravelNews(country.name);
        
        countryInfo.innerHTML = '';
        
        const favorites = getFavoriteCountries();
        const card = renderSingleCountryCard(country, favorites.includes(country.name), (name) => {
            return addToFavoriteCountries(name);
        });
        countryInfo.appendChild(card);
        renderTripSuggestion(countryInfo, country, wikiData);
    } 
    catch (error) {
        countryInfo.textContent = "Could not find a destination right now. Try again!";
    }
}

//~~~~~~~~~~~~~~~~~~~Event listeners~~~~~~~~~~~~~~~~~~~
//home view extra sub-navigation
favoritesButton.addEventListener('click', () => {
    currentView = 'favorites';
    refreshListUI();
});

historyButton.addEventListener('click', () => {
    currentView = 'history';
    refreshListUI();
});

//~~~~~~~~~~~~~~~~Main sidebar navigation~~~~~~~~~~~~~~~~

menuHomeButton.addEventListener('click', () => {
    switchView('home-view', menuHomeButton);
    refreshListUI();
});

regionsMenuButton.addEventListener('click', () => {
    switchView('regions-view', regionsMenuButton);
    if (regionsBubblesList.innerHTML === '') {
        renderRegionOptions(regionsBubblesList, (selectedRegion) => {
            performRegionSearch(selectedRegion);
        });
    }
});

rankingsMenuButton.addEventListener('click', async () => {
    switchView('rankings-view', rankingsMenuButton);
    rankingsListContainer.innerHTML = '<p class="country-info-text">Calculating rankings...</p>';

    try {
        const rankings = await fetchAllCountriesRanked();
        renderRankingsList(rankingsListContainer, rankings);
    } catch (error) {
        console.error(error);
        rankingsListContainer.textContent = "Error loading rankings.";
    }
});

discoveryMenuButton.addEventListener('click', () => {
    switchView('discovery-view', discoveryMenuButton);
    loadDiscoveryTrip();
})

//search logic

const handleSearch = () => {
    const query = input.value.trim();
    if(query) {
        performSearchForCountriesThatMatch(query);
    }
}

searchButton.addEventListener('click', handleSearch);

//event listener for on enter search
input.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        handleSearch();
    }
});

shuffleDiscoveryButton.addEventListener('click', loadDiscoveryTrip);

//initializing the ui
refreshListUI();