export function createInfoElement(label, value) {
    
    const div = document.createElement('div');
    div.classList.add('country-info-text');
    div.textContent = `${label}: ${value}`;
    
    return div;
}

export function createMapLink(url) {

    const div = document.createElement('div');
    div.classList.add('country-info-text');
    div.textContent = 'Map: ';

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = '📍 View it on Google Maps!';
    anchor.target = '_blank';

    div.appendChild(anchor);

    return div;
}

//function to render a single country card with the necessary details
export function renderSingleCountryCard(data, isFavorite, onFavoriteClick) {

    const card = document.createElement('div');
    card.classList.add('show-border');

    //first column of the card - flag
    const flagImage = document.createElement('img');
    flagImage.src = data.flag;
    flagImage.classList.add('image-flag');

    //second column of the card - name, capital, population
    const column2 = document.createElement('div');
    column2.classList.add('info-column');
    column2.append(
        createInfoElement('Country', data.name),
        createInfoElement('Capital', data.capital),
        createInfoElement('Population', data.population)
    );

    //third column of the card - currencies, map link
    const column3 = document.createElement('div');
    column3.classList.add('info-column');
    column3.append(
        createInfoElement('Currencies', data.currencies),
        createMapLink(data.mapUrl)
    );

    const starButton = document.createElement('img');
    starButton.src = isFavorite ? 'assets/images/star.png' : 'assets/images/un-star.png';
    starButton.classList.add('star-button');

    starButton.addEventListener('click', () => {
        const nowFavorite = onFavoriteClick(data.name);
        starButton.src = nowFavorite ? 'assets/images/star.png' : 'assets/images/un-star.png';
    });

    card.append(
        flagImage,
        column2,
        column3,
        starButton
    );
    console.log(card);
    return card;
}

export function renderCountryList(container, countriesList, favorites, onFavoriteClick) {
    container.innerHTML = '';
    countriesList.forEach(data => {
        const isFavorite = favorites.includes(data.name);
        const countryCard = renderSingleCountryCard(data, isFavorite, onFavoriteClick);
        container.appendChild(countryCard);
    });
}

//functionn to render the search history bubbles
export function renderSearchHistory(container, history, onBubbleClick) {
    container.innerHTML = '';

    history.forEach(country => {
        const bubble = document.createElement('button');
        bubble.classList.add('history-bubble');
        bubble.textContent = country;   

        bubble.addEventListener('click', () => {
            onBubbleClick(country);
        });
        
        container.appendChild(bubble);
    })
}

//function to render region bubbles
export function renderRegionOptions(container, onRegionClick) {
    container.innerHTML = '';
    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    regions.forEach(region => {
        const button = document.createElement('button');
        button.classList.add('history-bubble');
        button.textContent = region;

        button.addEventListener('click', () => {
            onRegionClick(region);
        });

        container.appendChild(button);
    });
}