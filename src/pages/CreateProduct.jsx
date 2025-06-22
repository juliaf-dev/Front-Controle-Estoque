import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    categoria_id: '',
    fornecedor_id: '',
    quantidade_estoque: '',
    valor: '',
    descricao: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [categoriesRes, fornecedoresRes] = await Promise.all([
          axios.get(`${API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/fornecedor`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setCategories(categoriesRes.data.data || categoriesRes.data);
        setFornecedores(fornecedoresRes.data.data || []);
      } catch (err) {
        setError('Erro ao carregar dados');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...formData,
        codigo: parseInt(formData.codigo),
        quantidade_estoque: parseInt(formData.quantidade_estoque),
        valor: parseFloat(formData.valor),
        categoria_id: parseInt(formData.categoria_id),
        fornecedor_id: parseInt(formData.fornecedor_id)
      };

      await axios.post(`${API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao cadastrar produto. Verifique se o fornecedor está selecionado.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar Novo Produto</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="codigo">Código:</label>
          <input
            type="number"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria_id">Categoria:</label>
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fornecedor_id">Fornecedor:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              id="fornecedor_id"
              name="fornecedor_id"
              value={formData.fornecedor_id}
              onChange={handleChange}
              required
              style={{ flex: 1 }}
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => navigate('/fornecedores/novo')} className="btn btn-secondary">
              Novo
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="quantidade_estoque">Quantidade em Estoque:</label>
          <input
            type="number"
            id="quantidade_estoque"
            name="quantidade_estoque"
            value={formData.quantidade_estoque}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="valor">Valor:</label>
          <input
            type="number"
            id="valor"
            name="valor"
            step="0.01"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
};

export default CreateProduct; 