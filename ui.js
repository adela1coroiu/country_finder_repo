const createInfoHTML = (label, value) => `
    <div class="country-info-text">${label}: ${value}</div>
`;


//function to render a single country card with the necessary details
export function renderSingleCountryCard(data, isFavorite, onFavoriteClick) {
    const card = document.createElement('div');
    card.classList.add('show-border');
    const starSrc = isFavorite ? 'assets/images/star.png' : 'assets/images/un-star.png';

    card.innerHTML = `
        <img src="${data.flag}" class="image-flag" alt="flag">
        <div class="info-column">
            ${createInfoHTML('Country', data.name)}
            ${createInfoHTML('Capital', data.capital)}
            ${createInfoHTML('Population', data.population)}
        </div>
        <div class="info-column">
            ${createInfoHTML('Currencies', data.currencies)}
            <div class="country-info-text">
                Map: <a href="${data.mapUrl}" target="_blank">📍 View it on Google Maps!</a>
            </div>
        </div>
        <img src="${starSrc}" class="star-button" alt="favorite">
    `;

    const starButton = card.querySelector('.star-button');
    starButton.addEventListener('click', () => {
        const nowFavorite = onFavoriteClick(data.name);
        starButton.src = nowFavorite ? 'assets/images/star.png' : 'assets/images/un-star.png';
    });

    return card;
}

//helper function to render a list of interactive bubbles
function renderBubbles(container, items, onClick) {
    container.innerHTML = '';
    items.forEach(item => {
        const bubble = document.createElement('button');
        bubble.classList.add('history-bubble');
        bubble.textContent = item;
        bubble.addEventListener('click', () => onClick(item));
        container.appendChild(bubble);
    })
}

export function renderSearchHistory(container, history, onBubbleClick) {
    renderBubbles(container, history, onBubbleClick);
}

//function to render region bubbles
export function renderRegionOptions(container, onRegionClick) {
    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    renderBubbles(container, regions, onRegionClick);
}

export function renderCountryList(container, countriesList, favorites, onFavoriteClick) {
    container.innerHTML = '';
    countriesList.forEach(data => {
        const isFavorite = favorites.includes(data.name);
        const countryCard = renderSingleCountryCard(data, isFavorite, onFavoriteClick);
        container.appendChild(countryCard);
    });
}

export function renderRankingsList(container, rankings) {
    container.innerHTML = ''; 
    rankings.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('ranking-row'); 
        row.innerHTML = `
            <span class="rank-number">#${item.rank}</span>
            <img src="${item.flag}" class="rank-flag" alt="flag">
            <div class="rank-details">
                <span class="rank-name"><strong>${item.name}</strong></span>
                <span class="rank-info">Capital: ${item.capital} | Population ${item.population}</span>
                <span class="rank-info">Currencies: ${item.currencies}</span>
            </div>
            <a href="${item.mapUrl}" target="_blank" class="rank-map-link">📍 Map</a>
        `;
        container.appendChild(row);
    });
}

export function renderTripSuggestion(container, country, wikiData) {
    const tripCard = document.createElement('div');
    tripCard.classList.add('vacation-card'); 
    
    const description = wikiData ? wikiData.extract : `Explore the hidden gems of ${country.name}! A beautiful destination located in ${country.subregion}.`;
    const readMore = wikiData ? `<a href="${wikiData.content_urls.desktop.page}" target="_blank" class="wiki-link-btn">Read Travel Guide</a>` : '';

    tripCard.innerHTML = `
        <div class="vacation-header">
            <h3>🧳 Trip Idea: ${country.name}</h3>
        </div>
        <div class="vacation-body">
            <p class="travel-extract">"${description}"</p>
            <div class="travel-guide-section">
                <h4>✨ Quick Itinerary Tips:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li>🏛️ <strong>Stay:</strong> Explore the streets of ${country.capital}.</li>
                    <li>💵 <strong>Budget:</strong> Have your ${country.currencies} ready.</li>
                    <li>📍 <strong>Location:</strong> Nestled in the heart of ${country.region}.</li>
                </ul>
                ${readMore}
            </div>
        </div>
    `;
    container.appendChild(tripCard);
}