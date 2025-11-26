import twilio from "twilio";
import { envVars } from "./env";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = envVars.SMS.TWILIO_ACCOUNT_SID;
const authToken = envVars.SMS.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function sendMessage() {
  const message = await client.messages.create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+15017122661",
    to: "+15558675310",
  });

  console.log(message.body);
}

export default sendMessage