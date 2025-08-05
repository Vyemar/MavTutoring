import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: process.env.AWS_REGION });

export const sendSMS = async ({ to, body }) => {
  if (!to) return;

  const params = {
    PhoneNumber: to,
    Message:     body,
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType:    "String",
        StringValue: "Transactional"
      }
      // no OriginationNumber here!
    }
  };

  try {
    const { MessageId } = await sns.send(new PublishCommand(params));
    console.log("SMS sent, MessageId:", MessageId);
  } catch (err) {
    console.error("SMS failed:", err.name, err.message);
  }
};