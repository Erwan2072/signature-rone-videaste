const nodemailer = require("nodemailer");

async function sendEmail({ to, cc, pdfBuffer, prenom, nom }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: `"R-One Vidéaste" <${process.env.MAIL_USER}>`,
    to,
    cc: process.env.MAIL_TO, // ton adresse perso en copie
    subject: "Autorisation de droit à l'image – R-One Vidéaste",
    text: `Bonjour ${prenom} ${nom},

Veuillez trouver ci-joint le document PDF concernant l'autorisation de droit à l'image.

Cordialement,
R-One Vidéaste`,
    attachments: [
      {
        filename: `autorisation_${prenom}_${nom}.pdf`,
        content: pdfBuffer
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
