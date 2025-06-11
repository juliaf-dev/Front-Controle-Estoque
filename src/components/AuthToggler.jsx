import { Link } from 'react-router-dom';

export default function AuthToggle({ isLogin }) {
  return (
    <div>
      <p>
        {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
        <Link to={isLogin ? '/register' : '/login'}>
          {isLogin ? 'Cadastre-se' : 'Faça Login'}
        </Link>
      </p>
      {isLogin && (
        <p>
          <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </p>
      )}
    </div>
  );
}