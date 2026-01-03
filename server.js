// server.js - THE BACKEND
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = './database.json';

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(bodyParser.json());
app.use(express.static('public')); // Serves your HTML/CSS/JS files

// Helper: Read Data
function readData() {
    if (!fs.existsSync(DB_FILE)) return [];
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
}

// Helper: Write Data
function writeData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- API ENDPOINTS ---

// 1. GET all transactions
app.get('/transactions', (req, res) => {
    const data = readData();
    res.json(data);
});

// 2. POST new transaction
app.post('/transactions', (req, res) => {
    const data = readData();
    const newTransaction = req.body;
    data.push(newTransaction);
    writeData(data);
    res.json({ message: 'Saved', transaction: newTransaction });
});

// 3. DELETE transaction
app.delete('/transactions/:id', (req, res) => {
    let data = readData();
    const { id } = req.params;
    data = data.filter(t => t.id !== id);
    writeData(data);
    res.json({ message: 'Deleted' });
});

// 4. PUT (Update) transaction
app.put('/transactions/:id', (req, res) => {
    let data = readData();
    const { id } = req.params;
    const updatedInfo = req.body;
    
    const index = data.findIndex(t => t.id === id);
    if (index !== -1) {
        data[index] = updatedInfo;
        writeData(data);
        res.json({ message: 'Updated' });
    } else {
        res.status(404).json({ message: 'Not Found' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});