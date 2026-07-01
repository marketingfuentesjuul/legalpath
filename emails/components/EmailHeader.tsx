// emails/components/EmailHeader.tsx
import { Section, Row, Column, Text, Hr } from '@react-email/components'
import { colors, fonts } from './brand'

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
      {/* Logo textual */}
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: '22px',
        fontWeight: 700,
        color: colors.navy,
        margin: 0,
        letterSpacing: '-0.5px',
      }}>
        LegalPath
      </Text>
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: '11px',
        color: colors.textSecondary,
        margin: '2px 0 0',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
      }}>
        Plataforma LegalTech Chilena
      </Text>
      {/* Divisor con color de acento */}
      <Hr style={{
        borderColor: accentColor,
        borderWidth: '1.5px',
        margin: '16px 0 0',
      }} />
    </Section>
  )
}
