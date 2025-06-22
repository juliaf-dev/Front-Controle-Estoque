import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Caixa() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedido, setPedido] = useState({
    clienteId: '',
    produtos: [],
    valorTotal: 0,
  });
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddCliente, setShowAddCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: ''
  });

  // Buscar clientes e produtos ao carregar a página
  useEffect(() => {
    // Buscar Clientes
    fetch(`${API_URL}/clients`)
      .then(res => res.json())
      .then(data => setClientes(data.data || []))
      .catch(() => setError('Erro ao buscar clientes.'));

    // Buscar Produtos
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProdutos(data.data || []))
      .catch(() => setError('Erro ao buscar produtos.'));
  }, []);

  const handleAddProduto = () => {
    if (!produtoSelecionado || quantidade <= 0) {
      setError('Selecione um produto e informe uma quantidade válida.');
      return;
    }

    const produtoParaAdicionar = produtos.find(p => p.id === parseInt(produtoSelecionado));
    if (!produtoParaAdicionar) {
      setError('Produto não encontrado.');
      return;
    }
      
    // Verifica se há estoque suficiente
    if (produtoParaAdicionar.quantidade_estoque < quantidade) {
        setError(`Estoque insuficiente para "${produtoParaAdicionar.nome}". Disponível: ${produtoParaAdicionar.quantidade_estoque}`);
        return;
    }

    setPedido(prevPedido => {
      const novosProdutos = [...prevPedido.produtos, { ...produtoParaAdicionar, quantidade }];
      const novoTotal = novosProdutos.reduce((total, p) => total + (Number(p.valor) * p.quantidade), 0);
      return { ...prevPedido, produtos: novosProdutos, valorTotal: novoTotal };
    });

    // Limpar campos
    setProdutoSelecionado('');
    setQuantidade(1);
    setError(null);
  };
    
  const handleFinalizarPedido = async () => {
    if (!pedido.clienteId || pedido.produtos.length === 0) {
      setError('Selecione um cliente e adicione pelo menos um produto ao pedido.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clienteId: pedido.clienteId,
          produtos: pedido.produtos.map(p => ({ produtoId: p.id, quantidade: p.quantidade }))
        })
      });
      
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Falha ao registrar o pedido.');
      }
      
      setSuccess('Pedido realizado com sucesso!');
      setError(null);
      // Resetar estado do pedido
      setPedido({ clienteId: '', produtos: [], valorTotal: 0 });
      // Opcional: redirecionar ou atualizar dados
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  const handleAddCliente = async () => {
    if (!novoCliente.nome || !novoCliente.email) {
      setError('Nome e email são obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(novoCliente)
      });
      
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Falha ao adicionar cliente.');
      }
      
      // Adicionar o novo cliente à lista
      setClientes(prev => [...prev, data.data]);
      // Selecionar automaticamente o novo cliente
      setPedido(prev => ({ ...prev, clienteId: data.data.id.toString() }));
      
      setSuccess('Cliente adicionado com sucesso!');
      setError(null);
      setShowAddCliente(false);
      setNovoCliente({ nome: '', email: '', telefone: '', endereco: '' });

    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="container-caixa">
      <h1>Caixa / Novo Pedido</h1>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* Seleção de Cliente */}
      <div className="form-group">
        <label htmlFor="cliente">Selecione o Cliente</label>
        <div className="cliente-select-container">
          <select 
            id="cliente"
            value={pedido.clienteId}
            onChange={e => setPedido({ ...pedido, clienteId: e.target.value })}
          >
            <option value="">-- Selecione --</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button 
            type="button" 
            onClick={() => setShowAddCliente(true)}
            className="btn-secondary btn-add-cliente"
          >
            + Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Modal para Adicionar Cliente */}
      {showAddCliente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Adicionar Novo Cliente</h3>
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                value={novoCliente.nome}
                onChange={e => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={novoCliente.email}
                onChange={e => setNovoCliente({ ...novoCliente, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                id="telefone"
                value={novoCliente.telefone}
                onChange={e => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                value={novoCliente.endereco}
                onChange={e => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddCliente} className="btn-primary">
                Adicionar Cliente
              </button>
              <button 
                onClick={() => {
                  setShowAddCliente(false);
                  setNovoCliente({ nome: '', email: '', telefone: '', endereco: '' });
                }} 
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <hr />

      {/* Adicionar Produtos ao Pedido */}
      <h2>Adicionar Produto</h2>
      <div className="add-produto-form">
        <div className="form-group">
          <label htmlFor="produto">Produto</label>
          <select id="produto" value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}>
            <option value="">-- Selecione um produto --</option>
            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} (Estoque: {p.quantidade_estoque})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantidade">Quantidade</label>
          <input 
            type="number" 
            id="quantidade"
            value={quantidade}
            onChange={e => setQuantidade(parseInt(e.target.value, 10))}
            min="1"
          />
        </div>
        <button onClick={handleAddProduto} className="btn-secondary">Adicionar ao Pedido</button>
      </div>

      <hr />

      {/* Resumo do Pedido */}
      <h2>Resumo do Pedido</h2>
      {pedido.produtos.length === 0 ? (
        <p>Nenhum produto adicionado.</p>
      ) : (
        <table className="tabela-pedido">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.produtos.map((p, index) => (
              <tr key={index}>
                <td>{p.nome}</td>
                <td>{p.quantidade}</td>
                <td>R$ {Number(p.valor).toFixed(2)}</td>
                <td>R$ {(Number(p.valor) * p.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="total-pedido">
        <h3>Total: R$ {pedido.valorTotal.toFixed(2)}</h3>
      </div>

      <button 
        onClick={handleFinalizarPedido} 
        className="btn-primary btn-finalizar"
        disabled={!pedido.clienteId || pedido.produtos.length === 0}
      >
        Finalizar Pedido
      </button>
    </div>
  );
} 