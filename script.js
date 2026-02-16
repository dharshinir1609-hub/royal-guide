/**
 * TourMate – Smart Tourist Guide Web App
 * Shared JavaScript functionality
 */

// ============ LOCAL STORAGE KEYS ============
const STORAGE_KEYS = {
    CLIENTS: 'tourmate_clients',
    USER: 'tourmate_user',
    LOGGED_IN: 'tourmate_logged_in',
    PLANS: 'tourmate_plans'
};

// ============ BUDGET-BASED HOTEL RECOMMENDATION ============
/**
 * Returns recommended hotel based on client budget
 * @param {number} budget - Total budget in rupees
 * @returns {object} Hotel name and category
 */
function getRecommendedHotel(budget) {
    if (budget >= 100000) {
        return { name: 'Taj Palace / Luxury Resort', category: 'Luxury', star: 5 };
    }
    if (budget >= 50000) {
        return { name: 'Radisson Blu / Marriott', category: 'Premium', star: 4 };
    }
    if (budget >= 25000) {
        return { name: 'Hotel Lake View / Ibis', category: 'Standard', star: 3 };
    }
    if (budget >= 10000) {
        return { name: 'OYO / Budget Inn', category: 'Budget', star: 2 };
    }
    return { name: 'Hostel / Guest House', category: 'Economy', star: 1 };
}

// ============ CLIENT CRUD (localStorage) ============
/**
 * Saves a new client to localStorage
 * @param {object} client - Client object
 */
function saveClient(client) {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]');
    clients.push(client);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

/**
 * Gets all saved clients from localStorage
 * @returns {Array} Array of client objects
 */
function getClients() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]');
}

/**
 * Deletes a client by id
 * @param {number} id - Client id
 */
function deleteClient(id) {
    let clients = getClients();
    clients = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    if (typeof renderClientsTable === 'function') renderClientsTable();
}

// ============ TOUR SUMMARY ============
/**
 * Displays dynamic tour summary and recommended hotel
 * @param {object} client - Client object with details
 */
function showTourSummary(client) {
    const hotel = client.recommendedHotel || getRecommendedHotel(client.budget);
    const perDay = Math.round(client.budget / client.days);
    
    const summaryHtml = `
        <p><strong>Client Name:</strong> ${client.clientName}</p>
        <p><strong>Destination:</strong> ${client.destination}</p>
        <p><strong>Duration:</strong> ${client.days} days</p>
        <p><strong>Total Budget:</strong> ₹${client.budget.toLocaleString()}</p>
        <p><strong>Per Day Budget:</strong> ₹${perDay.toLocaleString()}</p>
        <p>Recommended plan: Standard sightseeing, local food exploration, and cultural visits.</p>
    `;
    
    const hotelHtml = `
        <p><strong>${hotel.name}</strong> (${hotel.category} - ${hotel.star}★)</p>
    `;
    
    const summaryCard = document.getElementById('summaryCard');
    if (summaryCard) {
        summaryCard.style.display = 'block';
        const tourSummary = document.getElementById('tourSummary');
        const recommendedHotel = document.getElementById('recommendedHotel');
        if (tourSummary) tourSummary.innerHTML = summaryHtml;
        if (recommendedHotel) recommendedHotel.innerHTML = hotelHtml;
        summaryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============ RENDER CLIENTS TABLE ============
function renderClientsTable() {
    const tbody = document.getElementById('clientsTableBody');
    const noClientsMsg = document.getElementById('noClientsMsg');
    if (!tbody) return;
    
    const clients = getClients();
    
    if (clients.length === 0) {
        tbody.innerHTML = '';
        if (noClientsMsg) noClientsMsg.style.display = 'block';
        return;
    }
    
    if (noClientsMsg) noClientsMsg.style.display = 'none';
    
    tbody.innerHTML = clients.map(client => {
        const hotel = client.recommendedHotel || getRecommendedHotel(client.budget);
        return `
            <tr>
                <td>${client.clientName}</td>
                <td>${client.destination}</td>
                <td>${client.days}</td>
                <td>₹${client.budget.toLocaleString()}</td>
                <td>${hotel.name}</td>
                <td>
                    <button class="btn btn-small btn-danger" onclick="deleteClient(${client.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============ LOGOUT ============
/**
 * Handles logout - clears session and redirects
 * @param {Event} e - Click event
 */
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    window.location.href = 'index.html';
}

// ============ MOBILE MENU TOGGLE ============
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            menuBtn.classList.toggle('active');
        });
    }
});
