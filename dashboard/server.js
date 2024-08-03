const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const dataFilePath = path.join(__dirname, 'data.json');

// Endpoint to save favorite stocks
app.post('/api/data', (req, res) => {
    const favorites = req.body.favorites;
    const data = JSON.stringify({ favorites }, null, 2);

    fs.writeFile(dataFilePath, data, 'utf8', (err) => {
        if (err) {
            console.error('Error writing data file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
