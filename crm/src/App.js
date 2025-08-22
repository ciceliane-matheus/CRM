import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, TrendingUp, Mail, Menu, X, Plus, Send, Loader2, AlertCircle, Clock, User, CheckCircle, Download, FileText, Edit, Trash2, List, ChevronRight, MessageSquare, ChevronLeft, Briefcase, AtSign, Phone, Book, Check } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Configurações e variáveis globais para a API do Gemini
const API_KEY = ""; // A chave da API é definida em tempo de execução
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

// * Função para converter JSON de string para objeto, com tratamento de erro
/**
 * @param {string} jsonString A string JSON a ser analisada.
 * @returns {object|null} O objeto JavaScript analisado ou null em caso de erro.
 */
function safeParseJson(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Erro ao analisar JSON:", error);
    return null;
  }
}

// * Função para simular uma chamada à API do Gemini
async function callGeminiApi(prompt) {
  const model = "gemini-2.5-flash-preview-05-20";
  const apiUrl = `${API_URL}${model}:generateContent?key=${API_KEY}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Erro na chamada da API: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Extrai o texto da resposta
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma resposta encontrada.';
    return text;
    
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return "Erro ao gerar resposta. Por favor, tente novamente.";
  }
}

// * Componente para o layout principal do dashboard
const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
    <Sidebar />
    <main className="flex-1 p-8">
      {children}
    </main>
  </div>
);

// * Componente da barra lateral
const Sidebar = () => (
  <aside className="bg-white w-64 p-6 shadow-lg transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-50">
    <div className="flex items-center justify-center mb-10">
      <Sparkles className="text-blue-600 w-8 h-8 mr-2" />
      <span className="text-xl font-bold text-blue-800">AI-CRM</span>
    </div>
    <nav>
      <ul className="space-y-2">
        <li className="flex items-center text-blue-600 bg-blue-50 p-3 rounded-xl font-semibold">
          <TrendingUp className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-xl font-semibold transition-colors duration-200">
          <MessageCircle className="w-5 h-5 mr-3" />
          <span>Atendimento</span>
        </li>
        <li className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-xl font-semibold transition-colors duration-200">
          <Briefcase className="w-5 h-5 mr-3" />
          <span>Clientes</span>
        </li>
        <li className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded-xl font-semibold transition-colors duration-200">
          <Book className="w-5 h-5 mr-3" />
          <span>Relatórios</span>
        </li>
      </ul>
    </nav>
    <div className="absolute bottom-6 left-6 right-6">
      <div className="flex items-center bg-gray-200 p-3 rounded-xl">
        <User className="w-8 h-8 mr-3 text-gray-600" />
        <div className="text-sm">
          <p className="font-semibold">Olá, Ciceliane</p>
          <p className="text-gray-500">Administradora</p>
        </div>
      </div>
    </div>
  </aside>
);

// * Componente do cabeçalho
const Header = () => (
  <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-md mb-8">
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200">
        <Plus className="w-5 h-5" />
      </button>
      <button className="p-2 bg-white text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200">
        <Menu className="w-5 h-5" />
      </button>
    </div>
  </header>
);

// * Componente do card
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-3xl shadow-md flex items-center justify-between ${color}`}>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
    <div className="bg-white p-3 rounded-full shadow-inner">
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

// * Dados do gráfico
const data = [
  { name: 'Jan', Clientes: 400, Receita: 2400 },
  { name: 'Fev', Clientes: 300, Receita: 1398 },
  { name: 'Mar', Clientes: 200, Receita: 9800 },
  { name: 'Abr', Clientes: 278, Receita: 3908 },
  { name: 'Mai', Clientes: 189, Receita: 4800 },
  { name: 'Jun', Clientes: 239, Receita: 3800 },
  { name: 'Jul', Clientes: 349, Receita: 4300 },
];

// * Componente principal da aplicação
const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // * Função para lidar com o envio da mensagem
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage = { role: 'user', content: input };
    setChatHistory(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const prompt = input;
    try {
      const geminiResponse = await callGeminiApi(prompt);
      const newAssistantMessage = { role: 'assistant', content: geminiResponse };
      setChatHistory(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      setError('Ocorreu um erro ao se comunicar com o modelo. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // * Efeito para rolar o chat para a última mensagem
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <DashboardLayout>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Clientes" value="2,431" icon={User} color="bg-blue-50 text-blue-600" />
        <StatCard title="Projetos" value="18" icon={Briefcase} color="bg-green-50 text-green-600" />
        <StatCard title="Receita" value="R$ 15,489" icon={TrendingUp} color="bg-purple-50 text-purple-600" />
        <StatCard title="Ativo" value="3" icon={Clock} color="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Análise de Clientes e Receita</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Clientes" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Receita" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-md flex flex-col h-[400px]">
          <h2 className="text-xl font-bold mb-4">Atendimento Automatizado (Chatbot)</h2>
          <div className="flex-1 overflow-y-auto chat-container space-y-4 p-2 bg-gray-50 rounded-xl mb-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[70%] ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                  <Loader2 className="animate-spin" />
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="p-3 rounded-2xl bg-red-100 text-red-700">
                  {error}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default App;
