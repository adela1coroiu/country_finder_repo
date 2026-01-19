import { addToSearchHistory, fetchCountryData, getFavoriteCountries, getSearchHistory, addToFavoriteCountries } from "./server.js";
import { renderCountryCard, renderSearchHistory } from "./ui.js";

const input = document.querySelector('.input-class');
const searchButton = document.querySelector('.search-button');
const countryInfo = document.querySelector('.country-info');
const listContainer = document.getElementById('countries-bubbles-list');
const favoritesButton = document.getElementById('favorites-button');
const historyButton = document.getElementById('history-button');

let currentView = 'history';

function refreshListUI() {

    if(currentView === 'history') {
        const history = getSearchHistory();
        renderSearchHistory(listContainer, history, (countryName) => {
            performSearch(countryName);
        });
    }
    else if(currentView === 'favorites') {
        const favorites = getFavoriteCountries();
        renderSearchHistory(listContainer, favorites, (countryName) => {
            performSearch(countryName);
        });
    }
}

async function performSearch(name) {
    try {
        const data = await fetchCountryData(name);

        const favorites = getFavoriteCountries();
        const isFavorite = favorites.includes(data.name);

        renderCountryCard(countryInfo, data, isFavorite, (countryName) => {
            return addToFavoriteCountries(countryName);
        });
        addToSearchHistory(data.name);
        refreshListUI();
    }
    catch {
        console.error(error);
        countryInfo.classList.remove('show-border');
        countryInfo.textContent = "Country not found!";
    }
}

favoritesButton.addEventListener('click', () => {
    currentView = 'favorites';
    refreshListUI();
});

historyButton.addEventListener('click', () => {
    currentView = 'history';
    refreshListUI();
});

const handleSearch = () => {
    const query = input.value.trim();
    if(query) {
        performSearch(query);
    }
}

searchButton.addEventListener('click', handleSearch);

input.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        handleSearch();
    }
});

refreshListUI();