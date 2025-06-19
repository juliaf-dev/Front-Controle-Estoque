import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/categories/${id}`).then(res => res.json()),
      fetch(`${API_URL}/products?categoria_id=${id}`).then(res => res.json())
    ])
      .then(([catData, prodData]) => {
        setCategory(catData.data || catData);
        setProducts(prodData.data || prodData);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar dados da categoria');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="auth-page">
      {loading && <p>Carregando...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {category && <h1>Categoria: {category.nome}</h1>}
      {!loading && products.length === 0 && <p>Nenhum produto encontrado para esta categoria.</p>}
      <ul>
        {products.map(prod => (
          <li key={prod.id} style={{ marginBottom: '8px' }}>
            <strong>{prod.nome}</strong> (Código: {prod.codigo}) - Estoque: {prod.quantidade_estoque} - Valor: R$ {prod.valor}
          </li>
        ))}
      </ul>
    </div>
  );
} 