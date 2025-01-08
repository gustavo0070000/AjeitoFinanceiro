// --- START OF FILE App.js ---
// Frontend (React - em src/App.js)
import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChartPie, FaCoins, FaEye, FaEyeSlash, FaRegCalendarAlt, FaLightbulb } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
  }
`;

// Theme
const theme = {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  backgroundColor: '#f8f9fa',
  textColor: '#343a40',
  tableBackgroundColor: '#fff',
  tableHeaderColor: '#e9ecef',
  buttonBackgroundColor: '#007bff',
  buttonTextColor: '#fff',
  hoverBackgroundColor: '#0056b3',
};

// Styled Components
const AppContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  margin-bottom: 15px;
  color: ${props => props.theme.primaryColor};
`;

const Button = styled.button`
  padding: 10px 15px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: ${props => props.theme.buttonBackgroundColor};
  color: ${props => props.theme.buttonTextColor};
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.hoverBackgroundColor};
  }

  &:disabled {
    background-color: ${props => props.theme.secondaryColor};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: ${props => props.theme.tableBackgroundColor};
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: ${props => props.theme.tableHeaderColor};
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

const ChartContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
`;

const ToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${props => props.theme.secondaryColor};

  &:hover {
    background-color: #5a6268;
  }
`;

const InfoBox = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const InfoTitle = styled.h3`
  color: ${props => props.theme.primaryColor};
  margin-bottom: 10px;
`;

const SuggestionItem = styled.li`
  margin-bottom: 8px;
