// emails/templates/aprobacion-abogado.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

// Props que recibe desde la Edge Function
interface AprobacionAbogadoProps {
  firstName?: string
  lastName?:  string
  email?:     string
}

export default function AprobacionAbogado({
  firstName = 'Carlos',
  lastName  = 'Pérez',
  email     = 'carlos.perez@ejemplo.cl',
}: AprobacionAbogadoProps) {
  return (
    <EmailLayout preview={`¡Tu perfil ha sido aprobado en LegalPath, ${firstName}!`}>

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
          ¡Tu perfil ha sido aprobado! 🎉
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Hola {firstName}, tenemos excelentes noticias. Nuestro equipo ha completado la revisión de tus antecedentes en el Poder Judicial y tu perfil ha sido **aprobado con éxito**.
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          A partir de ahora, ya tienes habilitado el acceso completo a la plataforma para:
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Qué puede hacer ahora */}
        <Row style={{ marginBottom: '12px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.success,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              ✓
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Adquirir planes de tokens</strong> para poder postular a los casos activos.
            </Text>
          </Column>
        </Row>

        <Row style={{ marginBottom: '12px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.success,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              ✓
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Enviar propuestas personalizadas</strong> directamente a los clientes que buscan asesoría legal.
            </Text>
          </Column>
        </Row>

        <Row style={{ marginBottom: '24px' }}>
          <Column style={{ width: '36px', verticalAlign: 'top' }}>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: colors.success,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              textAlign: 'center' as const,
              lineHeight: '24px',
              margin: '1px 0 0',
              display: 'inline-block',
            }}>
              ✓
            </Text>
          </Column>
          <Column>
            <Text style={{
              ...text.body,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              margin: 0,
            }}>
              <strong>Gestionar tus casos y propuestas</strong> desde tu panel de control de forma simple y ágil.
            </Text>
          </Column>
        </Row>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={urls.dashboard}
            color={colors.lawyer}
          >
            Acceder a mi panel
          </EmailButton>
        </Section>

      </Section>

      {/* Bloque de datos registrados */}
      <Section style={{
        backgroundColor: colors.bgMuted,
        padding: '16px 32px',
        borderLeft: `3px solid ${colors.success}`,
        margin: '0',
      }}>
        <Text style={{
          ...text.small,
          fontFamily: fonts.sans,
          color: colors.textSecondary,
          margin: '0 0 4px',
        }}>
          Perfil verificado para:
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
