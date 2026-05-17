import { Injectable } from '@nestjs/common';
import { renderTemplate } from './templates/render';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly from = process.env.EMAIL_FROM || 'NovaBuilder <noreply@novabuilder.app>';

  async send(options: EmailOptions): Promise<{ ok: boolean; messageId?: string }> {
    const transport = process.env.SMTP_HOST;

    if (!transport) {
      console.log(`[Email] Would send to ${options.to}: ${options.subject}`);
      console.log(`[Email] HTML length: ${options.html.length} chars`);
      return { ok: true, messageId: `dev-${Date.now()}` };
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer') as any;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { ok: true, messageId: result.messageId };
  }

  async sendMagicLink(to: string, data: { name: string; link: string }) {
    const html = renderTemplate('magic-link', data);
    return this.send({ to, subject: 'Your login link for NovaBuilder', html });
  }

  async sendPasswordReset(to: string, data: { name: string; link: string }) {
    const html = renderTemplate('password-reset', data);
    return this.send({ to, subject: 'Reset your NovaBuilder password', html });
  }

  async sendTeamInvite(to: string, data: { inviterName: string; projectName: string; role: string; link: string }) {
    const html = renderTemplate('team-invite', data);
    return this.send({ to, subject: `You've been invited to ${data.projectName}`, html });
  }

  async sendWelcome(to: string, data: { name: string }) {
    const html = renderTemplate('welcome', data);
    return this.send({ to, subject: 'Welcome to NovaBuilder!', html });
  }

  async sendDeployNotification(to: string, data: { projectName: string; pageName: string; url: string }) {
    const html = renderTemplate('deploy-notification', data);
    return this.send({ to, subject: `${data.projectName} deployed successfully`, html });
  }
}
