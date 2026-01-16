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
    anchor.textContent = 'View it on Google Maps!';
    anchor.target = '_blank';

    div.appendChild(anchor);

    return div;
}

export function renderCountryCard(container, data) {

    container.innerHTML = '';
    container.classList.add('show-border');

    const flagImage = document.createElement('img');
    flagImage.src = data.flag;
    flagImage.classList.add('image-flag');

    container.append(
        flagImage,
        createInfoElement('Country', data.name),
        createInfoElement('Capital', data.capital),
        createInfoElement('Population', data.population),
        createInfoElement('Currencies', data.currencies),
        createMapLink(data.mapUrl)
    );
}