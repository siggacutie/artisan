import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, orderId } = body;

    if (!name || !name.trim() || name.trim().length < 2) {
      return Response.json({ error: "Please enter your name." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return Response.json({ error: "Please select a subject." }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return Response.json({ error: "Message must be at least 10 characters." }, { status: 400 });
    }

    const cleanName = name.replace(/<[^>]*>/g, "").trim();
    const cleanMessage = message.replace(/<[^>]*>/g, "").trim();
    const cleanOrderId = orderId ? orderId.replace(/<[^>]*>/g, "").trim() : "";

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
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
