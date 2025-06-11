
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/authform';
import AuthToggle from '../components/AuthToggler';

export default function Login() {
  const navigate = useNavigate();
//  lógica de login
  const handleSubmit = (data) => {
    console.log('Login:', data);
    
    if (data.email && data.password) {
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <AuthForm onSubmit={handleSubmit} isLogin={true} />
      <AuthToggle isLogin={true} />
    </div>
  );
}