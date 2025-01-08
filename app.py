
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

# Replace with your actual client ID and secret
CLIENT_ID = "YOUR_PLUGGY_CLIENT_ID"
CLIENT_SECRET = "YOUR_PLUGGY_CLIENT_SECRET"

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
    # Replace with your actual account IDs or a secure way to map account numbers to IDs
    if account_number == '1':
        account_id = "YOUR_ACCOUNT_ID_1"
    elif account_number == '2':
        account_id = "YOUR_ACCOUNT_ID_2"
    elif account_number == '3':
        account_id = "YOUR_ACCOUNT_ID_3"
    elif account_number == '4':
        account_id = "YOUR_ACCOUNT_ID_4"  # Cartão de crédito Santander
    elif account_number == '5':
        account_id = "YOUR_ACCOUNT_ID_5"  # Extrato Santander
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
    """Analyzes expenses using Google Gemini AI."""
    if not transactions:
        return {"error": "No transactions to analyze."}

    prompt = f"""Analise a seguinte lista de transações financeiras e categorize cada despesa por tipo, utilizando categorias em português do Brasil (por exemplo: Alimentação, Transporte, Moradia, Lazer, etc.).

    Para cada categoria identificada, calcule o total gasto.

    Considere que o gasto com a descrição "Pagamento de contas Itaú Unibanco S.A" no valor de 1800.00 é o aluguel.

    Considere pagamentos de fatura como gastos essenciais.

    Identifique gastos recorrentes e gastos únicos.
    Identifique gastos essenciais e gastos supérfluos.

    Formate a resposta como um objeto JSON válido, sem formatação extra ou backticks. Inclua as seguintes chaves:
    'categorized_expenses' (um dicionário onde as chaves são as categorias em português do Brasil e os valores são objetos contendo uma lista de despesas sob a chave 'expenses', cada despesa com 'description' e 'amount'. Inclua também uma chave 'total_spent' com o valor total gasto nesta categoria),
    'recurring_expenses' (lista de objetos com 'category' em português do Brasil e 'amount'),
    'unique_expenses' (lista de objetos com 'category' em português do Brasil e 'amount'),
    'essential_expenses' (lista de objetos com 'category' em português do Brasil e 'amount'),
    'superfluous_expenses' (lista de objetos com 'category' em português do Brasil e 'amount').

    Certifique-se de que cada despesa inclua o valor ('amount').
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
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}. Raw text:")
            print(response.text)
            return {"error": "Error parsing AI response.", "raw_text": response.text}
    except Exception as e:
        print(f"Error in Gemini API call: {e}")
        return {"error": "Error analyzing expenses with AI."}

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
