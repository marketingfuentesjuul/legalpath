// emails/templates/cliente-caso-finalizado.tsx
import {
  Section, Text
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { colors, fonts, text } from '../components/brand'

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

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
