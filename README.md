# BudgetBuddy Pro 💸

**BudgetBuddy Pro** is a full-stack web application designed for personal finance management. It features a responsive dashboard, real-time analytics with a 3D gradient chart, and a robust REST API backend for persistent data storage.

🚀 **Live Demo:** [Insert your 2-min YouTube Video Link Here]

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Technical Architecture](#-technical-architecture)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Author](#-author)

---

## ✨ Key Features

### 🎨 Frontend (User Interface)
* **Interactive Dashboard:** Displays real-time calculations for Total Balance, Income, and Expenses.
* **Visual Analytics:** Implements **Chart.js** with a custom 3D gradient doughnut chart to visualize the Income vs. Expense ratio.
* **Responsive Design:** Fully responsive layout that adapts from a 2-column sidebar view (Desktop) to a single-column stack (Mobile/Tablet).
* **Dynamic Interactions:** Uses asynchronous JavaScript (`fetch`/`async`/`await`) to communicate with the server without reloading the page.
* **User Feedback:** Includes loading spinners and toast notifications for better UX.

### ⚙️ Backend (Server)
* **RESTful API:** A Node.js/Express server handling `GET`, `POST`, `PUT`, and `DELETE` requests.
* **Data Persistence:** Transactions are saved to a local `database.json` file, ensuring data survives server restarts (simulating a NoSQL document store).
* **Robust Error Handling:** Validates inputs before processing transactions.

---

## 🏗 Technical Architecture

The application follows a **Client-Server Architecture**:

1.  **Client (Frontend):** Located in the `public/` folder. It handles the DOM manipulation and sends HTTP requests to the backend.
2.  **Server (Backend):** The `server.js` file acts as the API controller. It receives requests, processes business logic, reads/writes to the file system, and sends JSON responses back to the client.

---

## 🛠 Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 | Semantic markup and CSS Grid/Flexbox for layout. |
| **Scripting** | Vanilla JavaScript (ES6+) | Used for DOM manipulation and API communication (`fetch`). |
| **Backend** | Node.js + Express.js | Server-side runtime and web framework. |
| **Storage** | JSON File System (`fs`) | Lightweight file-based persistence strategy. |
| **Libraries** | Chart.js | Used for rendering the 3D data visualization chart. |
| **Icons** | FontAwesome | Used for UI icons (Trash, Edit, Wallet, etc.). |

---

## 🚀 Installation & Setup

Follow these steps to run the application locally on your machine.

### Prerequisites
* Ensure **[Node.js](https://nodejs.org/)** is installed on your computer.

### Steps
1.  **Clone the Repository** (or unzip the project folder):
    ```bash
    git clone [https://github.com/P4L4SH/BudgetBuddy-Pro.git](https://github.com/P4L4SH/BudgetBuddy-Pro.git)
    cd BudgetBuddy-Pro
    ```

2.  **Install Dependencies:**
    This installs the required libraries (`express`, `cors`, `body-parser`) listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Start the Server:**
    ```bash
    node server.js
    ```
    *You should see the message: `Server running at http://localhost:3000`*

4.  **Launch the App:**
    Open your web browser and go to:
    👉 **http://localhost:3000**

---

## 🔌 API Documentation

The backend exposes the following endpoints at `http://localhost:3000`:

| Method | Endpoint | Description | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | Retrieve all transactions. | N/A |
| `POST` | `/transactions` | Create a new transaction. | `{ "description": "Rent", "amount": 500, "type": "expense" }` |
| `PUT` | `/transactions/:id` | Update an existing transaction. | `{ "description": "New Name", ... }` |
| `DELETE` | `/transactions/:id` | Remove a transaction. | N/A |

---

## 🧪 Testing

You can verify the application works by performing these test cases:

1.  **Create:** Add a transaction named "Salary" (Income, $5000). Verify the Balance updates to $5000.
2.  **Persistence:** Refresh the browser page. The "Salary" transaction should still be there (loaded from the server).
3.  **Visuals:** Add an Expense named "Rent" ($1000). Verify the Chart updates with a Red segment.
4.  **Delete:** Click the "Trash" icon on "Rent". Verify the balance restores to $5000.
5.  **Reset:** Go to Settings -> "Reset All Data". Verify the dashboard returns to the empty state.

---

## 👤 Author

**Palash Verma**
* **Course:** [Insert Course Name]
* **University:** [Insert University Name]
* **GitHub:** [@P4L4SH](https://github.com/P4L4SH)

---

*This project was developed for the [Insert Module Name] assignment.*
