const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const generatePDF = require("./utils/pdf");
const sendEmail = require("./utils/mailer");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/send-pdf", async (req, res) => {
  try {
    const data = req.body;

    const pdfBuffer = await generatePDF(data);

    await sendEmail({
      to: data.email,
      cc: process.env.ADMIN_EMAIL,
      pdfBuffer,
      prenom: data.prenom,
      nom: data.nom,
    });

    res.status(200).json({ message: "Vous recevrez une copie de l'accord" });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: "Une erreur est survenue." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
