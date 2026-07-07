// emails/templates/abogado-propuesta-aceptada.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface AbogadoPropuestaAceptadaProps {
  firstName?: string
  caseTitle?: string
  clientName?: string
  clientEmail?: string
}

export default function AbogadoPropuestaAceptada({
  firstName = 'Carlos',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  clientName = 'Juan Gómez',
  clientEmail = 'juan.gomez@ejemplo.cl',
}: AbogadoPropuestaAceptadaProps) {
  return (
    <EmailLayout preview={`¡Excelente noticia! Tu propuesta ha sido aceptada por el cliente.`}>

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
          ¡Propuesta Aceptada! 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, el cliente ha aceptado tu propuesta de servicios para el caso: <strong>"{caseTitle}"</strong>.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Te facilitamos los datos de contacto directo del cliente a continuación para que te comuniques e inicies formalmente la asesoría legal:
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Datos de contacto del cliente */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          Datos de Contacto del Cliente
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
                Cliente:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {clientName}
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
                {clientEmail}
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
            <strong>Nota operativa:</strong> El cliente ya ha recibido tus datos de contacto (nombre y correo registrado) y espera tu comunicación.
          </Text>
        </Section>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.lawyer}
          >
            Ver mis propuestas
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
