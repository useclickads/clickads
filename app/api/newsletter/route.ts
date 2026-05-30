import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await resend.emails.send({
      from: "ClickAds <onboarding@resend.dev>",
      to: "contact@useclickads.com",
      subject: "New Newsletter Signup",
      html: `<p>New subscriber: <strong>${email}</strong></p>`,
    });

    await resend.emails.send({
      from: "ClickAds <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to ClickAds! 🚀",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
          <h1 style="color:#7c3aed">Welcome to ClickAds!</h1>
          <p>Thanks for subscribing. We'll keep you updated with AI marketing insights and growth tips.</p>
          <p>In the meantime, <a href="https://www.useclickads.com/contact" style="color:#7c3aed">book a free consultation</a> with our team.</p>
          <p style="color:#999;font-size:12px">ClickAds · D-12, Akshardham, New Delhi, India</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
