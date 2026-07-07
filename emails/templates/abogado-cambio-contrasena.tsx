// emails/templates/abogado-cambio-contrasena.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls, sender } from '../components/brand'

interface AbogadoCambioContrasenaProps {
  firstName?: string
}

export default function AbogadoCambioContrasena({
  firstName = 'Carlos',
}: AbogadoCambioContrasenaProps) {
  return (
    <EmailLayout preview={`Tu contraseña profesional de LegalPath ha sido actualizada.`}>

      {/* Header con acento naranja (rol abogado) */}
      <EmailHeader accentColor={colors.lawyer} />

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
          Contraseña profesional actualizada 🔒
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te informamos que la contraseña de tu cuenta profesional en LegalPath ha sido modificada con éxito.
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
            Si no has solicitado este cambio de clave, por favor contáctanos de inmediato a <a href={`mailto:${sender.support}`} style={{ color: colors.navy }}>{sender.support}</a> para suspender temporalmente el acceso y verificar tu seguridad.
          </Text>
        </Section>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.navy}
          >
            Ir a mi panel
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
