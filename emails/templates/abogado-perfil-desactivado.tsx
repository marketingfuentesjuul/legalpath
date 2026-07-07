// emails/templates/abogado-perfil-desactivado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilDesactivadoProps {
  firstName?: string
}

export default function AbogadoPerfilDesactivado({
  firstName = 'Carlos',
}: AbogadoPerfilDesactivadoProps) {
  return (
    <EmailLayout preview={`Tu perfil profesional en LegalPath ha sido desactivado.`}>

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
          Perfil profesional desactivado 👤
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te confirmamos que tu cuenta profesional en LegalPath ha sido desactivada correctamente de nuestro sistema de acuerdo con tu solicitud.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Toda la información personal, certificados cargados e historial de propuestas han sido quitados de la vista pública del marketplace y entraron en un proceso de resguardo y posterior anonimización de conformidad con nuestra política de privacidad de datos.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Te agradecemos por el tiempo dedicado y por ofrecer tus servicios a través de LegalPath. Si decides regresar en el futuro, por favor contáctanos para reactivar tus credenciales profesionales.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
