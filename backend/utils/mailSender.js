


const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const mailSender = async (to, subject, html) => {
  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: process.env.FROM_EMAIL,
      name: 'Quizora', 
    };

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log('✅ Email sent via Brevo:', response.messageId || response);
    return response;
  } catch (error) {
    console.error('❌ Error sending email via Brevo:', error.response?.body || error);
    throw error;
  }
};

module.exports = mailSender;
