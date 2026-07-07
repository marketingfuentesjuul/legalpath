// emails/templates/cliente-cambio-contrasena.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls, sender } from '../components/brand'

interface ClienteCambioContrasenaProps {
  firstName?: string
}

export default function ClienteCambioContrasena({
  firstName = 'Juan',
}: ClienteCambioContrasenaProps) {
  return (
    <EmailLayout preview={`Tu contraseña de LegalPath ha sido actualizada.`}>

      {/* Header con acento verde menta (rol cliente) */}
      <EmailHeader accentColor={colors.client} />

      {/* Card principal */}
      <Section style={{
        backgroundColor: colors.bgCard,
        padding: '32px 32px 24px',
      }}>

        {/* Saludo */}
        <Text style={{
          ...text.h1,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 8px',
        }}>
          Contraseña actualizada 🔒
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te informamos que la contraseña de tu cuenta de LegalPath ha sido cambiada con éxito.
        </Text>

        <Section style={{
          backgroundColor: colors.bgMuted,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          padding: '16px 20px',
          margin: '20px 0',
        }}>
          <Text style={{
            ...text.small,
            fontFamily: fonts.sans,
            color: colors.textSecondary,
            margin: 0,
            lineHeight: '1.6',
          }}>
            <strong>¿No realizaste este cambio?</strong><br />
            Si no has solicitado cambiar tu contraseña, por favor ponte en contacto de forma urgente con nuestro equipo de soporte técnico escribiendo a <a href={`mailto:${sender.support}`} style={{ color: colors.navy }}>{sender.support}</a> para asegurar tu cuenta.
          </Text>
        </Section>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.navy}
          >
            Ir a mi cuenta
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
