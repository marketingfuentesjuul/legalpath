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
          margin: '0 0 24px',
        }}>
          Para poder iniciar formalmente la asesoría legal, puedes revisar los datos de contacto directo del cliente en tu panel de control de LegalPath.
        </Text>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/dashboard?tab=casos`}
            color={colors.lawyer}
          >
            Ver los datos del cliente
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
