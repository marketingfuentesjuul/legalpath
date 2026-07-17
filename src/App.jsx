import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabaseClient'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home/Home'
import PublicarCaso from './pages/PublicarCaso/PublicarCaso'
import Abogados from './pages/Abogados/Abogados'
import Registro from './pages/Auth/Registro'
import Perfil from './pages/Auth/Perfil'
import Validacion from './pages/Auth/Validacion'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Abogados/Dashboard'
import TokenConfirmacion from './pages/dashboard/tokens/Confirmacion'
import TokenError from './pages/dashboard/tokens/Error'
import { useAuth } from './context/AuthContext'
import ScrollToTop from './components/layout/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import HelpWidget from './components/ui/HelpWidget'
import LegalDocs from './pages/Legal/LegalDocs'

import AdminGuard from './components/AdminGuard'
import LawyerGuard from './components/LawyerGuard'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import LawyerQueue from './pages/admin/LawyerQueue'
import LawyerReview from './pages/admin/LawyerReview'
import CaseQueue from './pages/admin/CaseQueue'
import CaseEditor from './pages/admin/CaseEditor'
import AdminLogin from './pages/admin/AdminLogin'
import LawyersManagement from './pages/admin/LawyersManagement'
import ClientsManagement from './pages/admin/ClientsManagement'


// Client imports
import ClienteGuard from './components/ClienteGuard'
import ClienteLayout from './pages/cliente/ClienteLayout'
import MisCasos from './pages/cliente/MisCasos'
import Propuestas from './pages/cliente/Propuestas'
import Configuracion from './pages/cliente/Configuracion'
import PublicarCasoCliente from './pages/cliente/PublicarCasoCliente'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth/login-abogado" replace />
  return children
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading || !user) return

    const guestPages = ['/', '/auth/login', '/auth/login-cliente', '/auth/login-abogado', '/auth/registro']
    if (guestPages.includes(location.pathname)) {
      const handleRedirect = async () => {
        const role = user.user_metadata?.role || 'lawyer'

        if (role === 'lawyer') {
          const { data: profile } = await supabase
            .from('lawyer_profiles')
            .select('verification_status')
            .eq('id', user.id)
            .maybeSingle()

          if (!profile) {
            navigate('/auth/perfil', { replace: true })
          } else if (profile.verification_status === 'approved') {
            navigate('/dashboard', { replace: true })
          } else {
            navigate('/auth/validacion', { replace: true })
          }
        } else {
          const { data: profile } = await supabase
            .from('client_profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

          if (profile) {
            navigate('/cliente', { replace: true })
          }
        }
      }
      handleRedirect()
    }
  }, [user, loading, location.pathname, navigate])

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/abogados" element={<PageTransition><Abogados /></PageTransition>} />
            <Route path="/publicar-caso" element={<PageTransition><PublicarCaso /></PageTransition>} />
            <Route path="/legal/:docType" element={<LegalDocs />} />
            <Route path="/legal" element={<Navigate to="/legal/terminos" replace />} />
            <Route path="/terminos" element={<Navigate to="/legal/terminos" replace />} />
            <Route path="/privacidad" element={<Navigate to="/legal/privacidad" replace />} />
          </Route>
          <Route path="/auth/login" element={<Navigate to="/auth/login-cliente" replace />} />
          <Route path="/auth/login-cliente" element={<PageTransition><Login role="client" /></PageTransition>} />
          <Route path="/auth/login-abogado" element={<PageTransition><Login role="lawyer" /></PageTransition>} />
          <Route path="/auth/perfil" element={<PageTransition><ProtectedRoute><Perfil /></ProtectedRoute></PageTransition>} />
          <Route path="/auth/registro" element={<PageTransition><Registro /></PageTransition>} />
          <Route path="/auth/validacion" element={<PageTransition><Validacion /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><LawyerGuard><Dashboard /></LawyerGuard></PageTransition>} />
          <Route path="/dashboard/tokens/confirmacion" element={<PageTransition><LawyerGuard><TokenConfirmacion /></LawyerGuard></PageTransition>} />
          <Route path="/dashboard/tokens/error" element={<PageTransition><LawyerGuard><TokenError /></LawyerGuard></PageTransition>} />

          <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />

          {/* Client panel routes */}
          <Route
            path="/cliente"
            element={
              <ClienteGuard>
                <ClienteLayout />
              </ClienteGuard>
            }
          >
            <Route index element={<Navigate to="/cliente/mis-casos" replace />} />
            <Route path="mis-casos" element={<PageTransition><MisCasos /></PageTransition>} />
            <Route path="propuestas" element={<PageTransition><Propuestas /></PageTransition>} />
            <Route path="configuracion" element={<PageTransition><Configuracion /></PageTransition>} />
            <Route path="publicar-caso" element={<PageTransition><PublicarCasoCliente /></PageTransition>} />
          </Route>

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
            <Route path="abogados-gestor" element={<PageTransition><LawyersManagement /></PageTransition>} />
            <Route path="clientes" element={<PageTransition><ClientsManagement /></PageTransition>} />
            <Route path="casos" element={<PageTransition><CaseQueue /></PageTransition>} />
            <Route path="casos/:id" element={<PageTransition><CaseEditor /></PageTransition>} />
          </Route>
        </Routes>
      </AnimatePresence>
      <HelpWidget />
    </>
  )
}

export default App


