// emails/templates/abogado-perfil-baneado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilBaneadoProps {
  firstName?: string
  reason?: string
}

export default function AbogadoPerfilBaneado({
  firstName = 'Carlos',
  reason = 'Infracción grave de los términos de la plataforma.',
}: AbogadoPerfilBaneadoProps) {
  return (
    <EmailLayout preview={`Tu cuenta profesional en LegalPath ha sido bloqueada permanentemente.`}>

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
          Cuenta bloqueada permanentemente 🚫
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te informamos que tu cuenta profesional en LegalPath ha sido desactivada y bloqueada permanentemente debido a la siguiente razón:
        </Text>

        <Section style={{
          backgroundColor: '#FEF2F2',
          borderLeft: `4px solid ${colors.error}`,
          padding: '16px',
          margin: '0 0 20px',
          borderRadius: '4px',
        }}>
          <Text style={{
            ...text.body,
            fontFamily: fonts.sans,
            color: '#991B1B',
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
          Debido a esta sanción, tu perfil ha sido retirado del marketplace de forma definitiva y no podrás volver a ingresar a la plataforma.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Si deseas conocer más detalles sobre esta sanción o quieres presentar una réplica, puedes responder directamente a este correo o escribir a nuestro equipo de soporte técnico.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
