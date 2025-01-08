from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import date, timedelta
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

app = Flask(__name__)
CORS(app)

# Replace with your actual Pluggy client ID and secret
CLIENT_ID = " "
CLIENT_SECRET = " "

def get_api_key():
    url = "https://api.pluggy.ai/auth"
    payload = {
        "clientId": CLIENT_ID,
        "clientSecret": CLIENT_SECRET
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()['apiKey']

def get_transactions(api_key, account_id, months):
    today = date.today()
    from_date = today - timedelta(days=months * 30)
    to_date = today

    from_str = from_date.strftime('%Y-%m-%d')
    to_str = to_date.strftime('%Y-%m-%d')

    all_transactions = []
    page = 1
    while True:
        url = f"https://api.pluggy.ai/transactions?accountId={account_id}&from={from_str}&to={to_str}&page={page}"
        headers = {
            "accept": "application/json",
            "X-Api-Key": api_key
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        all_transactions.extend(data['results'])
        if data.get('page', 0) >= data.get('totalPages', 1):  # Usando .get() para evitar KeyError
            break
        page += 1
    return all_transactions

@app.route('/api/transactions/<account_number>')
def transactions(account_number):
    months_str = request.args.get('months')
    if not months_str or not months_str.isdigit():
        return jsonify({"error": "Missing or invalid 'months' parameter"}), 400
    months = int(months_str)

    api_key = get_api_key()
    if account_number == '1':
        account_id = "Account_ID" #replace with your actual accountId
    elif account_number == '2':
        account_id = "Account_ID"
    elif account_number == '3':
        account_id = "Account_ID"
    elif account_number == '4':
        account_id = "Account_ID"  
    elif account_number == '5':
        account_id = "Account_ID"   
    else:
        return jsonify({"error": "Invalid account number"}), 400

    try:
        transactions_data = get_transactions(api_key, account_id, months)
        return jsonify(transactions_data)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def analyze_expenses_with_ai(transactions):
    """Analyzes expenses by grouping them based on the provided category."""
    if not transactions:
        return {"error": "No transactions to analyze."}

    categorized_expenses = {}
    recurring_expenses = []
    unique_expenses = []
    essential_expenses = []
    superfluous_expenses = []

    # Track expense counts for identifying recurring expenses
    expense_counts = {}

    # Mapping of general categories to determine essential/superfluous (can be expanded)
    essential_categories_keywords = ["salary", "rent", "utilities", "healthcare", "government aid", "taxes", "alimony", "insurance", "education"]
    superfluous_categories_keywords = ["leisure", "gambling", "shopping", "digital services", "travel"]

    for transaction in transactions:
        if transaction['type'] == 'DEBIT':
            category = transaction.get('category', 'Uncategorized')
            amount = abs(transaction.get('amount', 0))
            description = transaction.get('description')

            # Categorize expenses
            if category not in categorized_expenses:
                categorized_expenses[category] = {"expenses": [], "total_spent": 0}
            categorized_expenses[category]["expenses"].append({
                "description": description,
                "amount": amount
            })
            categorized_expenses[category]["total_spent"] += amount

            # Count expense occurrences for recurring logic
            expense_counts[description] = expense_counts.get(description, 0) + 1

            # Identify essential and superfluous expenses based on category keywords
            category_lower = category.lower()
            is_essential = any(keyword in category_lower for keyword in essential_categories_keywords)
            is_superfluous = any(keyword in category_lower for keyword in superfluous_categories_keywords)

            if is_essential:
                essential_expenses.append({"category": category, "amount": amount, "description": description})
            elif is_superfluous:
                superfluous_expenses.append({"category": category, "amount": amount, "description": description})

    # Identify recurring and unique expenses based on counts
    for transaction in transactions:
        if transaction['type'] == 'DEBIT':
            description = transaction.get('description')
            amount = abs(transaction.get('amount', 0))
            category = transaction.get('category', 'Uncategorized')
            if expense_counts[description] > 1 and not any(exp['description'] == description for exp in recurring_expenses):
                recurring_expenses.append({"category": category, "amount": amount, "description": description})
            elif expense_counts[description] == 1 and not any(exp['description'] == description for exp in unique_expenses):
                unique_expenses.append({"category": category, "amount": amount, "description": description})

    return {
        "categorized_expenses": categorized_expenses,
        "recurring_expenses": recurring_expenses,
        "unique_expenses": unique_expenses,
        "essential_expenses": essential_expenses,
        "superfluous_expenses": superfluous_expenses
    }

def suggest_savings_with_ai(transactions, current_balance):
    """Suggests savings based on transaction history using Google Gemini AI."""
    if not transactions:
        return {"error": "No transactions to suggest savings."}

    prompt = f"""Com base no seguinte histórico de transações e um saldo atual de R${current_balance:.2f},
    sugira maneiras de economizar dinheiro. Identifique áreas onde a pessoa pode reduzir gastos,
    sugira alternativas mais econômicas e forneça dicas práticas de economia.

    Formate a resposta como um objeto JSON válido, sem formatação extra ou backticks. Inclua uma chave chamada 'savings_suggestions' que contenha uma lista de objetos. Cada objeto na lista deve ter as chaves: 'area' (a área das finanças onde a economia pode ser feita, em português do Brasil), 'description' (a sugestão de economia detalhada, em português do Brasil) e 'alternative' (uma alternativa mais econômica, se aplicável, em português do Brasil).
    """
    prompt += f"\nTransações:\n{json.dumps(transactions)}"

    model = genai.GenerativeModel("gemini-1.5-flash")
    try:
        response = model.generate_content(prompt)
        try:
            start_index = response.text.find('{')
            end_index = response.text.rfind('}')
            if start_index != -1 and end_index != -1 and start_index < end_index:
                json_string = response.text[start_index : end_index + 1]
                json_response = json.loads(json_string)
                return json_response
            else:
                print(f"Could not find valid JSON in AI response: {response.text}")
                return {"error": "Could not extract valid JSON from AI response."}
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Error parsing JSON: {e}. Raw text:")
            print(response.text)
            return {"error": "Error parsing AI savings suggestions.", "raw_text": response.text}
    except Exception as e:
        print(f"Error in Gemini API call for savings: {e}")
        return {"error": "Error getting savings suggestions from AI."}

@app.route('/api/analyze-transactions-ai', methods=['POST'])
def analyze_transactions_ai_route():
    data = request.json
    transactions1 = data.get('transactions1', [])
    transactions2 = data.get('transactions2', [])
    transactions3 = data.get('transactions3', [])
    transactions4 = data.get('transactions4', [])  # New transaction source
    transactions5 = data.get('transactions5', [])  # New transaction source
    all_transactions = transactions1 + transactions2 + transactions3 + transactions4 + transactions5

    analysis_result = analyze_expenses_with_ai(all_transactions)
    return jsonify(analysis_result)

@app.route('/api/suggest-savings-ai', methods=['POST'])
def suggest_savings_ai_route():
    data = request.json
    transactions1 = data.get('transactions1', [])
    transactions2 = data.get('transactions2', [])
    transactions3 = data.get('transactions3', [])
    transactions4 = data.get('transactions4', [])  # New transaction source
    transactions5 = data.get('transactions5', [])  # New transaction source
    current_balance = data.get('currentBalance', 0) # Assume frontend sends current balance
    all_transactions = transactions1 + transactions2 + transactions3 + transactions4 + transactions5

    savings_suggestions = suggest_savings_with_ai(all_transactions, current_balance)
    return jsonify(savings_suggestions)

if __name__ == '__main__':
    app.run(debug=True)
