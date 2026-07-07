// emails/templates/cliente-recordatorio-propuestas.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteRecordatorioPropuestasProps {
  firstName?: string
  caseTitle?: string
  proposalsCount?: number
  caseId?: string
}

export default function ClienteRecordatorioPropuestas({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  proposalsCount = 3,
  caseId = '123',
}: ClienteRecordatorioPropuestasProps) {
  return (
    <EmailLayout preview={`Tienes ${proposalsCount} propuestas de abogados esperando tu respuesta en LegalPath.`}>

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
          Propuestas pendientes de revisión ⏰
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te recordamos que tienes <strong>{proposalsCount} propuestas profesionales</strong> en espera para tu caso activo <strong>"{caseTitle}"</strong>.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Los abogados en LegalPath se comprometen a dar respuestas rápidas. Te sugerimos revisar las alternativas recibidas para coordinar una reunión o formalizar el servicio antes de que expiren los plazos o los abogados tomen otros compromisos.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/${caseId}`}
            color={colors.client}
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
