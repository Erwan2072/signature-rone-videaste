const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

async function generatePDF(data) {
  const {
    prenom,
    nom,
    email,
    adresse,
    telephone,
    faitA,
    date
  } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const margin = 40;
  let y = 780;

  function writeLine(text) {
    page.drawText(text, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
    y -= 20;
  }

  writeLine("AUTORISATION DE DROIT À L'IMAGE");
  y -= 10;
  writeLine("Conformément aux articles du Code civil et au RGPD");
  y -= 20;
  writeLine("1. Identité des parties");
  writeLine(`Nom et prénom : ${prenom} ${nom}`);
  writeLine(`Adresse : ${adresse}`);
  writeLine(`Téléphone : ${telephone}`);
  writeLine(`Email : ${email}`);
  y -= 20;
  writeLine("2. Représentant de l'entreprise");
  writeLine("R-One Vidéaste – M. Erwan Lebreton");
  writeLine("5 rue René Dumont, 35235 Thorigné-Fouillard");
  writeLine("rone.sonsvideos@gmail.com");
  y -= 20;
  writeLine("3. Objet : autorisation de captation et diffusion audiovisuelle");
  y -= 20;
  writeLine("4. Durée : autorisation valable 5 ans à partir du " + date);
  y -= 20;
  writeLine("5. Droit de retrait : possible après les 5 ans sans poursuites");
  y -= 20;
  writeLine("6. Données personnelles : traitées selon le RGPD");
  y -= 20;
  writeLine("7. Fait à : " + faitA);
  writeLine("Le : " + date);
  y -= 20;
  writeLine("Lu et approuvé – " + prenom + " " + nom);
  y -= 20;
  writeLine("Signature R-One Vidéaste – Lu et approuvé – Erwan Lebreton");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = generatePDF;
