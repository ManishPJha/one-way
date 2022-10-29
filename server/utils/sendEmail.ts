import nodemailer from "nodemailer";

interface MailProps {
  email: string;
  subject: string;
  message: any;
}

const sendEmail = async (options: MailProps) => {
  var transport = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    // secure: true, //for hostinger smtp port
    auth: {
      user: process.env.SMTP_EMAIL!,
      pass: process.env.SMTP_PASSWORD!,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transport.sendMail(message);
};

export default sendEmail;
