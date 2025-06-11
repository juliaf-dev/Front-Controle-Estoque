import AuthForm from '../components/authform';
import AuthToggle from '../components/AuthToggler';

export default function Login() {
  const handleSubmit = (data) => {
    console.log('Login:', data);
    // lógica de autenticação 
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <AuthForm onSubmit={handleSubmit} isLogin={true} />
      <AuthToggle isLogin={true} />
    </div>
  );
}