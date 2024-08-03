const apiKey = 'G7Edp2N5fosqPdvoOkKr9zAr114pxC7J';
let chart;
let favorites = [];
let chartType = 'line';

async function fetchStockData(symbol = 'AAPL') {
    symbol = document.getElementById('symbol').value.toUpperCase() || symbol;
    const dateRange = document.getElementById('date-range').value.split(' to ');

    if (dateRange.length !== 2) {
        alert('Please select a valid date range.');
        return;
    }

    const [startDate, endDate] = dateRange;

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}?apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const results = data.results;

        if (!results) {
            alert('Invalid symbol or API limit reached');
            return;
        }

        const dates = results.map(result => new Date(result.t).toISOString().split('T')[0]);
        const prices = results.map(result => result.c);

        createChart(dates.reverse(), prices.reverse(), symbol);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Failed to fetch stock data');
    }
}

function createChart(dates, prices, symbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: dates,
            datasets: [{
                label: `Stock Prices of ${symbol}`,
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    display: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea',
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea',
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}

function addFavorite() {
    const symbol = document.getElementById('symbol').value.toUpperCase();
    if (symbol && !favorites.includes(symbol)) {
        favorites.push(symbol);
        updateFavoritesList();
        saveData();
    }
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach(symbol => {
        const li = document.createElement('li');
        li.textContent = symbol;
        li.onclick = () => fetchStockData(symbol); // Update chart with clicked stock
        favoritesList.appendChild(li);
    });
}

function updateChartType() {
    chartType = document.getElementById('chartType').value;
    fetchStockData(document.getElementById('symbol').value || 'AAPL');
}

async function saveData() {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ favorites })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();

    flatpickr("#date-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: ["2023-01-01", new Date().toISOString().split('T')[0]]
    });
});
