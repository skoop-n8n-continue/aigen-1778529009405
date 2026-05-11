const menuData = {
    burgers: [
        { id: 1, name: 'The Classic', price: '8.99', lateNight: true },
        { id: 2, name: 'Double Cheese', price: '10.99', lateNight: true },
        { id: 3, name: 'Smokey Bacon', price: '12.49', lateNight: false },
        { id: 4, name: 'Garden Veggie', price: '9.49', lateNight: false }
    ],
    extras: [
        { id: 5, name: 'Sea Salt Fries', price: '3.49', lateNight: true },
        { id: 6, name: 'Crispy Onion Rings', price: '4.49', lateNight: false },
        { id: 7, name: 'Vanilla Shake', price: '5.49', lateNight: true },
        { id: 8, name: 'Chocolate Shake', price: '5.49', lateNight: true }
    ]
};

function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
        renderMenu(currentMode === 'late-night-mode');
        updateHeroText(currentMode);
    }
}

function updateHeroText(mode) {
    const heading = document.getElementById('special-heading');
    const subtext = document.getElementById('special-subtext');

    if (mode === 'lunch-mode') {
        heading.textContent = 'LUNCH RUSH SPECIALS';
        subtext.textContent = 'Fuel up for the rest of your day.';
    } else if (mode === 'late-night-mode') {
        heading.textContent = 'LATE NIGHT BITES';
        subtext.textContent = 'Cravings satisfied. Anytime.';
    } else {
        heading.textContent = 'DAILY SPECIALS';
        subtext.textContent = 'Fresh. Local. Grilled to perfection.';
    }
}

function renderMenu(isLateNight) {
    const burgerList = document.getElementById('burger-list');
    const extrasList = document.getElementById('extras-list');

    burgerList.innerHTML = '';
    extrasList.innerHTML = '';

    menuData.burgers.forEach(item => {
        if (!isLateNight || item.lateNight) {
            burgerList.appendChild(createMenuItem(item));
        }
    });

    menuData.extras.forEach(item => {
        if (!isLateNight || item.lateNight) {
            extrasList.appendChild(createMenuItem(item));
        }
    });
}

function createMenuItem(item) {
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="item-dots"></span>
        <span class="item-price">$${item.price}</span>
    `;
    return li;
}

// Initial render
setInterval(updateClock, 1000);
updateClock();
