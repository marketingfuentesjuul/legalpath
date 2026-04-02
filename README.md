# LegalPath

Plataforma LegalTech B2B/B2C que conecta a personas que necesitan asesoría legal con abogados calificados.

## Stack Tecnológico

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Fuentes**: Plus Jakarta Sans (títulos), Inter (cuerpo) — vía Google Fonts
- **Backend (planificado)**: Supabase (Auth + PostgreSQL + Storage)

## Estructura del Proyecto

```
legalpath/
│
├── public/                         # Assets estáticos públicos
│   └── assets/
│       └── images/                 # Imágenes del sitio
│           ├── logo-light.png      # Logo para fondos claros
│           ├── logo-dark.png       # Logo para fondos oscuros
│           └── hero-mockup.png     # Imagen del hero
│
├── src/                            # Código fuente
│   ├── pages/                      # Páginas HTML
│   │   ├── index.html              # Landing Page (usuarios)
│   │   ├── abogados.html           # Landing Page (abogados)
│   │   ├── publicar-caso.html      # Flujo: Publicar caso
│   │   └── auth/                   # Flujo de autenticación
│   │       ├── registro-abogado.html           # Paso 1: Cuenta
│   │       ├── registro-abogado-paso-2.html    # Paso 2: Perfil
│   │       └── registro-abogado-validacion.html # Paso 3: Verificación
│   │
│   └── styles/                     # CSS externo (futuro)
│
├── architecture/                   # SOPs técnicos (Layer 1 de A.N.T.)
│   └── ui-modifications.md
│
├── docs/                           # Documentación del proyecto
│   ├── constitution.md             # Constitución del proyecto (esquemas, reglas)
│   ├── master-prompt.md            # Protocolo B.L.A.S.T.
│   ├── progress.md                 # Bitácora de progreso
│   ├── findings.md                 # Hallazgos e investigación
│   └── task-plan.md                # Plan de fases y tareas
│
├── .gitignore
└── README.md
```

## Identidad Visual

| Audiencia | Color Primario | Gradiente CSS |
|-----------|---------------|---------------|
| Usuarios  | `#1ECCA7` (Celeste/Mint) | `linear-gradient(135deg, #1ECCA7, #63fbd3)` |
| Abogados  | `#EE6C4D` (Naranja) | `linear-gradient(135deg, #EE6C4D, #ff8a6d)` |

## Correr Localmente

No se requiere build. Abrir directamente los archivos HTML en el navegador:

```bash
# Opción recomendada: servidor local con Live Server (VS Code)
# O usar Python:
python3 -m http.server 8000
# Abrir: http://localhost:8000/src/pages/index.html
```

## Base de Datos (Supabase — Schema)

Ver `docs/constitution.md` para el schema completo de tablas: `profiles`, `cases`, `case_attachments`, `proposals`.

## Convenciones

- Nomenclatura de archivos: **kebab-case** (`nombre-de-archivo.html`)
- Imágenes: nombres semánticos en inglés (`logo-light.png`, no `logo-fondo-transparente.png`)
- Documentación interna: carpeta `docs/`
- SOPs técnicos: carpeta `architecture/`

---

*Protocolo de desarrollo: B.L.A.S.T. — Ver `docs/master-prompt.md`*
