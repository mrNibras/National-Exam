const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to, // Must be a verified phone number in Twilio trial accounts
    });
    console.log('SMS sent successfully. SID:', message.sid);
    return message;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
};