// script.js (Client-Side)
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const fullList = document.getElementById('full-list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const recurringCheck = document.getElementById('recurring');
const searchInput = document.getElementById('search');
const loader = document.getElementById('loader');

// Edit Mode
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.querySelector('.btn');
let isEditMode = false;
let globalTransactions = [];

// Navigation Elements
const navItems = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');

const API_URL = 'http://localhost:3000/transactions';

// --- 1. FETCH FUNCTIONS (Communicating with Backend) ---

async function getTransactions() {
    loader.classList.add('show');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        globalTransactions = data;
        updateDashboard();
    } catch (err) {
        console.error("Backend Error:", err);
    } finally {
        loader.classList.remove('show');
    }
}

async function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') return;

    const transactionData = {
        id: isEditMode ? editIdInput.value : Math.floor(Math.random() * 100000000).toString(),
        description: text.value,
        amount: +amount.value,
        type: typeSelect.value,
        date: new Date().toISOString(),
        recurring: recurringCheck.checked
    };

    if (isEditMode) {
        // PUT Request
        await fetch(`${API_URL}/${transactionData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData)
        });
        isEditMode = false;
        submitBtn.innerText = 'Add Transaction';
    } else {
        // POST Request
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionData)
        });
    }

    text.value = '';
    amount.value = '';
    recurringCheck.checked = false;
    editIdInput.value = '';
    getTransactions();
}

async function removeTransaction(id) {
    if (confirm('Delete this transaction?')) {
        // DELETE Request
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        getTransactions();
    }
}

async function editTransaction(id) {
    document.getElementById('nav-dashboard').click();
    // GET single item (or find in global)
    const transaction = globalTransactions.find(t => t.id === id);
    if (!transaction) return;

    text.value = transaction.description;
    amount.value = transaction.amount;
    typeSelect.value = transaction.type;
    recurringCheck.checked = transaction.recurring || false;
    editIdInput.value = transaction.id;

    isEditMode = true;
    submitBtn.innerText = 'Update Transaction';
}

// --- RESET DATA LOGIC ---
const resetBtn = document.getElementById('reset-btn');

if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
        // 1. Confirm with user
        const confirmed = confirm('WARNING: This will permanently delete ALL data from the server. Are you sure?');
        
        if (!confirmed) return;

        // 2. Visual Feedback
        const originalText = resetBtn.innerHTML;
        resetBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';
        resetBtn.disabled = true;

        try {
            // 3. Loop through ALL transactions and delete them one by one
            // (Since our simple backend doesn't have a "Delete All" command)
            for (let transaction of globalTransactions) {
                await fetch(`${API_URL}/${transaction.id}`, {
                    method: 'DELETE'
                });
            }

            // 4. Success!
            alert('All data has been reset.');
            getTransactions(); // Refresh the empty list

        } catch (err) {
            console.error(err);
            alert('Error resetting data. Is the server running?');
        } finally {
            // 5. Reset Button State
            resetBtn.innerHTML = originalText;
            resetBtn.disabled = false;
        }
    });
}

// --- 3. UI UPDATES (Same as before) ---
function updateDashboard() {
    const amounts = globalTransactions.map(t => t.type === 'expense' ? -Math.abs(t.amount) : Math.abs(t.amount));
    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1);

    balance.innerText = formatMoney(total);
    money_plus.innerText = `+${formatMoney(income)}`;
    money_minus.innerText = `-${formatMoney(expense)}`;

    updateChart(income, expense);

    list.innerHTML = '';
    const recent = globalTransactions.slice().reverse().slice(0, 5); 
    recent.forEach(t => addTransactionDOM(t, list));
}

function addTransactionDOM(transaction, listElement) {
    const isExpense = transaction.type === 'expense';
    const sign = isExpense ? '-' : '+';
    const itemClass = isExpense ? 'expense' : 'income';
    const displayDate = transaction.date ? formatDate(transaction.date) : formatDate(new Date());
    const recurringBadge = transaction.recurring ? '<span class="recurring-icon"><i class="fa-solid fa-rotate"></i></span>' : '';

    const item = document.createElement('li');
    item.classList.add(itemClass);
    item.innerHTML = `
        <div class="list-info">
            <span>${transaction.description} ${recurringBadge}</span>
            <small class="list-date">${displayDate}</small>
        </div>
        <span class="amount-text">${sign}${formatMoney(Math.abs(transaction.amount))}</span>
        <div class="action-btn-container">
            <button class="edit-btn" onclick="editTransaction('${transaction.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn" onclick="removeTransaction('${transaction.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    listElement.appendChild(item);
}

// Navigation Logic
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        views.forEach(view => view.classList.add('hidden'));

        if (item.id === 'nav-dashboard') {
            document.getElementById('view-dashboard').classList.remove('hidden');
            pageTitle.innerText = 'Overview';
            updateDashboard();
        } else if (item.id === 'nav-transactions') {
            document.getElementById('view-transactions').classList.remove('hidden');
            pageTitle.innerText = 'All Transactions';
            renderFullList(globalTransactions);
        } else if (item.id === 'nav-settings') {
            document.getElementById('view-settings').classList.remove('hidden');
            pageTitle.innerText = 'Settings';
        }
    });
});

function formatMoney(number) { return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); }
function formatDate(dateString) { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
function renderFullList(data) { fullList.innerHTML = ''; data.slice().reverse().forEach(t => addTransactionDOM(t, fullList)); }

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = globalTransactions.filter(t => t.description.toLowerCase().includes(term) || t.amount.toString().includes(term));
    renderFullList(filtered);
});

// Chart logic (Keep your 3D Chart code here)
// --- CHART LOGIC ---
let expenseChart = null;

function updateChart(income, expense) {
    const canvas = document.getElementById('expenseChart');
    
    // Safety check: Does the canvas exist?
    if (!canvas) {
        console.error("Canvas element 'expenseChart' not found!");
        return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy previous instance
    if (expenseChart instanceof Chart) {
        expenseChart.destroy();
    }

    // Create 3D Gradients
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 400);
    incomeGradient.addColorStop(0, '#818cf8'); 
    incomeGradient.addColorStop(1, '#312e81'); 

    const expenseGradient = ctx.createLinearGradient(0, 0, 0, 400);
    expenseGradient.addColorStop(0, '#f87171'); 
    expenseGradient.addColorStop(1, '#991b1b'); 

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: [incomeGradient, expenseGradient],
                borderWidth: 0, 
                hoverOffset: 20,    
                borderRadius: 20,   
                cutout: '70%',      
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)' 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 20 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 25,
                        font: { family: 'Outfit', size: 13, weight: '600' },
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: true
                }
            }
        }
    });
}

// Init
form.addEventListener('submit', addTransaction);
getTransactions();