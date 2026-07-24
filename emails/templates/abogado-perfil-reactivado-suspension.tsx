// emails/templates/abogado-perfil-reactivado-suspension.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPerfilReactivadoSuspensionProps {
  firstName?: string
}

export default function AbogadoPerfilReactivadoSuspension({
  firstName = 'Carlos',
}: AbogadoPerfilReactivadoSuspensionProps) {
  return (
    <EmailLayout preview={`Tu cuenta en LegalPath ha sido reactivada.`}>

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
          Cuenta reactivada 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te informamos que la suspensión temporal de tu perfil profesional en LegalPath ha sido levantada por el equipo de administración.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Tu perfil es visible nuevamente en el marketplace para clientes potenciales, tus tokens se encuentran activos y ya puedes ingresar a tu panel de control para enviar nuevas propuestas a casos abiertos.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Te agradecemos por tu compromiso con nuestras directrices y términos de servicio. Si tienes alguna duda adicional, por favor ponte en contacto con nuestro equipo de soporte.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
