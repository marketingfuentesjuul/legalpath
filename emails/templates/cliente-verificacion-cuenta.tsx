// emails/templates/cliente-verificacion-cuenta.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text } from '../components/brand'

interface ClienteVerificacionCuentaProps {
  firstName?: string
  verificationUrl?: string
}

export default function ClienteVerificacionCuenta({
  firstName = 'Juan',
  verificationUrl = 'https://legalpath.cl/verify?token=example',
}: ClienteVerificacionCuentaProps) {
  return (
    <EmailLayout preview={`Confirma tu correo electrónico para comenzar en LegalPath, ${firstName}.`}>

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
          ¡Bienvenido a LegalPath! 👋
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, gracias por registrarte en nuestra plataforma. Para poder activar tu cuenta y comenzar a publicar tus casos de forma segura, necesitamos confirmar tu dirección de correo electrónico.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={verificationUrl}
            color={colors.client}
          >
            Confirmar mi cuenta
          </EmailButton>
        </Section>

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          textAlign: 'center' as const,
          margin: '20px 0 0',
        }}>
          Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br />
          <span style={{ color: colors.navy, wordBreak: 'break-all' }}>{verificationUrl}</span>
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
