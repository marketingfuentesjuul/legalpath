// emails/templates/rechazo-abogado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

// Props que recibe desde la Edge Function
interface RechazoAbogadoProps {
  firstName?: string
  lastName?:  string
  email?:     string
  rejectionReason?: string
}

export default function RechazoAbogado({
  firstName = 'Carlos',
  lastName  = 'Pérez',
  email     = 'carlos.perez@ejemplo.cl',
  rejectionReason = 'La firma o timbre del documento de habilitación profesional no coincide con los registros oficiales o no es legible.',
}: RechazoAbogadoProps) {
  return (
    <EmailLayout preview={`Actualización de tu perfil en LegalPath, ${firstName}.`}>

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
          Actualización de tu perfil
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, hemos revisado tu solicitud de habilitación profesional y, por el momento, **no ha sido posible verificar tu perfil** en el registro del Poder Judicial de Chile.
        </Text>

        {rejectionReason && (
          <Section style={{
            backgroundColor: '#FEF2F2',
            border: `1px solid ${colors.error}`,
            borderRadius: '6px',
            padding: '16px 20px',
            margin: '20px 0',
          }}>
            <Text style={{
              ...text.small,
              fontFamily: fonts.sans,
              color: colors.error,
              fontWeight: 700,
              margin: '0 0 4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Motivo de rechazo:
            </Text>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: '#991B1B',
              margin: 0,
            }}>
              {rejectionReason}
            </Text>
          </Section>
        )}

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Para poder continuar con tu habilitación, por favor ingresa a tu perfil para corregir los datos o cargar nuevamente los documentos requeridos.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/perfil`}
            color={colors.lawyer}
          >
            Actualizar mi perfil
          </EmailButton>
        </Section>

      </Section>

      {/* Bloque de datos registrados */}
      <Section style={{
        backgroundColor: colors.bgMuted,
        padding: '16px 32px',
        borderLeft: `3px solid ${colors.error}`,
        margin: '0',
      }}>
        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: '0 0 4px',
        }}>
          Cuenta asociada a:
        </Text>
        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          fontWeight: 700,
          margin: 0,
        }}>
          {firstName} {lastName} · {email}
        </Text>
      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
