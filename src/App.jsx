import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home/Home'
import PublicarCaso from './pages/PublicarCaso/PublicarCaso'
import Abogados from './pages/Abogados/Abogados'
import Registro from './pages/Auth/Registro'
import Perfil from './pages/Auth/Perfil'
import Validacion from './pages/Auth/Validacion'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/abogados" element={<Abogados />} />
        <Route path="/publicar-caso" element={<PublicarCaso />} />
      </Route>
      <Route path="/auth/perfil" element={<Perfil />} />
      <Route path="/auth/registro" element={<Registro />} />
      <Route path="/auth/validacion" element={<Validacion />} />
    </Routes>
  )
}

export default App
