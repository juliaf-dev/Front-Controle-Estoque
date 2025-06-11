import AuthForm from '../components/authform';
import AuthToggle from '../components/AuthToggler';

export default function Register() {
  const handleSubmit = (data) => {
    console.log('Cadastro:', data);
    //  lógica de cadastro 
  };

  return (
    <div className="auth-page">
      <h1>Cadastro</h1>
      <AuthForm onSubmit={handleSubmit} isLogin={false} />
      <AuthToggle isLogin={false} />
    </div>
  );
}