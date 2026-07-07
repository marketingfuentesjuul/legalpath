// emails/templates/compra-tokens.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

// Props que recibe desde la Edge Function
interface CompraTokensProps {
  firstName?: string
  lastName?:  string
  email?:     string
  pkgName?:   string
  tokensCount?: number
  amountClp?: number
  provider?: string
}

export default function CompraTokens({
  firstName = 'Carlos',
  lastName  = 'Pérez',
  email     = 'carlos.perez@ejemplo.cl',
  pkgName   = 'Plan Abogado Premium',
  tokensCount = 50,
  amountClp   = 25000,
  provider    = 'Flow',
}: CompraTokensProps) {
  // Formatear monto CLP
  const formattedAmount = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amountClp)

  return (
    <EmailLayout preview={`Confirmación de tu compra: ${pkgName}.`}>

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
          ¡Gracias por tu compra! 💳
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, te confirmamos que hemos recibido correctamente tu pago de tokens en LegalPath. Los tokens ya están disponibles en tu cuenta para ser utilizados de inmediato.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Detalle de la transacción */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 16px',
        }}>
          Resumen de Transacción
        </Text>

        <Section style={{
          backgroundColor: colors.bgMuted,
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          padding: '16px 20px',
          margin: '0 0 24px',
        }}>
          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Detalle / Paquete:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {pkgName}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Tokens Abonados:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.lawyer, fontWeight: 700, margin: 0 }}>
                +{tokensCount} tokens
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Monto Pagado:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {formattedAmount}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Método de Pago:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, textTransform: 'capitalize' as const, margin: 0 }}>
                {provider}
              </Text>
            </Column>
          </Row>
        </Section>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 24px',
        }}>
          Puedes revisar tu saldo actual e historial de uso de tokens directamente en la sección de tokens en tu dashboard.
        </Text>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.tokens}
            color={colors.lawyer}
          >
            Ver mis tokens
          </EmailButton>
        </Section>

      </Section>

      {/* Bloque de datos registrados */}
      <Section style={{
        backgroundColor: colors.bgMuted,
        padding: '16px 32px',
        borderLeft: `3px solid ${colors.lawyer}`,
        margin: '0',
      }}>
        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: '0 0 4px',
        }}>
          Transacción asociada a:
        </Text>
        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          fontWeight: 700,
          margin: 0,
        }}>
          {firstName} {lastName} · {email}
        </Text>
      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
