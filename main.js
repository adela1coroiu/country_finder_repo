import { fetchCountryData } from "./api.js";
import { renderCountryCard } from "./ui.js";


const input = document.querySelector('.input-class');
const searchButton = document.querySelector('.search-button');
const countryInfo = document.querySelector('.country-info');

searchButton.addEventListener('click', async () => {
    const countryName = input.value.trim();
    if(!countryName) {
        return;
    }

    try{
        const data = await fetchCountryData(countryName);
        renderCountryCard(countryInfo, data);
    }
    catch{
        countryInfo.classList.remove('show-border');
        countryInfo.textContent = "Country not found!";
    }
})