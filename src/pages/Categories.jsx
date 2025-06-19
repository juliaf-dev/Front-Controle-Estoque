import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success === false) throw new Error(data.error || 'Erro ao buscar categorias');
        setCategories(data.data || data);
      })
      .catch(err => setError(err.message));
  }, []);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setLoadingProducts(true);
    setProducts([]);
    fetch(`${API_URL}/products?categoria_id=${cat.id}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || data);
        setLoadingProducts(false);
      })
      .catch(() => {
        setProducts([]);
        setLoadingProducts(false);
      });
    navigate(`/categories/${cat.id}`);
  };

  return (
    <div className="auth-page">
      <h1>Categorias</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {categories.length === 0 && !error && <p>Nenhuma categoria encontrada.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        {categories.map((cat) => (
          <button key={cat.id || cat.nome} onClick={() => handleCategoryClick(cat)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', background: selectedCategory?.id === cat.id ? '#007bff' : '#f8f9fa', color: selectedCategory?.id === cat.id ? '#fff' : '#222', cursor: 'pointer', fontWeight: 'bold' }}>
            {cat.nome}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <div style={{ marginTop: '32px', textAlign: 'left' }}>
          <h2>Produtos da categoria: {selectedCategory.nome}</h2>
          {loadingProducts && <p>Carregando produtos...</p>}
          {!loadingProducts && products.length === 0 && <p>Nenhum produto encontrado para esta categoria.</p>}
          <ul>
            {products.map(prod => (
              <li key={prod.id} style={{ marginBottom: '8px' }}>
                <strong>{prod.nome}</strong> (Código: {prod.codigo}) - Estoque: {prod.quantidade_estoque} - Valor: R$ {prod.valor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 