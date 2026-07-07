// emails/templates/abogado-caso-cerrado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface AbogadoCasoCerradoProps {
  firstName?: string
  caseTitle?: string
}

export default function AbogadoCasoCerrado({
  firstName = 'Carlos',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
}: AbogadoCasoCerradoProps) {
  return (
    <EmailLayout preview={`Actualización del caso: ${caseTitle}.`}>

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
          Caso finalizado o cerrado 📋
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te informamos que el caso <strong>"{caseTitle}"</strong> al cual habías postulado ha sido cerrado o el cliente ha seleccionado otra de las propuestas recibidas.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Agradecemos tu interés y tu propuesta. Te invitamos a seguir revisando la lista de casos activos en nuestro marketplace para enviar cotizaciones a otros proyectos afines con tu especialidad.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.lawyer}
          >
            Buscar casos activos
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
