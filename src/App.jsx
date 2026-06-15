import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import ScrollToTop from './components/layout/ScrollToTop'
import PageTransition from './components/layout/PageTransition'

import AdminGuard from './components/AdminGuard'
import LawyerGuard from './components/LawyerGuard'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import LawyerQueue from './pages/admin/LawyerQueue'
import LawyerReview from './pages/admin/LawyerReview'
import CaseQueue from './pages/admin/CaseQueue'
import CaseEditor from './pages/admin/CaseEditor'
import AdminLogin from './pages/admin/AdminLogin'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth/login" replace />
  return children
}

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/abogados" element={<PageTransition><Abogados /></PageTransition>} />
            <Route path="/publicar-caso" element={<PageTransition><PublicarCaso /></PageTransition>} />
          </Route>
          <Route path="/auth/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/auth/perfil" element={<PageTransition><ProtectedRoute><Perfil /></ProtectedRoute></PageTransition>} />
          <Route path="/auth/registro" element={<PageTransition><Registro /></PageTransition>} />
          <Route path="/auth/validacion" element={<PageTransition><Validacion /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><LawyerGuard><Dashboard /></LawyerGuard></PageTransition>} />

          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />

          {/* Admin panel routes */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="abogados" element={<PageTransition><LawyerQueue /></PageTransition>} />
            <Route path="abogados/:id" element={<PageTransition><LawyerReview /></PageTransition>} />
            <Route path="casos" element={<PageTransition><CaseQueue /></PageTransition>} />
            <Route path="casos/:id" element={<PageTransition><CaseEditor /></PageTransition>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App

