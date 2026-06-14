import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Paso 1: Autenticar con Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (signInError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }

    // Paso 2: Verificar que el usuario tiene rol admin activo
    const { data: adminProfile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('id, full_name, is_active')
      .eq('id', data.user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (profileError || !adminProfile) {
      // Cerrar sesión inmediatamente si no es admin
      await supabase.auth.signOut()
      setError('Esta cuenta no tiene acceso al panel de administración.')
      setLoading(false)
      return
    }

    // Acceso concedido — redirigir al dashboard admin o a la página previa
    const from = location.state?.from || '/admin'
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/images/logo-admin.png"
            alt="LegalPath Logo"
            className="h-14 w-auto mx-auto mb-4"
          />
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Panel de Administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">

          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Iniciar sesión
          </h1>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gabrielmezaroo@gmail.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent
                           placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent
                             placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium
                         hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                'Ingresar al panel'
              )}
            </button>

          </form>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Acceso restringido al equipo interno de LegalPath.
          </p>

        </div>

        {/* Link de regreso */}
        <div className="text-center mt-4">
          <a href="/" className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
            ← Volver al sitio
          </a>
        </div>

      </div>
    </div>
  )
}
