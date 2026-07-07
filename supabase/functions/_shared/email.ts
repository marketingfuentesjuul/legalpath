import { Resend } from 'npm:resend'
import { templates } from './templates.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '')
const FROM_EMAIL = 'LegalPath <hola@legalpath.cl>'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  templateName: string
  variables: Record<string, string | number>
}

/**
 * Renders a template by replacing its {{key}} placeholders with values
 */
export function renderTemplate(templateName: string, variables: Record<string, string | number>): string {
  let html = templates[templateName]
  if (!html) {
    throw new Error(`Template "${templateName}" not found in templates bundle.`);
  }

  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{${key}}}`, String(value))
  }

  return html
}

/**
 * Sends a transactional email using the compiled React Email templates
 */
export async function sendEmail({ to, subject, templateName, variables }: SendEmailOptions) {
  try {
    const html = renderTemplate(templateName, variables)

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (result.error) {
      throw new Error(`Resend API error: ${JSON.stringify(result.error)}`);
    }

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error(`Error sending email [${templateName}] to ${to}:`, error)
    throw error
  }
}
