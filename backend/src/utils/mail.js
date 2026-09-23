import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Homely Hub",
      link: process.env.ORIGIN_ACCESS_URL || "http://localhost:5173",
    },
  });

  const emailBody = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: Number(process.env.MAILTRAP_SMTP_PORT) || 2525,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.MAIL_FROM || "hello@homelyhub.in",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailBody,
  };

  const info = await transporter.sendMail(mail);
  console.log("Email sent successfully:", info.messageId);
  return info;
};

const forgotPasswordMailGenContent = (username, passwordResetUrl) => ({
  body: {
    name: username,
    intro:
      "Welcome to Homely Hub App! We are sending you the link to reset your password.",
    action: {
      instructions: "To reset your password please click here:",
      button: {
        color: "#22AAFF",
        text: "Reset your password",
        link: passwordResetUrl,
      },
    },
    outro:
      "Need help, or have questions? Just reply to the email, we would love to help you.",
  },
});

export { sendMail, forgotPasswordMailGenContent };
