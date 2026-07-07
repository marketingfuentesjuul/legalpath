// emails/templates/admin-nuevo-abogado.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface AdminNuevoAbogadoProps {
  lawyerName?: string
  lawyerEmail?: string
  lawyerRut?: string
  lawyerId?: string
}

export default function AdminNuevoAbogado({
  lawyerName = 'Carlos Pérez',
  lawyerEmail = 'carlos.perez@ejemplo.cl',
  lawyerRut = '12.345.678-9',
  lawyerId = '123',
}: AdminNuevoAbogadoProps) {
  return (
    <EmailLayout preview={`[ADMIN] Solicitud de validación de abogado: ${lawyerName}.`}>

      {/* Header con acento azul marino (rol admin) */}
      <EmailHeader accentColor={colors.navy} />

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
          Validación de abogado pendiente ⚖️
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Un nuevo abogado ha finalizado la carga de sus antecedentes y documentos de habilitación. Su perfil se encuentra en estado **pendiente de validación (verification_status = 'pending')**.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Detalle del abogado */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          Detalles de la Postulación
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
                Nombre Completo:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {lawyerName}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                RUT:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, margin: 0 }}>
                {lawyerRut}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Email:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.navy, fontWeight: 700, margin: 0 }}>
                {lawyerEmail}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/admin/abogados?id=${lawyerId}`}
            color={colors.navy}
          >
            Ver perfil en revisión
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
