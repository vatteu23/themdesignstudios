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

interface ConfirmationEmailProps {
  name: string;
}

const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({ name }) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting Them design studios</Preview>
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
                fontSize: "24px",
                fontWeight: "500",
                marginTop: "0",
                marginBottom: "20px",
              }}
            >
              Thank you for your message, {name}
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              We have received your inquiry and appreciate your interest in THEM
              STUDIOS. Our team will review your message and get back to you as
              soon as possible.
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              Whether your project is big or small, professional design advice
              will ensure you'll love your space for years to come.
            </Text>

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
              <strong>THEM STUDIOS</strong>
            </Text>
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "10px",
              }}
            >
              Tel: +917702277247
            </Text>
            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              Email: maneesh@bythem.studio
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
              Visit our website at{" "}
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

export default ConfirmationEmail;
