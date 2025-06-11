import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email para recuperação:', email);
    // Simulação de envio 
    setMessage(`Um link de recuperação foi enviado para ${email}`);
  };

  return (
    <div className="auth-page">
      <h1>Recuperar Senha</h1>
      {message ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar Link</button>
        </form>
      )}
      <p>
        Lembrou sua senha? <Link to="/login">Voltar ao Login</Link>
      </p>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre- se</Link>
      </p>
    </div>
  );
}