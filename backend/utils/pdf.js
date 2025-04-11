const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

async function generatePDF(data) {
  try {
    const {
      prenom,
      nom,
      email,
      adresse,
      telephone,
      faitA,
      date
    } = data;

    function clean(text) {
      return String(text || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    }

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595, 842]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const margin = 40;
    let y = 800;
    const lineHeight = 16;
    const maxWidth = 515;

    function newPage() {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
    }

    const write = (label, value = "", options = {}) => {
      const indent = options.indent || 0;
      const labelFont = options.labelFont || bold;
      const valueFont = options.valueFont || italic;
      const labelText = clean(label);
      const valueText = clean(value);

      const fullLine = labelText + valueText;
      const words = fullLine.split(" ");
      let line = "";
      let textLines = [];

      for (const word of words) {
        const testLine = line + word + " ";
        const width = font.widthOfTextAtSize(testLine, 11);
        if (width < (maxWidth - indent)) {
          line = testLine;
        } else {
          textLines.push(line);
          line = word + " ";
        }
      }
      if (line) textLines.push(line);

      for (const l of textLines) {
        if (y < 50) newPage();
        const parts = l.split(valueText);
        const labelPart = parts[0] || "";
        const valuePart = parts[1] ? valueText : "";
        let xCursor = margin + indent;

        if (labelPart) {
          page.drawText(labelPart.trim(), {
            x: xCursor,
            y,
            font: labelFont,
            size: 11,
            color: rgb(0, 0, 0),
          });
          xCursor += labelFont.widthOfTextAtSize(labelPart, 11);
        }

        if (valuePart) {
          page.drawText(valuePart.trim(), {
            x: xCursor,
            y,
            font: valueFont,
            size: 11,
            color: rgb(0, 0, 0),
          });
        }
        y -= lineHeight;
      }
    };


    const titleText = clean("AUTORISATION DE DROIT A L'IMAGE");
    const titleSize = 16;
    const textWidth = bold.widthOfTextAtSize(titleText, titleSize);
    const centeredX = (595 - textWidth) / 2;

    page.drawText(titleText, {
      x: centeredX,
      y,
      font: bold,
      size: titleSize,
      color: rgb(15 / 255, 82 / 255, 186 / 255),
    });

    const logoPath = path.resolve(__dirname, "../docs/logo.png");
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.25);
      page.drawImage(logoImage, {
        x: 40,
        y: 780,
        width: logoDims.width,
        height: logoDims.height
      });

      page.drawText("R-One Vidéaste", {
        x: 100,
        y: 790,
        font: bold,
        size: 14,
        color: rgb(0.1, 0.1, 0.1)
      });
      y = 750;
    }

    page.drawText(clean("AUTORISATION DE DROIT A L'IMAGE"), {
      x: margin,
      y,
      font: bold,
      size: 16,
      color: rgb(15 / 255, 82 / 255, 186 / 255)
    });
    y -= 25;
    write("", "Conformement aux articles du Code civil et au Reglement General sur la Protection des Donnees (RGPD)");
    y -= 10;
    title("1. Identite des parties");
    write("Nom et prenom : ", `${prenom} ${nom}`);
    write("Adresse : ", adresse);
    write("Telephone : ", telephone);
    write("Adresse e-mail : ", email);
    write("Nom de l'entreprise : ", "R-One Videaste");
    write("Siret : ", "94288194700017");
    write("Representee par : ", "M. Erwan Lebreton");
    write("Adresse professionnelle : ", "5 rue Rene Dumont 35235 Thorigne-Fouillard");
    write("E-mail professionnel : ", "rone.sonsvideos@gmail.com");
    y -= 10;
    title("2. Objet de l’autorisation", false);
    write("", "Par la presente, j’autorise R-One Videaste à me filmer, photographier et enregistrer ma voix et/ou mon image dans le cadre des prestations suivantes :", { indent: 0, labelFont: font });
    write("", "- Captation d’evenements publics ou prives (mariages, reportages, interviews, etc.)", { indent: 10 });
    write("", "- Production de contenus a des fins de communication (reseaux sociaux, site web, supports publicitaires, etc.)", { indent: 10, labelFont: font });
    write("", "- Montage et diffusion audiovisuelle", { indent: 10 });
    y -= 10;
    title("3. Etendue de l’autorisation", false);
    write("", "J'autorise la diffusion, la reproduction, la representation et l'exploitation de mon image et/ou ma voix, en integralite ou partiellement, sur les supports suivants :", { indent: 0, labelFont: font });
    write("", "- Reseaux sociaux : Facebook, Instagram, TikTok, YouTube, LinkedIan, etc.", { indent: 10 });
    write("", "- Site internet de R-One Videaste", { indent: 10 });
    write("", "- Supports de communication (print et numerique)", { indent: 10 });
    y -= 10;
    title("4. Duree de l’autorisation", false);
    write("", "Cette autorisation est valable pour une duree de 5 ans a compter de la date de signature du present document.", { indent: 0, labelFont: font });
    y -= 10;
    title("5. Droit de retrait", false);
    write("", "A l’issue de cette periode de 5 ans, je pourrai demander le retrait des contenus me representant, par simple demande ecrite a l’adresse e-mail de R-One Videaste.", { indent: 0, labelFont: font });
    write("", "Je reconnais qu’a l’expiration de cette duree, le retrait sera effectue sans delai injustifie mais sans que cela ne puisse donner lieu a reclamation, indemnisation ou poursuite judiciaire a l’encontre de R-One Videaste, conformement a l’article 9 du Code civil et aux principes de bonne foi contractuelle.", { indent: 0, labelFont: font });
    y -= 10;
    title("6. Protection des donnees (RGPD)", false);
    write("", "Conformement aux articles 6, 7, 12 a 15 et 17 du Reglement (UE) 2016/679 dit RGPD, je suis informe(e) que :", { indent: 0, labelFont: font });
    write("", "- Mes donnees (image, voix, nom, etc.) sont traitees de maniere legale, loyale et transparente.", { indent: 10 });
    write("", "- Je peux a tout moment exercer mes droits d’acces, de rectification, d’opposition, ou de suppression de mes donnees personnelles, en adressant une demande a R-One Videaste.", { indent: 10, labelFont: font });
    write("", "- Aucune donnee ne sera transmise a un tiers sans mon consentement.", { indent: 10 });
    y -= 10;
    title("7. Absence de contrepartie", false);
    write("", "Cette autorisation est accordee a titre gracieux, sans contrepartie financiere, sauf mention contraire stipulee contractuellement.", { indent: 0, labelFont: font });
    y -= 10;
    title("8. Articles de loi de reference", false);
    write("", "- Article 9 du Code civil : 'Chacun a droit au respect de sa vie privee.'", { indent: 10 });
    write("", "- Article 226-1 du Code penal : interdit l’enregistrement de l’image d’une personne sans son consentement.", { indent: 10, labelFont: font });
    write("", "- Articles 6, 7, 12 a 15, 17 du RGPD (Reglement UE 2016/679)", { indent: 10 });
    write("", "- Jurisprudence constante : toute diffusion d’image sans autorisation est illegale, meme dans un cadre artistique ou journalistique.", { indent: 10, labelFont: font });

    y -= 10;
    write("Fait a : ", faitA, { indent: 0, valueFont: italic });
    write("Le : ", date, { indent: 0, valueFont: italic });

    y -= 20;
    write("Signature de la personne concernee :", " (precedee de la mention 'Lu et approuve')", { indent: 0 });
    write("", `Lu et approuve - ${prenom} ${nom}`, { indent: 10, valueFont: italic });
    y -= 20;
    write("Signature de R-One Videaste :", " ", { indent: 0 });
    write("", "R-One Videaste", { indent: 10, valueFont: italic });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error("Erreur dans generatePDF:", err);
    throw err;
  }
}

module.exports = generatePDF;
