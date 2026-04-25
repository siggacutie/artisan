import { NextRequest, NextResponse } from 'next/server'
import { Resend } from "resend";
import { sendDiscord } from "@/lib/discord";
import { validateOrigin } from "@/lib/validateOrigin";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeInput, sanitizeHtml } from "@/lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ip = getClientIp(req)
  const rl = rateLimit(`contact_${ip}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'too_many_submissions' }, { status: 429 })
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, orderId } = body;

    if (!name || !name.trim() || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: "Please select a subject." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    if (!sanitizeInput(name) || !sanitizeInput(message)) {
      return NextResponse.json({ error: "Invalid characters in input" }, { status: 400 });
    }

    const cleanName = sanitizeHtml(name)
    const cleanMessage = sanitizeHtml(message)
    const cleanOrderId = orderId ? sanitizeHtml(orderId) : "";

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@artisanstore.xyz",
      to: process.env.CONTACT_RECIPIENT || "support@artisanstore.xyz",
      subject: `[ArtisanStore Contact] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${cleanOrderId ? `<p><strong>Order ID:</strong> ${cleanOrderId}</p>` : ""}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>Sent from ArtisanStore.xyz contact form</p>
      `,
    });

    await sendDiscord('general', {
      title: 'New Contact Support Request',
      color: 0x00c3ff,
      fields: [
        { name: 'Name', value: cleanName, inline: true },
        { name: 'Email', value: email, inline: true },
        { name: 'Subject', value: subject, inline: true },
        { name: 'Order ID', value: cleanOrderId || 'N/A', inline: true },
        { name: 'Message', value: cleanMessage.slice(0, 1024), inline: false },
      ],
    }, 'ArtisanStore Support')

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@artisanstore.xyz",
      to: email,
      subject: "We received your message — ArtisanStore.xyz",
      html: `
        <h2>Thanks for contacting us, ${cleanName}!</h2>
        <p>We received your message and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>ArtisanStore.xyz Support</p>
        <p>support@artisanstore.xyz | +91 9387606432</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("Contact form error:", err);
    await sendDiscord('error', {
      title: 'Contact Form Error',
      color: 0xef4444,
      fields: [
        { name: 'Error', value: err.message ?? 'Unknown error', inline: false },
      ],
    }, 'ArtisanStore System')
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
