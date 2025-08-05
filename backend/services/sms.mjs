import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export async function sendSMS({ to, body }) {
  const client = new SNSClient({ region: "us-east-1" });

  const command = new PublishCommand({
    Message: body,
    PhoneNumber: to,
  });

  try {
    await client.send(command);
    console.log("SMS sent to", to);
  } catch (err) {
    console.error("Failed to send SMS:", err);
  }
}
