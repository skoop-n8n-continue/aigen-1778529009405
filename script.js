let appData = null;

async function loadAppData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load app data:', error);
        return null;
    }
}

function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    checkMode(now);
}

function checkMode(now) {
    const hours = now.getHours();
    const body = document.body;
    let currentMode = 'default-mode';

    // Lunch Rush: 11am - 2pm
    if (hours >= 11 && hours < 14) {
        currentMode = 'lunch-mode';
    }
    // Late Night: 9pm - 5am
    else if (hours >= 21 || hours < 5) {
        currentMode = 'late-night-mode';
    }

    if (!body.classList.contains(currentMode)) {
        body.className = currentMode;
        if (appData) {
            renderMenu(currentMode === 'late-night-mode');
            updateHeroText(currentMode);
        }
    }
}

function updateHeroText(mode) {
    const heading = document.getElementById('special-heading');
    const subtext = document.getElementById('special-subtext');
    const hero = appData.sections.hero_section;

    if (mode === 'lunch-mode') {
        heading.textContent = hero.lunch_heading.value;
        heading.setAttribute('data-bind-text', 'hero_section.lunch_heading');
        subtext.textContent = hero.lunch_subtext.value;
        subtext.setAttribute('data-bind-text', 'hero_section.lunch_subtext');
    } else if (mode === 'late-night-mode') {
        heading.textContent = hero.late_night_heading.value;
        heading.setAttribute('data-bind-text', 'hero_section.late_night_heading');
        subtext.textContent = hero.late_night_subtext.value;
        subtext.setAttribute('data-bind-text', 'hero_section.late_night_subtext');
    } else {
        heading.textContent = hero.heading.value;
        heading.setAttribute('data-bind-text', 'hero_section.heading');
        subtext.textContent = hero.subtext.value;
        subtext.setAttribute('data-bind-text', 'hero_section.subtext');
    }
}

function renderMenu(isLateNight) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    const categories = appData.sections.categories.value;
    const products = appData.sections.products.value;

    categories.forEach((cat, catIdx) => {
        const catProducts = products
            .map((p, idx) => ({ ...p, _idx: idx }))
            .filter(p => p.category === cat.id && (!isLateNight || p.late_night));

        if (catProducts.length === 0) return;

        const section = document.createElement('section');
        section.className = `menu-section ${cat.id}`;

        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `
            <i data-lucide="${cat.icon}"></i>
            <h3 data-bind-text="categories.${catIdx}.name">${cat.name}</h3>
        `;
        section.appendChild(header);

        const ul = document.createElement('ul');
        ul.className = 'menu-list';

        catProducts.forEach(product => {
            const idx = product._idx;
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.innerHTML = `
                <span class="item-name" data-bind-text="products.${idx}.name">${product.name}</span>
                <span class="item-dots"></span>
                <span class="item-price" data-bind-currency="products.${idx}.price">$${product.price.toFixed(2)}</span>
            `;
            ul.appendChild(li);
        });

        section.appendChild(ul);
        menuGrid.appendChild(section);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function renderLocations() {
    const list = document.getElementById('locations-list');
    if (!list) return;
    list.innerHTML = '';

    const locations = appData.sections.storefront.locations.value;
    locations.forEach((loc, idx) => {
        const span = document.createElement('span');
        span.innerHTML = `<i data-lucide="map-pin"></i> <span data-bind-text="storefront.locations.${idx}.name">${loc.name}</span>`;
        list.appendChild(span);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function init() {
    appData = await loadAppData();
    if (!appData) return;

    const settings = appData.sections.app_settings;
    document.documentElement.style.setProperty('--primary-color', settings.primary_color.value);
    document.documentElement.style.setProperty('--secondary-color', settings.secondary_color.value);
    document.documentElement.style.setProperty('--accent-color', settings.accent_color.value);
    document.documentElement.style.setProperty('--background-color', settings.background_color.value);
    document.documentElement.style.setProperty('--text-color', settings.text_color.value);

    // Initial static content
    const storefront = appData.sections.storefront;
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) logoImg.src = storefront.logo.value;

    const hero = appData.sections.hero_section;
    const heroImg = document.querySelector('.hero-image img');
    if (heroImg) heroImg.src = hero.image.value;

    renderLocations();

    const now = new Date();
    const isLateNight = now.getHours() >= 21 || now.getHours() < 5;
    renderMenu(isLateNight);
    updateHeroText(isLateNight ? 'late-night-mode' : (now.getHours() >= 11 && now.getHours() < 14 ? 'lunch-mode' : 'default-mode'));

    setInterval(updateClock, 1000);
    updateClock();

    document.getElementById('app-container').classList.add('loaded');
}

init();
