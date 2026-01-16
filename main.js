import { addToSearchHistory, fetchCountryData, getSearchHistory } from "./server.js";
import { renderCountryCard, renderSearchHistory } from "./ui.js";


const input = document.querySelector('.input-class');
const searchButton = document.querySelector('.search-button');
const countryInfo = document.querySelector('.country-info');
const historyList = document.getElementById('history-list');

async function performSearch(name) {
    try {
        const data = await fetchCountryData(name);
        renderCountryCard(countryInfo, data);
        addToSearchHistory(name);
        refreshHistoryUI();
    }
    catch {
        console.error(error);
        countryInfo.classList.remove('show-border');
        countryInfo.textContent = "Country not found!";
    }
}

function refreshHistoryUI() {
    const history = getSearchHistory();
    renderSearchHistory(historyList, history, (clickedCountryName) => {
        input.value = clickedCountryName;
        performSearch(clickedCountryName);
    });
}

searchButton.addEventListener('click', () => performSearch(input.value.trim()));

refreshHistoryUI();