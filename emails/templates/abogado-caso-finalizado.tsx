// emails/templates/abogado-caso-finalizado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface AbogadoCasoFinalizadoProps {
  firstName?: string
  caseTitle?: string
  clientName?: string
}

export default function AbogadoCasoFinalizado({
  firstName = 'Carlos',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  clientName = 'Juan Gómez',
}: AbogadoCasoFinalizadoProps) {
  return (
    <EmailLayout preview={`Has finalizado el caso "${caseTitle}" con éxito.`}>

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
          ¡Caso Finalizado con Éxito! 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Estimado/a {firstName}, te confirmamos que has dado por finalizado el caso: <strong>"{caseTitle}"</strong> con el cliente <strong>{clientName}</strong>.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Agradecemos tu compromiso y profesionalismo en la gestión de este caso. Tu labor contribuye a mantener el alto estándar de calidad en LegalPath.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Te invitamos a seguir revisando el marketplace para enviar nuevas propuestas a clientes que necesitan tu asesoría.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.lawyer}
          >
            Buscar nuevos casos
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
