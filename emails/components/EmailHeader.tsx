// emails/components/EmailHeader.tsx
import { Section, Row, Column, Text, Hr, Img } from '@react-email/components'
import { colors, fonts, urls } from './brand'

interface EmailHeaderProps {
  accentColor?: string   // color del divisor inferior — por defecto gold
}

export function EmailHeader({ accentColor = colors.gold }: EmailHeaderProps) {
  return (
    <Section style={{
      backgroundColor: colors.bgCard,
      borderRadius: '8px 8px 0 0',
      padding: '24px 32px 20px',
      borderTop: `4px solid ${colors.navy}`,
    }}>
      {/* Logo corporativo */}
      <Img
        src={`${urls.base}/assets/images/logo-light.png`}
        alt="LegalPath Logo"
        width="140"
        style={{
          display: 'block',
          margin: 0,
        }}
      />

      {/* Divisor con color de acento */}
      <Hr style={{
        borderColor: accentColor,
        borderWidth: '1.5px',
        margin: '16px 0 0',
      }} />
    </Section>
  )
}
