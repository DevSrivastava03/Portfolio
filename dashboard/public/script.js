const apiKey = 'cqvlvu9r01qh7uf17tfgcqvlvu9r01qh7uf17tg0';
let chart;
let favorites = [];


async function fetchStockData() {
    const symbol = document.getElementById('symbol').value.toUpperCase() || 'AAPL';
    const startDate = Math.floor(new Date('2023-01-01').getTime() / 1000); 
    const endDate = Math.floor(new Date().getTime() / 1000); 
    const apiUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${startDate}&to=${endDate}&token=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.s !== 'ok') {
            alert('No data available for the given symbol and date range');
            return;
        }

        const dates = data.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());
        const prices = data.c;

        createChart(dates, prices, symbol);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data');
    }
}

// Fetch company name using Finnhub API
async function fetchStockName(symbol) {
    const apiUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.name || symbol;
    } catch (error) {
        console.error('Error fetching stock name:', error);
        return symbol;
    }
}

async function addFavorite() {
    const symbol = document.getElementById('symbol').value.toUpperCase();
    if (symbol && !favorites.some(fav => fav.symbol === symbol)) {
        const name = await fetchStockName(symbol);
        favorites.push({ symbol, name });
        updateFavoritesList();
    }
}

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

async function fetchStockData() {
    const symbol = document.getElementById('symbol').value.toUpperCase() || 'AAPL';
    const startDate = Math.floor(new Date('2023-01-01').getTime() / 1000); // Convert to UNIX timestamp
    const endDate = Math.floor(new Date().getTime() / 1000); // Current date UNIX timestamp
    const apiUrl = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${startDate}&to=${endDate}&token=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.s !== 'ok') {
            throw new Error('No data available for the given symbol and date range');
        }

        const dates = data.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString());
        const prices = data.c;

        createChart(dates, prices, symbol);
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        alert('Failed to fetch stock data: ' + error.message);
    }
}
