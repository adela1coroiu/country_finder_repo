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

export function renderCountryCard(container, data) {

    container.innerHTML = '';
    container.classList.add('show-border');

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

    container.append(
        flagImage,
        column2,
        column3
    );
}

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