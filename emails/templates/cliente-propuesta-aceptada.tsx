// emails/templates/cliente-propuesta-aceptada.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClientePropuestaAceptadaProps {
  firstName?: string
  caseTitle?: string
  lawyerName?: string
  lawyerEmail?: string
  lawyerPhone?: string
}

export default function ClientePropuestaAceptada({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  lawyerName = 'Carolina López Rivas',
  lawyerEmail = 'carolina.lopez@colegioabogados.cl',
  lawyerPhone = '+56 9 1234 5678',
}: ClientePropuestaAceptadaProps) {
  return (
    <EmailLayout preview={`¡Asesoría confirmada! Te enviamos los datos de contacto del abogado.`}>

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
          ¡Asesoría Confirmada! 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, has aceptado con éxito la propuesta para tu caso <strong>"{caseTitle}"</strong>.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hemos notificado a tu abogado para que se ponga en contacto contigo a la brevedad. A continuación, te facilitamos sus datos directos para que puedas iniciar la comunicación de forma inmediata:
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Datos de contacto del abogado */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          Datos del Profesional
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
                Nombre Abogado:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {lawyerName}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Email:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.navy, fontWeight: 700, margin: 0 }}>
                {lawyerEmail}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Teléfono:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, margin: 0 }}>
                {lawyerPhone}
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '6px',
          padding: '12px 16px',
          margin: '0 0 24px',
        }}>
          <Text style={{
            ...text.small,
            fontFamily: fonts.sans,
            color: colors.textSecondary,
            margin: 0,
            lineHeight: '1.5',
          }}>
            <strong>Nota de seguridad:</strong> Por tu privacidad, el abogado también ha recibido tus datos básicos de registro (nombre y correo electrónico) para poder coordinar la asesoría.
          </Text>
        </Section>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.client}
          >
            Ir a mi panel
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
