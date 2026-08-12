// emails/components/EmailFooter.tsx
import { Section, Text, Link, Hr } from '@react-email/components'
import { colors, fonts, urls, sender } from './brand'

interface EmailFooterProps {
  showUnsubscribe?: boolean
}

export function EmailFooter({ showUnsubscribe = false }: EmailFooterProps) {
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
        LegalPath SpA · RUT: 78.449.452-7 · República de Chile{'\n'}
        Recibes este correo porque está asociado a transacciones, notificaciones o al correcto funcionamiento de tu cuenta en LegalPath.{'\n'}
        Si no creaste una cuenta, por favor ignora este mensaje.
        {showUnsubscribe && (
          <>
            {'\n'}
            Para no recibir correos informativos o de encuestas, puedes{' '}
            <Link href={`${urls.base}/unsubscribe`} style={{ color: colors.navy, textDecoration: 'underline' }}>
              desuscribirte aquí
            </Link>.
          </>
        )}
      </Text>
    </Section>
  )
}
