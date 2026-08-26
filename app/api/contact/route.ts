import { CONTACT_EMAIL } from "@/content/site-links";

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

  try {
    const origin =
      request.headers.get("origin") ??
      request.headers.get("referer") ??
      "https://cgc-ten.vercel.app";

    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: origin,
          Referer: origin.endsWith("/") ? origin : `${origin}/`,
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          message,
          _replyto: email,
          _subject: `New contact form message from ${name}`,
          _template: "table",
          _captcha: "false",
        }),
      }
    );

    const data = (await response.json().catch(() => null)) as
      | { success?: string; message?: string }
      | null;

    if (!response.ok) {
      return Response.json({ error: "Failed to send message." }, { status: 502 });
    }

    if (data && data.success === "false") {
      return Response.json(
        { error: data.message || "Failed to send message." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}
