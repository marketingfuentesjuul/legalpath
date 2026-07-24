// emails/templates/abogado-perfil-eliminado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilEliminadoProps {
  firstName?: string
}

export default function AbogadoPerfilEliminado({
  firstName = 'Abogado',
}: AbogadoPerfilEliminadoProps) {
  return (
    <EmailLayout preview={`Lamentamos que hayas decidido eliminar tu perfil.`}>

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
          Tu perfil en LegalPath 👤
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, lamentamos que hayas decidido eliminar tu perfil profesional. Esperamos que vuelvas pronto.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Toda tu información personal ha sido anonimizada permanentemente y tus propuestas activas han sido retiradas de nuestra plataforma, resguardando la privacidad de tu cuenta de conformidad con las políticas del sitio.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Si en el futuro deseas volver a ser parte de nuestra red de profesionales, siempre serás bienvenido/a. Solo deberás crear un nuevo perfil profesional en nuestra página de registro.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
