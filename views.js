const viewContainers = document.querySelectorAll('.view-container');
const menuItems = document.querySelectorAll('.menu-item');
const countryInfo = document.querySelector('.country-info');

export function switchView(targetId, activeMenuButton) {
    //we hide all other views and keep active only the one we selected
    viewContainers.forEach(container => 
        container.id === targetId ? container.classList.remove('hidden') : container.classList.add('hidden')
    );

    menuItems.forEach(item =>
        item === activeMenuButton ? item.classList.add('active') : item.classList.remove('active')
    );

    //clearing the common area when switching between pages
    countryInfo.innerHTML = '';
}