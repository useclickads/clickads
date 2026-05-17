export type TemplateData = Record<string, string>;

const templates: Record<string, (data: any) => string> = {
  'magic-link': magicLinkTemplate,
  'password-reset': passwordResetTemplate,
  'team-invite': teamInviteTemplate,
  'welcome': welcomeTemplate,
  'deploy-notification': deployNotificationTemplate,
};

export function renderTemplate(name: string, data: TemplateData): string {
  const fn = templates[name];
  if (!fn) throw new Error(`Email template "${name}" not found`);
  return fn(data);
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NovaBuilder</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
<tr><td style="padding:32px 32px 0;">
<p style="margin:0;font-size:18px;font-weight:800;color:#0f172a;">NovaBuilder</p>
</td></tr>
<tr><td style="padding:24px 32px 32px;">
${content}
</td></tr>
<tr><td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">© 2026 NovaBuilder. All rights reserved.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function magicLinkTemplate(data: { name: string; link: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Sign in to NovaBuilder</h1>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
Hi ${data.name}, click the button below to sign in. This link expires in 15 minutes.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Sign In</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
If you didn't request this, you can safely ignore this email.
</p>
<p style="margin:12px 0 0;font-size:12px;color:#cbd5e1;word-break:break-all;">${data.link}</p>
`);
}

function passwordResetTemplate(data: { name: string; link: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Reset your password</h1>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
Hi ${data.name}, we received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Reset Password</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
If you didn't request a password reset, please ignore this email or contact support if you're concerned.
</p>
`);
}

function teamInviteTemplate(data: { inviterName: string; projectName: string; role: string; link: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">You're invited!</h1>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
<strong>${data.inviterName}</strong> has invited you to collaborate on <strong>${data.projectName}</strong> as a <strong>${data.role}</strong>.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Accept Invitation</a>
</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#94a3b8;line-height:1.5;">
If you don't have a NovaBuilder account, one will be created for you when you accept.
</p>
`);
}

function welcomeTemplate(data: { name: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Welcome to NovaBuilder!</h1>
<p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
Hi ${data.name}, your account is ready. Here's what you can do:
</p>
<ul style="margin:0 0 24px;padding:0 0 0 20px;color:#475569;font-size:14px;line-height:2;">
<li>Create projects and design pages visually</li>
<li>Use AI to generate entire pages from prompts</li>
<li>Collaborate with your team in real-time</li>
<li>Publish with one click to custom domains</li>
</ul>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Go to Dashboard</a>
</td></tr>
</table>
`);
}

function deployNotificationTemplate(data: { projectName: string; pageName: string; url: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Deployment successful!</h1>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
Your project <strong>${data.projectName}</strong> has been deployed. The page "${data.pageName}" is now live.
</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#16a34a;">
<a href="${data.url}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">View Live Site</a>
</td></tr>
</table>
`);
}
