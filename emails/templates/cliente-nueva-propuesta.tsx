// emails/templates/cliente-nueva-propuesta.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteNuevaPropuestaProps {
  firstName?: string
  caseTitle?: string
  lawyerName?: string
  lawyerSpecialty?: string
  estimatedPrice?: string
  caseId?: string
}

export default function ClienteNuevaPropuesta({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  lawyerName = 'Carolina L.',
  lawyerSpecialty = 'Derecho Civil y Contractual',
  estimatedPrice = '$80.000 CLP',
  caseId = '123',
}: ClienteNuevaPropuestaProps) {
  return (
    <EmailLayout preview={`¡Has recibido una nueva propuesta de asesoría legal en LegalPath!`}>

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
          Nueva propuesta recibida ✉️
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, un abogado interesado en tu caso <strong>"{caseTitle}"</strong> te ha enviado una propuesta de asesoría legal.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Resumen de la oferta */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          Resumen de la propuesta
        </Text>

        <Section style={{
          backgroundColor: colors.bgMuted,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          padding: '16px 20px',
          margin: '0 0 24px',
        }}>
          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Abogado:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {lawyerName} (Habilitado PJUD)
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Especialidad:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, margin: 0 }}>
                {lawyerSpecialty}
              </Text>
            </Column>
          </Row>

          {estimatedPrice && (
            <Row style={{ marginBottom: '8px' }}>
              <Column style={{ width: '130px' }}>
                <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                  Honorarios Est.:
                </Text>
              </Column>
              <Column>
                <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.client, fontWeight: 700, margin: 0 }}>
                  {estimatedPrice}
                </Text>
              </Column>
            </Row>
          )}
        </Section>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 24px',
        }}>
          Ingresa de forma segura a tu cuenta de LegalPath para revisar el mensaje completo del abogado, ver su perfil, currículum y calificaciones de otros usuarios.
        </Text>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/${caseId}`}
            color={colors.client}
          >
            Revisar propuesta
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
