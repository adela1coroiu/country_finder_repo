import { addToSearchHistory, fetchCountryData, getFavoriteCountries, getSearchHistory, addToFavoriteCountries } from "./server.js";
import { renderCountryList, renderSearchHistory, renderSingleCountryCard } from "./ui.js";

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
            performSearchForSingularCountry(countryName);
        });
    }
    else if(currentView === 'favorites') {
        const favorites = getFavoriteCountries();
        renderSearchHistory(listContainer, favorites, (countryName) => {
            performSearchForSingularCountry(countryName);
        });
    }
}

async function performSearchForSingularCountry(name) {
    try {
        const countriesList = await fetchCountryData(name); 
        const favorites = getFavoriteCountries(); 
        
        const exactMatch = countriesList.find(c => c.name.toLowerCase() === name.toLowerCase()) || countriesList[0];
        console.log(exactMatch);
        countryInfo.innerHTML = ''; 
        
        const card = renderSingleCountryCard(
            exactMatch, 
            favorites.includes(exactMatch.name), 
            (countryName) => addToFavoriteCountries(countryName)
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
            return addToFavoriteCountries(countryName);
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
    countryInfo.classList.remove('show-border');
    countryInfo.textContent = "Country not found!";
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
        performSearchForCountriesThatMatch(query);
    }
}

searchButton.addEventListener('click', handleSearch);

input.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        handleSearch();
    }
});

refreshListUI();