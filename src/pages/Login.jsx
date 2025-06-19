import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/authform';
import AuthToggle from '../components/AuthToggler';
import { useState } from 'react';
import { login } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    try {
      setError(null);
      const result = await login(data.email, data.password);
      localStorage.setItem('token', result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <AuthForm onSubmit={handleSubmit} isLogin={true} />
      <AuthToggle isLogin={true} />
    </div>
  );
}