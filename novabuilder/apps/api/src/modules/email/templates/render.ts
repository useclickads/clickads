export type TemplateData = Record<string, unknown>;

const templates: Record<string, (data: any) => string> = {
  'magic-link': magicLinkTemplate,
  'password-reset': passwordResetTemplate,
  'team-invite': teamInviteTemplate,
  'welcome': welcomeTemplate,
  'deploy-notification': deployNotificationTemplate,
  'form-submission': formSubmissionTemplate,
  'backup-complete': backupCompleteTemplate,
  'weekly-digest': weeklyDigestTemplate,
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

function formSubmissionTemplate(data: { formName: string; projectName: string; fields: Array<{ label: string; value: string }>; link: string }): string {
  const fieldRows = (data.fields || []).map((f) =>
    `<tr><td style="padding:8px 12px;font-size:13px;color:#64748b;border-bottom:1px solid #f1f5f9;font-weight:600;width:120px;">${f.label}</td><td style="padding:8px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9;">${f.value}</td></tr>`
  ).join('');

  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">New form submission</h1>
<p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
A new response was submitted to <strong>${data.formName}</strong> in <strong>${data.projectName}</strong>.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
${fieldRows}
</table>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">View All Submissions</a>
</td></tr>
</table>
`);
}

function backupCompleteTemplate(data: { projectName: string; backupId: string; pageCount: number; size: string; link: string }): string {
  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Backup completed</h1>
<p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
A backup of <strong>${data.projectName}</strong> was created successfully.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
<tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Pages backed up:</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${data.pageCount}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Backup size:</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-weight:600;text-align:right;">${data.size}</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Backup ID:</td><td style="padding:8px 0;font-size:14px;color:#0f172a;font-family:monospace;text-align:right;">${data.backupId.slice(0, 12)}...</td></tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Manage Backups</a>
</td></tr>
</table>
`);
}

function weeklyDigestTemplate(data: { name: string; projects: Array<{ name: string; pageViews: number; newPages: number }>; totalViews: number; period: string; link: string }): string {
  const projectRows = (data.projects || []).map((p) =>
    `<tr>
<td style="padding:10px 12px;font-size:14px;color:#0f172a;border-bottom:1px solid #f1f5f9;font-weight:600;">${p.name}</td>
<td style="padding:10px 12px;font-size:14px;color:#475569;border-bottom:1px solid #f1f5f9;text-align:center;">${p.pageViews.toLocaleString()}</td>
<td style="padding:10px 12px;font-size:14px;color:#475569;border-bottom:1px solid #f1f5f9;text-align:center;">${p.newPages}</td>
</tr>`
  ).join('');

  return baseLayout(`
<h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Your weekly digest</h1>
<p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
Hi ${data.name}, here's a summary of your projects for ${data.period}.
</p>
<p style="margin:0 0 4px;font-size:13px;color:#94a3b8;text-transform:uppercase;font-weight:700;letter-spacing:0.05em;">Total page views</p>
<p style="margin:0 0 24px;font-size:32px;color:#0f172a;font-weight:800;">${data.totalViews.toLocaleString()}</p>
${data.projects.length > 0 ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:24px;">
<tr style="background:#f8fafc;">
<th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:left;font-weight:700;">Project</th>
<th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:center;font-weight:700;">Views</th>
<th style="padding:10px 12px;font-size:12px;color:#64748b;text-align:center;font-weight:700;">New Pages</th>
</tr>
${projectRows}
</table>` : ''}
<table role="presentation" cellpadding="0" cellspacing="0">
<tr><td style="border-radius:10px;background:#0f172a;">
<a href="${data.link}" target="_blank" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">View Dashboard</a>
</td></tr>
</table>
`);
}
