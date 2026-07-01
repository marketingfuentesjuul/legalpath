// emails/components/EmailButton.tsx
import { Button } from '@react-email/components'
import { colors, fonts } from './brand'

interface EmailButtonProps {
  href: string
  children: string
  color?: string        // color de fondo del botón
  textColor?: string    // color del texto
}

export function EmailButton({
  href,
  children,
  color = colors.navy,
  textColor = '#FFFFFF',
}: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        display: 'inline-block',
        backgroundColor: color,
        color: textColor,
        fontFamily: fonts.sans,
        fontSize: '15px',
        fontWeight: 700,
        padding: '14px 28px',
        borderRadius: '6px',
        textDecoration: 'none',
        textAlign: 'center' as const,
        cursor: 'pointer',
      }}
    >
      {children}
    </Button>
  )
}