`;

function App() {
  const [transactions1, setTransactions1] = useState([]);
  const [transactions2, setTransactions2] = useState([]);
  const [transactions3, setTransactions3] = useState([]);
  const [transactions4, setTransactions4] = useState([]); // New state for Cartão de crédito Santander
  const [transactions5, setTransactions5] = useState([]); // New state for Extrato Santander
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1');
  const [showTransactions1, setShowTransactions1] = useState(true);
  const [showTransactions2, setShowTransactions2] = useState(true);
  const [showTransactions3, setShowTransactions3] = useState(true);
  const [showTransactions4, setShowTransactions4] = useState(true); // New toggle state
  const [showTransactions5, setShowTransactions5] = useState(true); // New toggle state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [savingsSuggestions, setSavingsSuggestions] = useState(null);
  const [categorySpendingData, setCategorySpendingData] = useState(null);

  useEffect(() => {
    console.log("Valor de timeRange:", timeRange);
  }, [timeRange]);

  useEffect(() => {
    console.log("Estado de transactions1:", transactions1);
  }, [transactions1]);

  useEffect(() => {
    console.log("Estado de transactions2:", transactions2);
  }, [transactions2]);

  useEffect(() => {
    console.log("Estado de transactions3:", transactions3);
  }, [transactions3]);

  useEffect(() => {
    console.log("Estado de transactions4:", transactions4);
  }, [transactions4]);

  useEffect(() => {
    console.log("Estado de transactions5:", transactions5);
  }, [transactions5]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response1 = await fetch(`http://127.0.0.1:5000/api/transactions/1?months=${timeRange}`);
        if (!response1.ok) {
          throw new Error(`Erro na requisição para a Conta 1: ${response1.status} ${response1.statusText}`);
        }
        const data1 = await response1.json();
        setTransactions1(data1);

        const response2 = await fetch(`http://127.0.0.1:5000/api/transactions/2?months=${timeRange}`);
        if (!response2.ok) {
          throw new Error(`Erro na requisição para a Conta 2: ${response2.status} ${response2.statusText}`);
        }
        const data2 = await response2.json();
        setTransactions2(data2);

        const response3 = await fetch(`http://127.0.0.1:5000/api/transactions/3?months=${timeRange}`);
        if (!response3.ok) {
          throw new Error(`Erro na requisição para a Conta 3: ${response3.status} ${response3.statusText}`);
        }
        const data3 = await response3.json();
        setTransactions3(data3);

        const response4 = await fetch(`http://127.0.0.1:5000/api/transactions/4?months=${timeRange}`);
        if (!response4.ok) {
          throw new Error(`Erro na requisição para Cartão de crédito Santander: ${response4.status} ${response4.statusText}`);
        }
        const data4 = await response4.json();
        setTransactions4(data4);

        const response5 = await fetch(`http://127.0.0.1:5000/api/transactions/5?months=${timeRange}`);
        if (!response5.ok) {
          throw new Error(`Erro na requisição para Extrato Santander: ${response5.status} ${response5.statusText}`);
        }
        const data5 = await response5.json();
        setTransactions5(data5);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const toggleTransactions = (account) => {
    if (account === 1) setShowTransactions1(!showTransactions1);
    if (account === 2) setShowTransactions2(!showTransactions2);
    if (account === 3) setShowTransactions3(!showTransactions3);
    if (account === 4) setShowTransactions4(!showTransactions4); // Toggle for new source
    if (account === 5) setShowTransactions5(!showTransactions5); // Toggle for new source
  };

  const handleAnalyzeWithAI = async () => {
    setLoading(true);
    setError(null);
    setAiAnalysis(null);
    setCategorySpendingData(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze-transactions-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions1, transactions2, transactions3, transactions4, transactions5 }), // Include new transactions
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Categorizar transações: ${response.status} ${response.statusText} - ${errorData.error}`);
      }
      const data = await response.json();
      setAiAnalysis(data);

      if (data && data.categorized_expenses) {
        const labels = Object.keys(data.categorized_expenses);
        const datasets = [{
          label: 'Gastos por Categoria',
          data: labels.map(category =>
            data.categorized_expenses[category].total_spent
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(100, 200, 150, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(159, 159, 159, 1)',
            'rgba(50, 100, 75, 1)',
          ],
          borderWidth: 1,
        }];
        setCategorySpendingData({ labels, datasets });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSavings = async () => {
    setLoading(true);
    setError(null);
    setSavingsSuggestions(null);
    const calculateBalance = (transactions) => {
      return transactions.reduce((acc, transaction) => {
        return acc + (transaction.type === 'CREDIT' ? transaction.amount : -transaction.amount);
      }, 0);
    };
    const currentBalance = calculateBalance([...transactions1, ...transactions2, ...transactions3, ...transactions4, ...transactions5]); // Include new transactions

    try {
      const response = await fetch('http://127.0.0.1:5000/api/suggest-savings-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions1, transactions2, transactions3, transactions4, transactions5, currentBalance }), // Include new transactions
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao obter sugestões de economia: ${response.status} ${response.statusText} - ${errorData.error}`);
      }
      const data = await response.json();
      setSavingsSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
     }
  };

  const renderTransactions = (transactions) => (
    transactions.length > 0 ? (
      <Table>
        <thead>
          <tr>
            <TableHeader>Data</TableHeader>
            <TableHeader>Descrição</TableHeader>
            <TableHeader>Valor</TableHeader>
            <TableHeader>Tipo</TableHeader>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <TableData>{new Date(transaction.date).toLocaleDateString()}</TableData>
              <TableData>{transaction.description}</TableData>
              <TableData style={{ color: transaction.type === 'CREDIT' ? 'green' : 'red' }}>
                {transaction.amount && transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: transaction.currencyCode })}
              </TableData>
              <TableData>{transaction.type}</TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>Nenhuma transação encontrada para esta conta.</p>
    )
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <h1>Transações Financeiras</h1>

        <div>
          <label htmlFor="timeRange">
            <FaRegCalendarAlt style={{ marginRight: '5px' }} /> Selecionar Período:
          </label>
          <Select id="timeRange" value={timeRange} onChange={handleTimeRangeChange}>
            <option value="1">Último 1 mês</option>
            <option value="3">Últimos 3 meses</option>
            <option value="6">Últimos 6 meses</option>
            <option value="12">Último 1 ano</option>
          </Select>
        </div>

        <Button onClick={handleAnalyzeWithAI} disabled={loading}>
          <FaLightbulb style={{ marginRight: '5px' }} /> Analisar Transações com IA
        </Button>

        <Button onClick={handleSuggestSavings} disabled={loading}>
          <FaCoins style={{ marginRight: '5px' }} /> Sugestões de Economia
        </Button>

        {categorySpendingData && (
          <ChartContainer>
            <SectionTitle><FaChartPie style={{ marginRight: '5px' }} /> Gastos por Categoria</SectionTitle>
            <Pie data={categorySpendingData} />
          </ChartContainer>
        )}

        {aiAnalysis && aiAnalysis.categorized_expenses && (
          <InfoBox>
            <SectionTitle>Análise de Transações por IA</SectionTitle>
            {Object.entries(aiAnalysis.categorized_expenses).map(([category, categoryData]) => (
              <div key={category}>
                <InfoTitle>{category} - Total: {categoryData.total_spent && categoryData.total_spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</InfoTitle>
                <ul>
                  {categoryData.expenses && categoryData.expenses.map(expense => (
                    <li key={expense.description}>
                      {expense.description} -{' '}
                      {expense.amount && expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </InfoBox>
        )}

        {aiAnalysis && aiAnalysis.recurring_expenses && (
          <InfoBox>
            <InfoTitle>Gastos Recorrentes</InfoTitle>
            <ul>
              {aiAnalysis.recurring_expenses.map(expense => (
                <li key={expense.category}>
                  {expense.category} -{' '}
                  {expense.amount && expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </li>
              ))}
            </ul>
          </InfoBox>
        )}

        {aiAnalysis && aiAnalysis.unique_expenses && (
          <InfoBox>
            <InfoTitle>Gastos Únicos</InfoTitle>
            {aiAnalysis.unique_expenses.length === 0 ? <p>Nenhum gasto único identificado.</p> : (
              <ul>
                {aiAnalysis.unique_expenses.map(expense => (
                  <li key={expense.category}>
                    {expense.category} -{' '}
                    {expense.amount && expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </li>
                ))}
              </ul>
            )}
          </InfoBox>
        )}

        {aiAnalysis && aiAnalysis.essential_expenses && (
          <InfoBox>
            <InfoTitle>Gastos Essenciais</InfoTitle>
            <ul>
              {aiAnalysis.essential_expenses.map(expense => (
                <li key={expense.category}>
                  {expense.category} -{' '}
                  {expense.amount && expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </li>
              ))}
            </ul>
          </InfoBox>
        )}

        {aiAnalysis && aiAnalysis.superfluous_expenses && (
          <InfoBox>
            <InfoTitle>Gastos Supérfluos</InfoTitle>
            <ul>
              {aiAnalysis.superfluous_expenses.map(expense => (
                <li key={expense.category}>
                  {expense.category} -{' '}
                  {expense.amount && expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </li>
              ))}
            </ul>
          </InfoBox>
        )}

        {savingsSuggestions && savingsSuggestions.savings_suggestions && (
          <InfoBox>
            <SectionTitle><FaCoins style={{ marginRight: '5px' }} /> Sugestões de Economia</SectionTitle>
            <ul>
              {savingsSuggestions.savings_suggestions.map((suggestion, index) => (
                <SuggestionItem key={index}>
                  <strong>{suggestion.area}:</strong> {suggestion.description}
                  {suggestion.alternative && ` (Alternativa: ${suggestion.alternative})`}
                </SuggestionItem>
              ))}
            </ul>
          </InfoBox>
        )}

        <div>
          <SectionTitle>Rename</SectionTitle>
          <ToggleButton onClick={() => toggleTransactions(1)}>
            {showTransactions1 ? <FaEyeSlash /> : <FaEye />} Transações Conta 1
          </ToggleButton>
          {showTransactions1 && !loading && renderTransactions(transactions1)}
        </div>

        <div>
          <SectionTitle>Rename</SectionTitle>
          <ToggleButton onClick={() => toggleTransactions(2)}>
            {showTransactions2 ? <FaEyeSlash /> : <FaEye />} Transações Conta 2
          </ToggleButton>
          {showTransactions2 && !loading && renderTransactions(transactions2)}
        </div>

        <div>
          <SectionTitle>Rename</SectionTitle>
          <ToggleButton onClick={() => toggleTransactions(3)}>
            {showTransactions3 ? <FaEyeSlash /> : <FaEye />} Transações Conta 3
          </ToggleButton>
          {showTransactions3 && !loading && renderTransactions(transactions3)}
        </div>

        <div>
          <SectionTitle>Rename</SectionTitle>
          <ToggleButton onClick={() => toggleTransactions(4)}>
            {showTransactions4 ? <FaEyeSlash /> : <FaEye />} Transações Cartão Santander
          </ToggleButton>
          {showTransactions4 && !loading && renderTransactions(transactions4)}
        </div>

        <div>
          <SectionTitle>Rename</SectionTitle>
          <ToggleButton onClick={() => toggleTransactions(5)}>
            {showTransactions5 ? <FaEyeSlash /> : <FaEye />} Transações Extrato Santander
          </ToggleButton>
          {showTransactions5 && !loading && renderTransactions(transactions5)}
        </div>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
// --- END OF FILE App.js ---
