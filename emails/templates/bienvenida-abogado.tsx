// emails/templates/bienvenida-abogado.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

// Props que recibe desde la Edge Function send-email
interface BienvenidaAbogadoProps {
  firstName?: string
  lastName?:  string
  email?:     string
}

// Valores por defecto para el preview en React Email
export default function BienvenidaAbogado({
  firstName = 'Carlos',
  lastName  = 'Pérez',
  email     = 'carlos.perez@ejemplo.cl',
}: BienvenidaAbogadoProps) {
  return (
    <EmailLayout preview={`Bienvenido a LegalPath, ${firstName}. Tu registro fue recibido.`}>

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
          Bienvenido, {firstName} 👋
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Tu registro en LegalPath fue recibido exitosamente. Ya puedes ver tu panel, pero antes de enviar propuestas a los casos necesitamos verificar tu habilitación profesional.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Qué sigue */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          ¿Qué pasa ahora?
        </Text>

        {/* Paso 1 */}
        <Row style={{ marginBottom: '12px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.lawyer,
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
              <strong>Carga tus documentos</strong> de habilitación profesional desde tu panel. Si ya los cargaste al registrarte, este paso ya está listo.
            </Text>
          </Column>
        </Row>

        {/* Paso 2 */}
        <Row style={{ marginBottom: '12px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.lawyer,
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
              <strong>Nuestro equipo revisa</strong> tu habilitación en el registro del Poder Judicial de Chile. Este proceso toma hasta <strong>5 días hábiles</strong>.
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
              backgroundColor: colors.lawyer,
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
              <strong>Recibirás un correo</strong> con el resultado. Si eres aprobado, podrás adquirir tokens y comenzar a enviar propuestas de inmediato.
            </Text>
          </Column>
        </Row>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.lawyer}
          >
            Ir a mi panel
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
          Cuenta registrada con:
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
