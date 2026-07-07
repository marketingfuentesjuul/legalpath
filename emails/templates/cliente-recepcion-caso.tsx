// emails/templates/cliente-recepcion-caso.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteRecepcionCasoProps {
  firstName?: string
  caseTitle?: string
}

export default function ClienteRecepcionCaso({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
}: ClienteRecepcionCasoProps) {
  return (
    <EmailLayout preview={`Hemos recibido tu caso en LegalPath y lo estamos preparando.`}>

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
          Recibimos tu caso 📄
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, tu caso <strong>"{caseTitle}"</strong> ha sido ingresado correctamente a nuestro sistema.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          En este momento, nuestro equipo de moderadores está revisando la información para:
        </Text>

        <Section style={{
          backgroundColor: colors.bgMuted,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          padding: '16px 20px',
          margin: '20px 0',
        }}>
          <ul style={{
            fontFamily: fonts.sans,
            fontSize: '14px',
            color: colors.textPrimary,
            margin: 0,
            paddingLeft: '20px',
            lineHeight: '1.6',
          }}>
            <li>Asegurar que no se divulguen datos personales ni de contacto de forma pública.</li>
            <li>Darle un formato estructurado y entendible para los abogados.</li>
            <li>Clasificarlo en la categoría correcta para alertar a los especialistas adecuados.</li>
          </ul>
        </Section>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Este proceso suele tardar menos de 24 horas hábiles. Te avisaremos apenas el caso sea aprobado y publicado en el marketplace.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.client}
          >
            Ver estado de mi caso
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
