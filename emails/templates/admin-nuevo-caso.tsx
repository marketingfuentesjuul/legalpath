// emails/templates/admin-nuevo-caso.tsx
import {
  Section, Text, Hr, Row, Column
} from '@react-email/components'
import { EmailLayout }  from '../components/EmailLayout'
import { EmailHeader }  from '../components/EmailHeader'
import { EmailFooter }  from '../components/EmailFooter'
import { EmailButton }  from '../components/EmailButton'
import { colors, fonts, text, urls } from '../components/brand'

interface AdminNuevoCasoProps {
  caseTitle?: string
  clientName?: string
  categoryName?: string
  caseId?: string
}

export default function AdminNuevoCaso({
  caseTitle = 'Asesoría para contrato de arriendo habitacional',
  clientName = 'Juan Gómez',
  categoryName = 'Derecho Civil',
  caseId = '123',
}: AdminNuevoCasoProps) {
  return (
    <EmailLayout preview={`[ADMIN] Nuevo caso pendiente de curación: ${caseTitle}.`}>

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
          Nuevo caso por curar 📄
        </Text>

        <Text style={{
          ...text.body,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          margin: '0 0 20px',
        }}>
          Se ha ingresado un nuevo caso en la plataforma y se encuentra en estado **pendiente de revisión (en_revision)**.
        </Text>

        <Hr style={{ borderColor: colors.border, margin: '0 0 20px' }} />

        {/* Detalle del caso */}
        <Text style={{
          ...text.h2,
          fontFamily: fonts.sans,
          color: colors.navy,
          margin: '0 0 12px',
        }}>
          Detalles del Requerimiento
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
                Título Caso:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {caseTitle}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Cliente:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, margin: 0 }}>
                {clientName}
              </Text>
            </Column>
          </Row>

          <Row style={{ marginBottom: '8px' }}>
            <Column style={{ width: '130px' }}>
              <Text style={{ ...text.small, fontFamily: fonts.sans, color: colors.textSecondary, margin: 0 }}>
                Categoría:
              </Text>
            </Column>
            <Column>
              <Text style={{ ...text.body, fontFamily: fonts.sans, color: colors.textPrimary, fontWeight: 700, margin: 0 }}>
                {categoryName}
              </Text>
            </Column>
          </Row>
        </Section>

        {/* CTA */}
        <Section style={{ textAlign: 'center' as const, margin: '0 0 8px' }}>
          <EmailButton
            href={`${urls.base}/admin/casos?id=${caseId}`}
            color={colors.navy}
          >
            Ver cola de casos
          </EmailButton>
        </Section>

      </Section>

      {/* Footer */}
      <EmailFooter />

    </EmailLayout>
  )
}
