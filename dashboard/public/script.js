const apiKey = 'IHHMVk2NW0JC588ovfZPMZC2pu01MuD6';
let chart;
let favorites = [];

// Fetch stock data based on symbol and date range
async function fetchStockData() {
    const symbol = document.getElementById('symbol').value.toUpperCase() || 'AAPL';
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    // Use provided dates or defaults
    const startDate = startDateInput || '2023-01-01';
    const endDate = endDateInput || new Date().toISOString().split('T')[0];

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?adjusted=true&apiKey=${apiKey}`;

    showLoading(true);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            alert('No data available for the given symbol and date range');
            return;
        }

        const dates = data.results.map(result => new Date(result.t).toLocaleDateString());
        const prices = data.results.map(result => result.c);

        createChart(dates, prices, symbol);
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        showErrorNotification('Failed to fetch stock data');
    } finally {
        showLoading(false);
    }
}

// Show or hide the loading spinner
function showLoading(isLoading) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = isLoading ? 'block' : 'none';
}

// Show an error notification
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('error-notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fetch stock name for a symbol
async function fetchStockName(symbol) {
    const apiUrl = `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.results ? data.results.name : symbol;
    } catch (error) {
        console.error('Error fetching stock name:', error.message);
        return symbol;
    }
}

// Add a stock to favorites
async function addFavorite() {
    const symbol = document.getElementById('symbol').value.toUpperCase();
    if (symbol && !favorites.some(fav => fav.symbol === symbol)) {
        const name = await fetchStockName(symbol);
        favorites.push({ symbol, name });
        updateFavoritesList();
    }
}

// Update the favorites list UI
function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.textContent = `${fav.name} (${fav.symbol})`;
        li.onclick = () => fetchStockDataBySymbol(fav.symbol);
        favoritesList.appendChild(li);
    });
}

// Fetch stock data by symbol (from favorites)
async function fetchStockDataBySymbol(symbol) {
    document.getElementById('symbol').value = symbol; // Set symbol in input
    await fetchStockData(); // Call fetchStockData to fetch and display the data
}

// Create a chart with the given data
function createChart(dates, prices, symbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (chart) {
        chart.destroy(); // Destroy previous chart if any
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${symbol} Stock Prices`,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            }
        }
    });
}

// Simple user authentication (temporary for the project)
function authenticateUser(username, password) {
    const storedUsername = 'user';
    const storedPassword = 'password';
    
    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem('isAuthenticated', true);
        alert('Login successful');
    } else {
        alert('Invalid credentials');
    }
}

function logoutUser() {
    localStorage.removeItem('isAuthenticated');
    alert('Logged out');
}
