import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = false; // Substitua por lógica real (ex: verifique um token)

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}