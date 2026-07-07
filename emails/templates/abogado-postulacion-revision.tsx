// emails/templates/abogado-postulacion-revision.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

interface AbogadoPostulacionRevisionProps {
  firstName?: string
}

export default function AbogadoPostulacionRevision({
  firstName = 'Carlos',
}: AbogadoPostulacionRevisionProps) {
  return (
    <EmailLayout preview={`Recibimos tus documentos de habilitación profesional — LegalPath.`}>

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
          Recibimos tus antecedentes 📄
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te confirmamos que hemos recibido con éxito los documentos de postulación cargados en tu cuenta.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Nuestro equipo legal está procediendo a validar tu RUT y tu título profesional directamente con el Registro del Poder Judicial de la República de Chile (PJUD).
        </Text>

        <Section style={{
          backgroundColor: colors.bgMuted,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          padding: '16px 20px',
          margin: '20px 0',
        }}>
          <Text style={{
            ...text.small,
            fontFamily: fonts.sans,
            color: colors.textSecondary,
            margin: 0,
            lineHeight: '1.6',
          }}>
            <strong>Plazo estimado:</strong><br />
            Este proceso toma de <strong>24 a 48 horas hábiles</strong>. Te enviaremos un correo electrónico notificándote tan pronto como tu perfil sea verificado y activado para comenzar a enviar propuestas.
          </Text>
        </Section>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textLight,
          margin: 0,
        }}>
          Si tienes dudas o necesitas adjuntar información adicional, puedes responder directamente a este correo.
        </Text>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
