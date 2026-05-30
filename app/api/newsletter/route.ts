import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "ClickAds <hello@useclickads.com>",
        to: "contact@useclickads.com",
        subject: "New Newsletter Subscriber",
        html: `<p>New subscriber: <strong>${email}</strong></p>`,
      }),
    });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        from: "ClickAds <hello@useclickads.com>",
        to: email,
        subject: "Welcome to ClickAds!",
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#0d0d0d;color:#fff"><h1 style="color:#7c3aed">Welcome to ClickAds!</h1><p>Thanks for subscribing. We'll keep you updated with our latest AI marketing insights and growth strategies.</p><p>In the meantime, <a href="https://www.useclickads.com/contact" style="color:#7c3aed">book a free consultation</a> with our team.</p><hr style="border-color:#222;margin:32px 0"/><p style="color:#666;font-size:12px">ClickAds · D-12, Akshardham, New Delhi, India · <a href="https://www.useclickads.com" style="color:#666">useclickads.com</a></p></div>`,
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
