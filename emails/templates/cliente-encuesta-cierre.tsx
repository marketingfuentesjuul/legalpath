// emails/templates/cliente-encuesta-cierre.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteEncuestaCierreProps {
  firstName?: string
  lawyerName?: string
  caseId?: string
}

export default function ClienteEncuestaCierre({
  firstName = 'Juan',
  lawyerName = 'Carolina López Rivas',
  caseId = '123',
}: ClienteEncuestaCierreProps) {
  return (
    <EmailLayout preview={`¿Cómo te fue con tu asesoría legal en LegalPath? Ayúdanos a mejorar.`}>

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
          ¿Cómo estuvo tu asesoría? 🤔
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, hace unos días seleccionaste a <strong>{lawyerName}</strong> para representarte o asesorarte en tu caso en LegalPath.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Queremos saber cómo ha sido tu experiencia hasta el momento. Tu feedback es totalmente anónimo y de gran valor para ayudarnos a mantener la alta calidad de los profesionales en el directorio de nuestra plataforma.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/calificar/${caseId}`}
            color={colors.client}
          >
            Calificar mi experiencia
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
