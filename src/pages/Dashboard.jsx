import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/styles.css';

// Exemplo de acesso à variável de ambiente da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/products`).then(res => res.json()),
      fetch(`${API_URL}/categories`).then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.data || productsData);
        setCategories(categoriesData.data || categoriesData);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar dados');
        setLoading(false);
      });
  }, []);

  function handleCardClick(id) {
    setExpandedProductId(expandedProductId === id ? null : id);
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);
    // Aqui você pode filtrar produtos por categoria se desejar
  };

  return (
    <div className="dashboard-container">
      {/* Header Moderno */}
      <header className="dashboard-header-modern">
        <div className="header-left">
          <h1 className="dashboard-title">Controle de Estoque</h1>
          <p className="dashboard-subtitle">Gerencie seus produtos e vendas</p>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <Link to="/produtos/novo" className="btn-action btn-primary">
              <span className="btn-icon">+</span>
              Novo Produto
            </Link>
            <button className="btn-action btn-logout" onClick={handleLogout}>
              <span className="btn-icon">🚪</span>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Seção de Acesso Rápido */}
      <section className="quick-access-section">
        <div className="quick-access-grid">
        <Link to="/caixa" className="btn-action btn-secondary">
              <span className="btn-icon">💰</span>
              Caixa
            </Link>
            <Link to="/fornecedores" className="btn-action btn-secondary">
              <span className="btn-icon">🏢</span>
              Fornecedores
            </Link>
            <Link to="/historico-vendas" className="btn-action btn-secondary">
              <span className="btn-icon">📊</span>
              Vendas
            </Link>
           
        </div>
      </section>

      {/* Seção de Produtos em Destaque */}
      <section className="products-section">
        <div className="section-header">
          <h2>Produtos em Destaque</h2>
          <div className="section-actions">
            <button 
              className="btn-filter-categories"
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            >
              <span className="btn-icon">🏷️</span>
              Filtrar por Categoria
              <span className="filter-arrow">{showCategoryFilter ? '▲' : '▼'}</span>
            </button>
            {selectedCategory && (
              <div className="category-filter">
                <span>Filtrado por: {selectedCategory.nome}</span>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="btn-clear-filter"
                >
                  Limpar filtro
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filtro de Categorias */}
        {showCategoryFilter && (
          <div className="category-filter-dropdown">
            <div className="categories-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter-btn ${selectedCategory?.id === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className="category-icon">📁</span>
                  <span className="category-name">{category.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {loading && <div className="loading-spinner">Carregando produtos...</div>}
        {error && <div className="error-message">{error}</div>}
        
        <div className="products-grid">
          {products.length === 0 && !loading && !error && (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
          
          {products.map(prod => (
            <div 
              key={prod.id} 
              className="product-card" 
              onClick={() => handleCardClick(prod.id)}
            >
              <div className="product-image">
                <div className="product-icon">📦</div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{prod.nome}</h3>
                <p className="product-stock">Estoque: {prod.quantidade_estoque}</p>
                {prod.descricao && (
                  <p className="product-description">{prod.descricao}</p>
                )}
                {expandedProductId === prod.id && (
                  <div className="product-details">
                    <p><strong>Código:</strong> {prod.codigo}</p>
                    <p><strong>Valor:</strong> R$ {Number(prod.valor).toFixed(2)}</p>
                    {prod.categoria && (
                      <p><strong>Categoria:</strong> {prod.categoria.nome}</p>
                    )}
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