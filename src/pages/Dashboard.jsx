import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/styles.css';

// Exemplo de acesso à variável de ambiente da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar produtos');
        setLoading(false);
      });
  }, []);

  // Espaço reservado para dados do usuário e integração com API
  // Exemplo: const [user, setUser] = useState(null);
  // useEffect(() => { fetch(`${API_URL}/rota`).then(...); }, []);

  function handleCardClick(id) {
    setExpandedProductId(expandedProductId === id ? null : id);
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-buttons">
          <Link to="/produtos/novo" className="btn btn-primary">Novo Produto</Link>
          <button className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <section className="dashboard-cards">
        <Link to="/categories" className="dashboard-card">
          <h2>Categorias</h2>
          <p>Organize suas categorias</p>
        </Link>
        <Link to="/pedidos" className="dashboard-card">
          <h2>Pedidos</h2>
          <p>Acompanhe os pedidos</p>
        </Link>
      </section>
      <section style={{ marginTop: 32 }}>
        <h2>Produtos em Destaque</h2>
        {loading && <p>Carregando produtos...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}
        <div className="webcommerce-grid">
          {products.length === 0 && !loading && !error && <p>Nenhum produto encontrado.</p>}
          {products.map(prod => (
            <div key={prod.id} className="webcommerce-card" onClick={() => handleCardClick(prod.id)} style={{cursor: 'pointer'}}>
              <div className="webcommerce-card-img" />
              <div className="webcommerce-card-body">
                <h3>{prod.nome}</h3>
                <p>Estoque: {prod.quantidade_estoque}</p>
                {prod.descricao && <p style={{fontSize: '0.95em', color: '#555'}}>{prod.descricao}</p>}
                {expandedProductId === prod.id && (
                  <div className="webcommerce-card-extra">
                    <p><strong>Código:</strong> {prod.codigo}</p>
                    <p><strong>Valor:</strong> R$ {prod.valor}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}