import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Datos provisorios
  const recentCases = [
    { id: 1, title: 'Demanda por despido injustificado', client: 'Juan P.', date: 'Hoy', status: 'Nuevo' },
    { id: 2, title: 'Divorcio de mutuo acuerdo', client: 'María G.', date: 'Ayer', status: 'En revisión' },
    { id: 3, title: 'Asesoría creación de empresa', client: 'Empresa SpA', date: 'Hace 2 días', status: 'Cerrado' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Fix position to left, 64 = 16rem = 256px */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between fixed h-screen z-20">
        <div>
          <div className="p-6 flex items-center gap-2">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-8 w-auto" />
            <span className="text-secondary font-bold text-xs mt-1 tracking-tight">Abogados</span>
          </div>
          <nav className="mt-4 px-4 space-y-1.5">
            <SidebarItem icon="grid_view" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon="folder_open" label="Casos activos" active={activeTab === 'casos'} onClick={() => setActiveTab('casos')} />
            <SidebarItem icon="search" label="Buscar casos" active={activeTab === 'buscar'} onClick={() => setActiveTab('buscar')} />
            <SidebarItem icon="toll" label="Mis tokens" active={activeTab === 'tokens'} onClick={() => setActiveTab('tokens')} />
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Link to="/auth/perfil" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-xl transition-all font-semibold">
            <span className="material-symbols-outlined">settings</span>
            <span>Configuración</span>
          </Link>
        </div>
      </aside>

      {/* Main Content - left margin to account for fixed sidebar */}
      <main className="ml-64 flex-1 p-8 xl:p-12 min-h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-10 w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resumen.</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Tu actividad y estadísticas en LegalPath.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#EE6C4D] shadow-sm transition-all relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EE6C4D] rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=A+B&background=EE6C4D&color=fff" alt="Perfil" />
            </div>
          </div>
        </header>

        {/* Bento Grid Layout - Aesthetic similar to references */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Main Hero Card (Large Gradient Banner) */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 group flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10 flex flex-col items-start h-full pb-4">
              <span className="bg-white/10 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full backdrop-blur-md mb-6 border border-white/5 shadow-sm">
                Nuevos Casos Disponibles
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
                Impulsa tu práctica<br/>con más clientes.
              </h2>
              <p className="text-slate-300 mb-8 max-w-sm text-sm font-medium leading-relaxed">
                Revisa los casos ingresados recientemente por usuarios y amplía tu cartera hoy mismo.
              </p>
              <button className="mt-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 px-6 py-3.5 rounded-2xl font-bold transition-all group-hover:scale-105 flex items-center gap-2 backdrop-blur-md border border-white/10">
                Explorar Casos <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
            
            {/* Decorative soft gradients inside the dark card */}
            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-[#EE6C4D]/30 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
            <div className="absolute right-10 -bottom-20 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          </div>

          {/* Stats Column (Right side bento components) */}
          <div className="flex flex-col gap-6">
            
            {/* Vibrant Metric Card */}
            <div className="flex-1 bg-gradient-to-br from-[#EE6C4D] to-orange-400 rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/10">
                  <span className="material-symbols-outlined text-white">folder_open</span>
                </div>
                <div>
                  <h3 className="text-5xl font-black mb-1 tracking-tight">12</h3>
                  <p className="font-semibold text-white/90 text-sm">Casos Activos</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full blur-2xl pointer-events-none"></div>
            </div>
            
            {/* Clean White Metric Card */}
            <div className="flex-1 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
              <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE6C4D]/10 group-hover:text-[#EE6C4D] transition-colors border border-slate-100">
                <span className="material-symbols-outlined">toll</span>
              </div>
              <div>
                <h3 className="text-5xl font-black text-slate-800 mb-1 tracking-tight">450</h3>
                <p className="font-semibold text-slate-500 text-sm">Tokens Disponibles</p>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Cases Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Casos Recientes</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Última actividad en tus casos asesorados.</p>
            </div>
            <button className="flex items-center gap-1 text-[#EE6C4D] text-sm font-bold bg-[#EE6C4D]/5 hover:bg-[#EE6C4D]/10 px-4 py-2 rounded-xl transition-colors">
              Ver todos <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {recentCases.map((caseItem, idx) => (
              <div key={caseItem.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#EE6C4D]/30 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#EE6C4D] group-hover:bg-[#EE6C4D]/10 transition-colors">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-0.5">{caseItem.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{caseItem.client} • {caseItem.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    caseItem.status === 'Nuevo' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    caseItem.status === 'En revisión' ? 'bg-orange-50 text-[#EE6C4D] border border-orange-100' :
                    'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {caseItem.status}
                  </span>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-[#EE6C4D] transition-colors">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

// Helper Component for Sidebar Items
const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
        active 
          ? 'bg-[#EE6C4D]/10 text-[#EE6C4D]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-[#EE6C4D] rounded-full"></div>}
    </button>
  )
}

export default Dashboard
