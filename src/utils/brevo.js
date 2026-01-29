import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_USER,
        name: "CampusQuery"
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  } catch (error) {
    console.error("Brevo email error:", error.message);
    throw error;
  }
};
