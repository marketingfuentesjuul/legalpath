import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home/Home'
import PublicarCaso from './pages/PublicarCaso/PublicarCaso'
import Abogados from './pages/Abogados/Abogados'
import Registro from './pages/Auth/Registro'
import Perfil from './pages/Auth/Perfil'
import Validacion from './pages/Auth/Validacion'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Abogados/Dashboard'
import { useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.is_anonymous) return <Navigate to="/auth/login" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/abogados" element={<Abogados />} />
        <Route path="/publicar-caso" element={<PublicarCaso />} />
      </Route>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/auth/registro" element={<Registro />} />
      <Route path="/auth/validacion" element={<Validacion />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
