import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Fornecedores() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFornecedores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/fornecedores`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar fornecedores');
        }
        
        setFornecedores(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFornecedores();
  }, []);

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header-modern">
        <div className="header-left">
          <h1 className="dashboard-title">Fornecedores</h1>
          <p className="dashboard-subtitle">Gerencie seus fornecedores</p>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button className="btn-action btn-secondary" onClick={handleVoltar}>
              <span className="btn-icon">←</span>
              Voltar
            </button>
          </div>
        </div>
      </header>

      <section className="products-section">
        <div className="section-header">
          <h2>Lista de Fornecedores</h2>
          <div className="section-actions">
            <span className="fornecedores-count">
              {fornecedores.length} fornecedor{fornecedores.length !== 1 ? 'es' : ''} cadastrado{fornecedores.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {loading && <div className="loading-spinner">Carregando fornecedores...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="fornecedores-grid">
          {fornecedores.length === 0 && !loading && !error && (
            <div className="no-products">
              <div className="no-products-icon">🏢</div>
              <p>Nenhum fornecedor encontrado.</p>
            </div>
          )}

          {fornecedores.map(fornecedor => (
            <div key={fornecedor.id} className="fornecedor-card">
              <div className="fornecedor-icon">🏢</div>
              <div className="fornecedor-info">
                <h3 className="fornecedor-name">{fornecedor.nome}</h3>
                <div className="fornecedor-status">
                  <span className={`status-badge ${fornecedor.situacao === 1 ? 'ativo' : 'inativo'}`}>
                    {fornecedor.situacao === 1 ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="fornecedor-id">ID: {fornecedor.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 