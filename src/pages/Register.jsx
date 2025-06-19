import AuthForm from '../components/authform';
import AuthToggle from '../components/AuthToggler';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function Register() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      setError(null);
      setSuccess(false);
      await register(data.email, data.password, data.name);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h1>Cadastro</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>Cadastro realizado! Redirecionando...</p>}
      <AuthForm onSubmit={handleSubmit} isLogin={false} />
      <AuthToggle isLogin={false} />
    </div>
  );
}