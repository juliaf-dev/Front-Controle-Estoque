import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateFornecedor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    situacao: 1, // Padrão para 'Ativo'
  });
  const [error, setError] = useState('');

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
      const fornecedorData = {
        ...formData,
        situacao: parseInt(formData.situacao),
      };

      await axios.post(`${API_URL}/fornecedor/registrar`, fornecedorData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Volta para a página de criação de produto após o sucesso
      navigate('/produtos/novo');

    } catch (err) {
      setError('Erro ao cadastrar fornecedor');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar Novo Fornecedor</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form">
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
          <label htmlFor="situacao">Situação:</label>
          <select
            id="situacao"
            name="situacao"
            value={formData.situacao}
            onChange={handleChange}
            required
          >
            <option value={1}>Ativo</option>
            <option value={0}>Inativo</option>
          </select>
        </div>

        <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Cadastrar Fornecedor
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                Voltar
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFornecedor; 