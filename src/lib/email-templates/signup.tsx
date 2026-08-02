import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface SignupEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for signing up for{" "}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SignupEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: 'Georgia, "Times New Roman", serif',
};
const container = {
  padding: "32px 28px",
  maxWidth: "560px",
  borderTop: "4px solid #E8842A",
};
const h1 = {
  fontSize: "22px",
  fontWeight: "bold" as const,
  color: "#7A2A1C",
  margin: "0 0 20px",
};
const text = {
  fontSize: "14px",
  color: "#4A3B33",
  lineHeight: "1.5",
  margin: "0 0 25px",
};
const link = { color: "inherit", textDecoration: "underline" };
const button = {
  backgroundColor: "#E8842A",
  color: "#ffffff",
  fontSize: "14px",
  borderRadius: "10px",
  fontWeight: "bold" as const,
  display: "inline-block",
  padding: "12px 20px",
  textDecoration: "none",
};
const footer = {
  fontSize: "12px",
  color: "#8A7A70",
  margin: "30px 0 0",
  borderTop: "1px solid #F0E6DE",
  paddingTop: "16px",
};
