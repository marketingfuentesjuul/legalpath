// emails/components/EmailLayout.tsx
import {
  Html, Head, Body, Container, Preview,
  Font
} from '@react-email/components'
import { colors, fonts, spacing } from './brand'

interface EmailLayoutProps {
  preview: string          // texto que aparece en la bandeja antes de abrir el correo
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head>
        <Font
          fontFamily="Arial"
          fallbackFontFamily="Helvetica"
          webFont={undefined}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{
        backgroundColor: colors.bgPage,
        fontFamily: fonts.sans,
        margin: 0,
        padding: '40px 16px',
      }}>
        <Container style={{
          maxWidth: spacing.containerMaxWidth,
          margin: '0 auto',
        }}>
          {children}
        </Container>
      </Body>
    </Html>
  )
}
