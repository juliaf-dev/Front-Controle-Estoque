import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import CreateProduct from './pages/CreateProduct';

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
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}