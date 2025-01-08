# AjeitoFinanceiro
# Ajeito-Financeiro: Your Personal Finance Analyzer Powered by AI

Ajeito-Financeiro is a web application that helps you understand your financial transactions by fetching data from different bank accounts connected via Pluggy and analyzing them using Google's Gemini AI. It provides insights into your spending habits, categorizes your expenses, identifies recurring payments, and suggests potential savings.

## Getting Started

This guide will walk you through setting up and using Ajeito-Financeiro.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Python 3.6+:**  Required for the backend Flask application.
*   **pip:** Python package installer.
*   **Node.js and npm:** Required for the frontend React application.
*   **A Pluggy Account:** You'll need to connect your bank accounts through [MeuPluggy](https://meu.pluggy.ai) and obtain your API credentials from the [Pluggy Dashboard](https://dashboard.pluggy.ai). Follow the steps in the original README.md to set up your developer access.
*   **A Google Cloud Project with the Gemini API enabled:** You'll need an API key to access Google's Gemini models.

### Backend Setup (Flask)

1. **Clone the repository:**
    ```bash
    git clone <https://github.com/gustavo0070000/AjeitoFinanceiro.git
    cd <your_repository_directory>
    ```

2. **Navigate to the backend directory (if applicable):** The Python Flask app is likely in the root directory based on the provided files.

3. **Create a virtual environment (optional but recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

4. **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(If you don't have a `requirements.txt`, you can create one by running `pip freeze > requirements.txt` after installing the necessary packages: `flask`, `flask-cors`, `requests`, `python-dotenv`, `google-generativeai`)*

5. **Set up environment variables:**
    *   Create a `.env` file in the same directory as `Ajeito-Financeiro_flask.py`.
    *   Add your Google Gemini API key, Pluggy Client ID, and Pluggy Client Secret to the `.env` file:
        ```env
        GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
        CLIENT_ID="YOUR_PLUGGY_CLIENT_ID"
        CLIENT_SECRET="YOUR_PLUGGY_CLIENT_SECRET"
        ```
        Replace the placeholder values with your actual credentials.

6. **Run the Flask application:**
    ```bash
    python Ajeito-Financeiro_flask.py
    ```
    The backend server should start running on `http://127.0.0.1:5000/`.

### Frontend Setup (React)

1. **Navigate to the frontend directory:**
    ```bash
    cd src  # Assuming your React app is in the 'src' directory
    ```

2. **Install frontend dependencies:**
    ```bash
    npm install
    ```

3. **Start the React development server:**
    ```bash
    npm start
    ```
    The frontend application should open in your browser, typically at `http://localhost:3000`.

### Connecting MeuPluggy

Before the application can fetch your transactions, you need to connect your bank accounts through [MeuPluggy](https://meu.pluggy.ai). Follow the instructions in the original `README.md` to connect your accounts and authorize the application in the Pluggy Dashboard.

**Important:** Ensure that the `CLIENT_ID` and `CLIENT_SECRET` in your `.env` file match the credentials of your development application in the Pluggy Dashboard.

## Using Ajeito-Financeiro

Once both the backend and frontend are running, you can interact with Ajeito-Financeiro through your web browser.

### 1. Selecting the Time Range

*   On the main page, you'll find a dropdown menu labeled "Selecionar Período".
*   Choose the time range for which you want to retrieve transactions (e.g., "Último 1 mês", "Últimos 3 meses").
*   Selecting a new time range will automatically fetch and display the transactions for all connected accounts for that period.

### 2. Viewing Transactions

The application displays transactions for each connected account in separate tables. You'll see sections for:

*   **Inter Débito:** Transactions from account associated with `account_number = '1'`.
*   **Inter Crédito:** Transactions from account associated with `account_number = '2'`.
*   **Mercado Pago:** Transactions from account associated with `account_number = '3'`.
*   **Cartão de crédito Santander:** Transactions from account associated with `account_number = '4'`.
*   **Extrato Santander:** Transactions from account associated with `account_number = '5'`.

Each transaction table includes the following information:

*   **Data:** The date of the transaction.
*   **Descrição:** A description of the transaction.
*   **Valor:** The amount of the transaction (positive for credits, negative for debits).
*   **Tipo:** The type of transaction (CREDIT or DEBIT).

You can toggle the visibility of each account's transactions by clicking the "Transações Conta X" button next to each section title.

### 3. Analyzing Transactions with AI

*   Click the "Analisar Transações com IA" button.
*   This will send your transaction data to the backend, which then uses Google's Gemini AI to analyze your expenses.
*   The results of the analysis will be displayed in several sections:
    *   **Gastos por Categoria:** A pie chart visualizing your spending across different categories.
    *   **Análise de Transações por IA:** A breakdown of your expenses categorized by type (e.g., Alimentação, Transporte). It shows the total spent in each category and lists the individual transactions within that category.
    *   **Gastos Recorrentes:** A list of your recurring expenses.
    *   **Gastos Únicos:** A list of your one-time expenses.
    *   **Gastos Essenciais:** A list of your essential expenses.
    *   **Gastos Supérfluos:** A list of your superfluous expenses.

### 4. Getting Savings Suggestions

*   Click the "Sugestões de Economia" button.
*   The application will send your transaction data and current balance to the backend.
*   Google's Gemini AI will analyze your spending patterns and provide personalized savings suggestions.
*   The suggestions will be displayed in the "Sugestões de Economia" section, suggesting areas where you can potentially save money, along with detailed descriptions and alternative options.

## Code Structure

*   **`Ajeito-Financeiro_flask.py`:** This file contains the Flask backend application. It handles:
    *   Fetching transactions from the Pluggy API.
    *   Receiving requests from the frontend to analyze transactions and suggest savings.
    *   Interacting with the Google Gemini AI API.
    *   Serving the analyzed data back to the frontend.
*   **`src/App.js`:** This file contains the React frontend application. It handles:
    *   Displaying the user interface.
    *   Making API calls to the Flask backend.
    *   Rendering transaction data, charts, and AI analysis results.
    *   Managing user interactions.
*   **`App.css`:** Contains the CSS styles for the React application.
*   **`README.md`:** This file (the one you're reading) provides documentation for the application.

## Further Development

This application can be further enhanced with features like:

*   More detailed filtering and sorting of transactions.
*   Customizable expense categories.
*   Goal setting and progress tracking for savings.
*   Integration with more AI models for different types of financial analysis.
*   User authentication and data persistence.

## Contributing

Contributions to Ajeito-Financeiro are welcome! Feel free to fork the repository, make your changes, and submit a pull request. You can also join the discussion on the Pluggy Discord server: [https://discord.gg/EanrwJADby](https://discord.gg/EanrwJADby).
