# LegalPath

Plataforma LegalTech B2B/B2C que conecta a personas que necesitan asesoría legal con abogados calificados.

## Stack Tecnológico

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Routing**: React Router 7
- **Fuentes**: Plus Jakarta Sans (títulos), Inter (cuerpo) — vía Google Fonts
- **Backend (planificado)**: Supabase (Auth + PostgreSQL + Storage)

## Estructura del Proyecto

```
legalpath/
│
├── public/                         # Assets estáticos públicos
│   └── assets/
│       └── images/                 # Imágenes del sitio
│
├── src/                            # Código fuente
│   ├── components/                 # Componentes reutilizables
│   ├── pages/                      # Páginas de la aplicación
│   ├── styles/                     # Estilos globales (index.css)
│   ├── App.jsx                     # Enrutador principal
│   └── main.jsx                    # Punto de entrada
│
├── architecture/                   # SOPs técnicos (Layer 1 de A.N.T.)
│
├── docs/                           # Documentación del proyecto
│
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

## Identidad Visual

| Audiencia | Color Primario | Gradiente CSS |
|-----------|---------------|---------------|
| Usuarios  | `#1ECCA7` (Celeste/Mint) | `linear-gradient(135deg, #1ECCA7, #63fbd3)` |
| Abogados  | `#EE6C4D` (Naranja) | `linear-gradient(135deg, #EE6C4D, #ff8a6d)` |

## Correr Localmente

```bash
npm install
npm run dev
```

---

*Protocolo de desarrollo: B.L.A.S.T. — Ver `docs/master-prompt.md`*
