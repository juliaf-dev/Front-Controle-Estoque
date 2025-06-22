import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function SalesHistory() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Buscar clientes para o filtro
    fetch(`${API_URL}/clients`)
      .then(res => res.json())
      .then(data => setClientes(data.data || []))
      .catch(() => console.log('Erro ao buscar clientes para filtro'));

    // Buscar histórico de vendas
    carregarVendas();
  }, []);

  const carregarVendas = async (clienteId = '') => {
    setLoading(true);
    try {
      const url = clienteId 
        ? `${API_URL}/clientes/${clienteId}/historico`
        : `${API_URL}/vendas/historico`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setVendas(data.data || data);
      } else {
        setError(data.error || 'Erro ao carregar histórico de vendas');
      }
    } catch (err) {
      setError('Erro de conexão ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroCliente = (clienteId) => {
    setFiltroCliente(clienteId);
    carregarVendas(clienteId);
  };

  const limparFiltro = () => {
    setFiltroCliente('');
    carregarVendas();
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const calcularTotalVenda = (produtos) => {
    return produtos.reduce((total, item) => {
      return total + (Number(item.valor) * item.quantidade);
    }, 0);
  };

  return (
    <div className="container-historico">
      <header className="historico-header">
        <h1>Histórico de Vendas</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Voltar ao Dashboard
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      {/* Filtros */}
      <div className="filtros-section">
        <h3>Filtros</h3>
        <div className="filtros-container">
          <select 
            value={filtroCliente} 
            onChange={(e) => handleFiltroCliente(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos os clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          <button onClick={limparFiltro} className="btn-secondary">
            Limpar Filtro
          </button>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="vendas-section">
        <h3>Vendas Realizadas</h3>
        
        {loading && <p>Carregando histórico de vendas...</p>}
        
        {!loading && vendas.length === 0 && (
          <p className="no-data">Nenhuma venda encontrada.</p>
        )}

        {!loading && vendas.length > 0 && (
          <div className="vendas-grid">
            {vendas.map((venda, index) => (
              <div key={index} className="venda-card">
                <div className="venda-header">
                  <h4>Venda #{index + 1}</h4>
                  <span className="venda-data">
                    {formatarData(venda.data_retirada)}
                  </span>
                </div>
                
                <div className="venda-cliente">
                  <strong>Cliente:</strong> {venda.cliente?.nome || 'Cliente não encontrado'}
                </div>

                <div className="venda-produtos">
                  <strong>Produtos:</strong>
                  <ul>
                    {venda.produtos?.map((produto, pIndex) => (
                      <li key={pIndex}>
                        {produto.nome} - Qtd: {produto.quantidade} - 
                        R$ {Number(produto.valor).toFixed(2)} cada
                      </li>
                    )) || (
                      <li>{venda.produto?.nome} - Qtd: {venda.quantidade} - 
                          R$ {Number(venda.produto?.valor || venda.valor).toFixed(2)} cada</li>
                    )}
                  </ul>
                </div>

                <div className="venda-total">
                  <strong>Total: R$ {calcularTotalVenda(venda.produtos || [venda]).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 