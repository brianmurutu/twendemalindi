import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Twende Malindi <onboarding@resend.dev>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('mock')) {
    console.log(`[Resend Mock] Sending email to ${to}: "${subject}"`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
