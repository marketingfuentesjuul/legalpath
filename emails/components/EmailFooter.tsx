// emails/components/EmailFooter.tsx
import { Section, Text, Link, Hr } from '@react-email/components'
import { colors, fonts, urls, sender } from './brand'

export function EmailFooter() {
  return (
    <Section style={{
      backgroundColor: colors.bgMuted,
      borderRadius: '0 0 8px 8px',
      padding: '20px 32px 24px',
      borderTop: `1px solid ${colors.border}`,
    }}>
      <Hr style={{ borderColor: colors.border, margin: '0 0 16px' }} />

      {/* Links legales */}
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: '12px',
        color: colors.textSecondary,
        margin: '0 0 8px',
        textAlign: 'center' as const,
      }}>
        <Link href={urls.terminos} style={{ color: colors.navy, textDecoration: 'none' }}>
          Términos y Condiciones
        </Link>
        {'  ·  '}
        <Link href={urls.privacidad} style={{ color: colors.navy, textDecoration: 'none' }}>
          Política de Privacidad
        </Link>
        {'  ·  '}
        <Link href={`mailto:${sender.support}`} style={{ color: colors.navy, textDecoration: 'none' }}>
          Contacto
        </Link>
      </Text>

      {/* Dirección legal */}
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: '11px',
        color: colors.textLight,
        margin: '0',
        textAlign: 'center' as const,
        lineHeight: '1.6',
      }}>
        LegalPath SpA · República de Chile{'\n'}
        Este correo fue enviado a tu dirección registrada en LegalPath.{'\n'}
        Si no creaste una cuenta, ignora este mensaje.
      </Text>
    </Section>
  )
}
