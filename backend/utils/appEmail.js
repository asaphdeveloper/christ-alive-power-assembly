import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'a7b4fcbe8bf5d9',
      pass: 'd192b86faaa735',
    },
  });

  await transporter.sendMail(mailOptions);
};
