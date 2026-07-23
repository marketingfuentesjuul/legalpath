// emails/templates/cliente-caso-finalizado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteCasoFinalizadoProps {
  firstName?: string
  caseTitle?: string
  lawyerName?: string
}

export default function ClienteCasoFinalizado({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  lawyerName = 'Carolina López Rivas',
}: ClienteCasoFinalizadoProps) {
  return (
    <EmailLayout preview={`Tu caso "${caseTitle}" ha sido finalizado por tu abogado.`}>

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
          Caso Finalizado ⚖️
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te informamos que tu abogado/a <strong>{lawyerName}</strong> ha dado por finalizado el caso: <strong>"{caseTitle}"</strong>.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Esperamos que la gestión y el resultado del caso hayan sido de tu completa satisfacción y todo haya salido de acuerdo a lo esperado.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Queremos recordarte que tu opinión es muy valiosa para nosotros y para ayudar a otros clientes a elegir a los mejores profesionales en LegalPath. Te invitamos a calificar tu experiencia.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

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
