import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// The verified email domain
const VERIFIED_EMAIL = "maneesh@themdesignstudios.com";

export async function POST(req: NextRequest) {
  try {
    console.log("Starting test email send");

    // Basic HTML email without React components for testing
    const { data, error } = await resend.emails.send({
      from: `Them design studios <${VERIFIED_EMAIL}>`,
      to: "u1.bythem@gmail.com",
      subject: "Test Email from Contact Form",
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #333;">Test Email</h1>
            <p>This is a test email from the Them design studios website.</p>
            <p>Time: ${new Date().toISOString()}</p>
            <p>This email is being sent to test the email delivery functionality.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">
              <strong>Them design studios</strong><br>
              Tel: +917702277247<br>
              Email: maneesh@themdesignstudios.com<br>
              Address: 11-13-981, Road No. 2, Green Hills Colony, L. B. Nagar, Hyderabad, Telangana 500035, India
            </p>
          </body>
        </html>
      `,
      text: `
Test Email from Them design studios

This is a test email from the Them design studios website.
Time: ${new Date().toISOString()}

This email is being sent to test the email delivery functionality.

---
Them design studios
Tel: +917702277247
Email: maneesh@themdesignstudios.com
Address: 11-13-981, Road No. 2, Green Hills Colony, L. B. Nagar, Hyderabad, Telangana 500035, India
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      console.error("Error details:", JSON.stringify(error));
      return NextResponse.json({ error }, { status: 400 });
    }

    console.log("Test email sent successfully:", data);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
