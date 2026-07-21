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
          margin: '0 0 24px',
        }}>
          Hemos notificado a tu abogado para que se ponga en contacto contigo a la brevedad y comiencen a coordinar la asesoría legal.
        </Text>

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
