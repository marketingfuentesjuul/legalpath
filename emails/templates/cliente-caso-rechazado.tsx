// emails/templates/cliente-caso-rechazado.tsx
import {
  Section, Text, Hr
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteCasoRechazadoProps {
  firstName?: string
  caseTitle?: string
  rejectionReason?: string
  caseId?: string
}

export default function ClienteCasoRechazado({
  firstName = 'Juan',
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  rejectionReason = 'El caso contiene números telefónicos y datos de contacto en la descripción pública. Favor eliminarlos para que podamos publicar de forma segura.',
  caseId = '123',
}: ClienteCasoRechazadoProps) {
  return (
    <EmailLayout preview={`Actualización sobre tu caso en LegalPath: se requieren detalles.`}>

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
          Detalles adicionales requeridos
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, hemos revisado tu caso <strong>"{caseTitle}"</strong> y notamos que necesitamos realizar algunas correcciones antes de poder activarlo y mostrarlo a los abogados.
        </Text>

        {rejectionReason && (
          <Section style={{
            backgroundColor: '#FFFBEB',
            border: `1px solid ${colors.warning}`,
            borderRadius: '6px',
            padding: '16px 20px',
            margin: '20px 0',
          }}>
            <Text style={{
              ...text.small,
              fontFamily: fonts.sans,
              color: colors.warning,
              fontWeight: 700,
              margin: '0 0 4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Sugerencia de corrección:
            </Text>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: '#92400E',
              margin: 0,
            }}>
              {rejectionReason}
            </Text>
          </Section>
        )}

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Puedes editar los detalles de tu caso de forma fácil ingresando a tu panel de control de LegalPath. Una vez guardados los cambios, volveremos a revisarlo para publicarlo lo antes posible.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 24px' }} />

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/editar/${caseId}`}
            color={colors.client}
          >
            Modificar caso
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
