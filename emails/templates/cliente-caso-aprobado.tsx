// emails/templates/cliente-caso-aprobado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteCasoAprobadoProps {
  firstName?: string
  caseTitle?: string
  caseId?: string
}

export default function ClienteCasoAprobado({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  caseId = '123',
}: ClienteCasoAprobadoProps) {
  return (
    <EmailLayout preview={`¡Tu caso ya está activo y visible para los abogados en LegalPath!`}>

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
          ¡Caso aprobado y activo! 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, tenemos excelentes noticias. Tu caso <strong>"{caseTitle}"</strong> ha sido verificado por nuestros especialistas y ya se encuentra <strong>publicado y activo</strong> en el marketplace.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          A partir de ahora, los abogados validados que se especializan en esta área del derecho podrán ver los detalles generales y enviarte sus propuestas técnicas y cotizaciones. Te notificaremos inmediatamente cada vez que recibas una propuesta.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/${caseId}`}
            color={colors.client}
          >
            Ir a mi panel de LegalPath
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
