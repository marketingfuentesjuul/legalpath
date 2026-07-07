// emails/components/brand.ts

export const colors = {
  // Corporativos
  navy:       '#1B3A6B',   // títulos, headers, elementos de marca
  gold:       '#C8A951',   // divisores, acentos secundarios
  // Por rol
  client:     '#1ECCA7',   // mint verde — acciones y acentos del cliente
  lawyer:     '#EE6C4D',   // naranja — acciones y acentos del abogado
  // Texto
  textPrimary:   '#1F2937',  // gris-900 — cuerpo principal
  textSecondary: '#6B7280',  // gris-500 — texto de soporte, footers
  textLight:     '#9CA3AF',  // gris-400 — texto terciario
  // Fondos
  bgPage:     '#F3F4F6',   // fondo del email (gris muy claro)
  bgCard:     '#FFFFFF',   // tarjeta contenedora
  bgMuted:    '#F9FAFB',   // fondo de secciones secundarias
  // Estados
  success:    '#10B981',
  warning:    '#F59E0B',
  error:      '#EF4444',
  // Bordes
  border:     '#E5E7EB',
} as const

export const fonts = {
  sans: 'Arial, Helvetica, sans-serif',
} as const

export const spacing = {
  containerMaxWidth: '560px',
  cardPaddingH:      '32px',
  cardPaddingV:      '32px',
  sectionGap:        '24px',
} as const

export const text = {
  // Tamaños en px (inline styles para email)
  h1:   { fontSize: '22px', fontWeight: 700, lineHeight: '1.3' },
  h2:   { fontSize: '18px', fontWeight: 700, lineHeight: '1.4' },
  body: { fontSize: '15px', fontWeight: 400, lineHeight: '1.6' },
  small:{ fontSize: '13px', fontWeight: 400, lineHeight: '1.5' },
  tiny: { fontSize: '11px', fontWeight: 400, lineHeight: '1.5' },
} as const

// Nombre visible del remitente según el contexto
export const sender = {
  name:    'LegalPath',
  from:    'hola@legalpath.cl',
  support: 'hola@legalpath.cl',
  legal:   'legal@legalpath.cl',
} as const

export const urls = {
  base:        process.env.APP_URL || 'https://legalpath.cl',
  dashboard:   `${process.env.APP_URL || 'https://legalpath.cl'}/dashboard`,
  terminos:    `${process.env.APP_URL || 'https://legalpath.cl'}/legal/terminos`,
  privacidad:  `${process.env.APP_URL || 'https://legalpath.cl'}/legal/privacidad`,
  tokens:      `${process.env.APP_URL || 'https://legalpath.cl'}/dashboard/tokens`,
} as const
