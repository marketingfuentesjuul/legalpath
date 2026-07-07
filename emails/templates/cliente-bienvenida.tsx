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
              <strong>Describe tu caso:</strong> Publica de forma confidencial tu problema o necesidad legal. Nuestro equipo moderará el caso para proteger tu privacidad.
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
              <strong>Recibe propuestas:</strong> Abogados debidamente certificados y habilitados ante el Poder Judicial analizarán tu caso y te enviarán propuestas.
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
              <strong>Elige la mejor opción:</strong> Evalúa los perfiles de los abogados, sus honorarios y calificaciones, y selecciona al indicado para tu caso.
            </Text>
          </Column>
        </Row>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/casos/nuevo`}
            color={colors.client}
          >
            Publicar mi primer caso
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
