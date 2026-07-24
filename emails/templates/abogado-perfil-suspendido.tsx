// emails/templates/abogado-perfil-suspendido.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilSuspendidoProps {
  firstName?: string
  reason?: string
}

export default function AbogadoPerfilSuspendido({
  firstName = 'Carlos',
  reason = 'Infracción de los términos de la plataforma.',
}: AbogadoPerfilSuspendidoProps) {
  return (
    <EmailLayout preview={`Tu cuenta profesional en LegalPath ha sido suspendida.`}>

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
          Cuenta suspendida ⚠️
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te informamos que tu cuenta profesional en LegalPath ha sido suspendida temporalmente debido a la siguiente razón:
        </Text>

        <Section style={{
          backgroundColor: '#FFFBEB',
          borderLeft: `4px solid ${colors.warning}`,
          padding: '16px',
          margin: '0 0 20px',
          borderRadius: '4px',
        }}>
          <Text style={{
            ...text.body,
            fontFamily: fonts.sans,
            color: '#B45309',
            margin: 0,
            fontStyle: 'italic',
          }}>
            "{reason}"
          </Text>
        </Section>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Durante el período de suspensión, tu perfil no estará visible en el marketplace y no podrás acceder a tu panel de control ni enviar nuevas propuestas.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Si deseas conocer más detalles sobre los motivos de esta decisión o quieres presentar una réplica, puedes responder directamente a este correo o escribir a nuestro equipo de soporte técnico.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
