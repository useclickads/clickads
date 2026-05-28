import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, service, budget, message } = await req.json();

    if (!name || !email || !message || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ClickAds Contact" <${process.env.SMTP_USER}>`,
      to: "useclickads@gmail.com",
      replyTo: email,
      subject: `New enquiry from ${name} — ${service}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
          <h2 style="color:#fff;margin:0 0 24px;font-size:20px;">New Project Enquiry</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;width:140px;">NAME</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;">EMAIL</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;"><a href="mailto:${email}" style="color:#fff;">${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;">PHONE</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">${phone || "Not provided"}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;">SERVICE</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">${service}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);font-size:12px;">BUDGET</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff;font-size:14px;">${budget || "Not specified"}</td></tr>
          </table>

          <div style="margin-top:24px;">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 10px;text-transform:uppercase;letter-spacing:1.5px;">Message</p>
            <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;background:rgba(255,255,255,0.05);padding:16px;border-radius:8px;">${message}</p>
          </div>

          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:32px 0 0;">Sent from useclickads.com contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}