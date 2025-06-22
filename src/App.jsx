import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import CreateProduct from './pages/CreateProduct';
import CreateFornecedor from './pages/CreateFornecedor';
import Caixa from './pages/Caixa';
import SalesHistory from './pages/SalesHistory';
import Fornecedores from './pages/Fornecedores';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/categories/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
        <Route path="/produtos/novo" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
        <Route path="/fornecedores/novo" element={<ProtectedRoute><CreateFornecedor /></ProtectedRoute>} />
        <Route path="/caixa" element={<ProtectedRoute><Caixa /></ProtectedRoute>} />
        <Route path="/historico-vendas" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
        <Route path="/fornecedores" element={<ProtectedRoute><Fornecedores /></ProtectedRoute>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}