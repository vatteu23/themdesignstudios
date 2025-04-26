import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ref, push, set } from "firebase/database";
import { db } from "@/firebase";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// The verified email domain
const VERIFIED_EMAIL = "maneesh@themdesignstudios.com";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON with error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Store data in Firebase
      const emailsRef = ref(db, "emails");
      const newEmailRef = push(emailsRef);
      await set(newEmailRef, {
        name,
        email,
        phone: phone || "",
        message,
        timestamp: Date.now(),
        read: false,
      });
    } catch (firebaseError) {
      console.error("Firebase error:", firebaseError);
      // Continue with email sending even if Firebase fails
    }

    try {
      // First send the admin notification
      const { data: adminEmailData, error: adminEmailError } =
        await resend.emails.send({
          from: `Them design studios <${VERIFIED_EMAIL}>`,
          to: "u1.bythem@gmail.com", // Admin email
          // Only include cc if email is provided and not the same as to address
          cc: ["u1.bythem@gmail.com"], // Add vuday23@gmail.com as CC
          replyTo: email, // Make reply-to the customer's email
          subject: `New Contact Form Submission from ${name}`,
          html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h1 style="color: #333;">New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Message:</strong></p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                <strong>Them design studios</strong><br>
                Tel: +917702277247<br>
                Email: maneesh@themdesignstudios.com<br>
                Address: 11-13-981, Road No. 2, Green Hills Colony, L. B. Nagar, Hyderabad, Telangana 500035, India
              </p>
              <p style="font-size: 12px; color: #666;">
                This is an automated email sent from your contact form.
              </p>
            </body>
          </html>
        `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}

Message:
${message}

---
Them design studios
Tel: +917702277247
Email: maneesh@themdesignstudios.com
Address: 11-13-981, Road No. 2, Green Hills Colony, L. B. Nagar, Hyderabad, Telangana 500035, India
        `,
        });

      if (adminEmailError) {
        console.error("Error sending admin email:", adminEmailError);
        // Log additional details about the error
        console.error(
          "Admin email error details:",
          JSON.stringify(adminEmailError)
        );
      } else {
        console.log("Admin email sent successfully:", adminEmailData);
      }

      // Wait a moment before sending the user confirmation
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (adminEmailError) {
      console.error("Failed to send admin email:", adminEmailError);
    }

    // Send confirmation email to user (in a separate try/catch)
    try {
      const { data: userEmailData, error: userEmailError } =
        await resend.emails.send({
          from: `Them design studios <${VERIFIED_EMAIL}>`,
          to: email,
          bcc: ["u1.bythem@gmail.com"], // BCC the admin as a backup
          subject: "Thank you for contacting Them design studios",
          html: `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h1 style="color: #333;">Thank you for your message, ${name}</h1>
              <p>We have received your inquiry and appreciate your interest in Them design studios. 
                Our team will review your message and get back to you as soon as possible.</p>
              <p>Whether your project is big or small, professional design advice will ensure 
                you'll love your space for years to come.</p>
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
        });

      if (userEmailError) {
        console.error("Error sending confirmation email:", userEmailError);
      } else {
        console.log("Confirmation email sent successfully:", userEmailData);
      }

      return NextResponse.json(
        {
          message: "Form submitted successfully",
          adminEmail: "Sent",
          userEmail: "Sent",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Resend API error for user email:", emailError);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing form submission:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
