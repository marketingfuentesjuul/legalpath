// emails/templates/abogado-perfil-reactivado-ban.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilReactivadoBanProps {
  firstName?: string
}

export default function AbogadoPerfilReactivadoBan({
  firstName = 'Carlos',
}: AbogadoPerfilReactivadoBanProps) {
  return (
    <EmailLayout preview={`Tu cuenta en LegalPath ha sido restituida.`}>

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
          Cuenta restituida 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te informamos que tras revisar los antecedentes o tu réplica de apelación, el equipo de administración de LegalPath ha decidido retirar el bloqueo permanente y restituir por completo tu perfil profesional.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Tu acceso a la plataforma ha sido habilitado nuevamente. Ya puedes volver a iniciar sesión, revisar tus propuestas y postular a los casos activos de nuestros clientes.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Agradecemos tu paciencia durante el proceso de revisión. Si tienes dudas sobre los términos de uso aceptable, no dudes en escribir a nuestro equipo de soporte técnico.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
