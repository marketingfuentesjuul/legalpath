// emails/templates/abogado-verificacion-cuenta.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text } from '../components/brand'

interface AbogadoVerificacionCuentaProps {
  firstName?: string
  verificationUrl?: string
}

export default function AbogadoVerificacionCuenta({
  firstName = 'Carlos',
  verificationUrl = 'https://legalpath.cl/verify?token=example',
}: AbogadoVerificacionCuentaProps) {
  return (
    <EmailLayout preview={`Verifica tu cuenta profesional en LegalPath, ${firstName}.`}>

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
          Verificación de Cuenta Profesional ⚖️
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, gracias por unirte a la red de abogados de LegalPath. Para comenzar a completar tu perfil y subir tus certificados de habilitación profesional, necesitamos verificar tu dirección de correo electrónico.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={verificationUrl}
            color={colors.lawyer}
          >
            Confirmar dirección de correo
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
