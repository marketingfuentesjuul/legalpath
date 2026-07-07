// emails/templates/cliente-cuenta-desactivada.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface ClienteCuentaDesactivadaProps {
  firstName?: string
}

export default function ClienteCuentaDesactivada({
  firstName = 'Juan',
}: ClienteCuentaDesactivadaProps) {
  return (
    <EmailLayout preview={`Tu cuenta en LegalPath ha sido desactivada correctamente.`}>

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
          Cuenta desactivada 👤
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te confirmamos que hemos desactivado tu cuenta en LegalPath conforme a tu solicitud.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Tus datos personales e información asociada a casos han sido desactivados y entraron en un proceso de anonimización y resguardo temporal de acuerdo con nuestras políticas de retención de datos y la legislación vigente de protección de la vida privada.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: 0,
        }}>
          Lamentamos verte partir. Si alguna vez necesitas asesoría legal en el futuro, las puertas de LegalPath siempre estarán abiertas para ti.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
