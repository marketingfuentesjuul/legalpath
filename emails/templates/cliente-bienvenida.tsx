// emails/templates/cliente-bienvenida.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface ClienteBienvenidaProps {
  firstName?: string
}

export default function ClienteBienvenida({
  firstName = 'Juan',
}: ClienteBienvenidaProps) {
  return (
    <EmailLayout preview={`Tu camino legal comienza aquí — ¿Cómo funciona LegalPath?`}>

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
          Tu camino legal comienza aquí 🚀
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, ahora que tu cuenta está activa, te explicamos en 3 sencillos pasos cómo puedes encontrar la mejor asesoría legal con profesionales validados:
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Paso 1 */}
        <Row style={{ marginBottom: '16px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.client,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              1
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Tu primer caso ya ha sido publicado.</strong>
            </Text>
          </Column>
        </Row>

        {/* Paso 2 */}
        <Row style={{ marginBottom: '16px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.client,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              2
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Recibe propuestas:</strong> Ahora cuando te empiecen a llegar propuestas, tú tendrás que decidir si dejar, aceptar o seguir buscando que te lleguen más propuestas o esperando por propuestas.
            </Text>
          </Column>
        </Row>

        {/* Paso 3 */}
        <Row style={{ marginBottom: '24px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.client,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              3
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Elige la mejor opción:</strong> Una vez que eliges una de las propuestas, entonces le facilitamos tus datos de contacto al abogado y comenzarán con el proceso legal.
            </Text>
          </Column>
        </Row>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/cliente`}
            color={colors.client}
          >
            Ir a mi panel de cliente
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
