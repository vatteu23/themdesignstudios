import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Link,
  Hr,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const ContactEmail: React.FC<ContactEmailProps> = ({
  name,
  email,
  phone,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body
        style={{
          fontFamily: "'IBM Plex Sans', Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            backgroundColor: "#ffffff",
            borderRadius: "4px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Section
            style={{
              backgroundColor: "#333333",
              padding: "20px 30px",
            }}
          >
            <Heading
              as="h1"
              style={{
                color: "white",
                fontSize: "28px",
                fontWeight: "500",
                margin: "0",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              THEM STUDIOS
            </Heading>
          </Section>

          <Section style={{ padding: "30px" }}>
            <Heading
              as="h2"
              style={{
                fontSize: "20px",
                fontWeight: "500",
                marginTop: "0",
                marginBottom: "20px",
              }}
            >
              New Contact Form Submission
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "10px",
              }}
            >
              <strong>Name:</strong> {name}
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "10px",
              }}
            >
              <strong>Email:</strong> {email}
            </Text>

            {phone && (
              <Text
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  marginBottom: "10px",
                }}
              >
                <strong>Phone:</strong> {phone}
              </Text>
            )}

            <Hr
              style={{
                borderColor: "#e5e5e5",
                margin: "20px 0",
              }}
            />

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "10px",
              }}
            >
              <strong>Message:</strong>
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            >
              {message}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#f5f5f5",
              padding: "20px 30px",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                color: "#666666",
                textAlign: "center",
                margin: "0",
              }}
            >
              This email was sent from the contact form on{" "}
              <Link
                href="https://themstudios.com"
                style={{ color: "#333333", textDecoration: "underline" }}
              >
                themstudios.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;
