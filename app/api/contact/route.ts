import { CONTACT_EMAIL } from "@/content/site-links";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const organization = String(body.organization ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json({ error: "Name, email, and message are required." }, {
      status: 400,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, {
      status: 400,
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Email delivery is not configured yet." },
      { status: 503 }
    );
  }

  const from =
    process.env.CONTACT_FROM_EMAIL ??
    "Carrie Grace Website <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    organization ? `Organization: ${organization}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text,
    });

    if (error) {
      return Response.json({ error: "Failed to send message." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}
