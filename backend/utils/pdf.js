const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

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

  function clean(text) {
    return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const logoPath = path.resolve(__dirname, "../../docs/logo.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.25);
  page.drawImage(logoImage, {
    x: 40,
    y: 780,
    width: logoDims.width,
    height: logoDims.height,
  });

  page.drawText("R-One Vidéaste", {
    x: 100,
    y: 790,
    font: bold,
    size: 14,
    color: rgb(0.1, 0.1, 0.1)
  });

  let y = 750;
  const margin = 40;
  const lineHeight = 16;
  const maxWidth = 515;

  function writeParagraph(text, style = "", indent = 0) {
    const usedFont = style === "bold" ? bold : style === "italic" ? italic : font;
    const words = clean(text).split(" ");
    let line = "";
    let textLines = [];

    for (const word of words) {
      const testLine = line + word + " ";
      const width = usedFont.widthOfTextAtSize(testLine, 11);
      if (width < (maxWidth - indent)) {
        line = testLine;
      } else {
        textLines.push(line);
        line = word + " ";
      }
    }
    if (line) textLines.push(line);

    for (const l of textLines) {
      page.drawText(l.trim(), {
        x: margin + indent,
        y,
        font: usedFont,
        size: 11,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
    }
  }

  function title(text) {
    page.drawText(clean(text), {
      x: margin,
      y,
      font: bold,
      size: 13,
      color: rgb(15 / 255, 82 / 255, 186 / 255)
    });
    y -= 18;
  }

  page.drawText(clean("AUTORISATION DE DROIT A L'IMAGE"), {
    x: margin,
    y,
    font: bold,
    size: 16,
    color: rgb(15 / 255, 82 / 255, 186 / 255)
  });
  y -= 25;
  writeParagraph("Conformement aux articles du Code civil et au Reglement General sur la Protection des Donnees (RGPD)");

  title("1. Identite des parties");
  writeParagraph(`Nom et prenom : ${prenom} ${nom}`);
  writeParagraph(`Adresse : ${adresse}`);
  writeParagraph(`Telephone : ${telephone}`);
  writeParagraph(`Adresse e-mail : ${email}`);
  writeParagraph("Nom de l'entreprise : R-One Videaste");
  writeParagraph("Siret : 94288194700017");
  writeParagraph("Representee par : M. Erwan Lebreton");
  writeParagraph("Adresse professionnelle : 5 rue Rene Dumont 35235 Thorigne-Fouillard");
  writeParagraph("E-mail professionnel : rone.sonsvideos@gmail.com");

  title("2. Objet de l’autorisation");
  writeParagraph("Par la presente, j’autorise R-One Videaste à me filmer, photographier et enregistrer ma voix et/ou mon image dans le cadre des prestations suivantes :");
  writeParagraph("- Captation d’evenements publics ou prives (mariages, reportages, interviews, etc.)", "", 10);
  writeParagraph("- Production de contenus a des fins de communication (reseaux sociaux, site web, supports publicitaires, etc.)", "", 10);
  writeParagraph("- Montage et diffusion audiovisuelle", "", 10);

  title("3. Etendue de l’autorisation");
  writeParagraph("J'autorise la diffusion, la reproduction, la representation et l'exploitation de mon image et/ou ma voix, en integralite ou partiellement, sur les supports suivants :");
  writeParagraph("- Reseaux sociaux : Facebook, Instagram, TikTok, YouTube, LinkedIn, etc.", "", 10);
  writeParagraph("- Site internet de R-One Videaste", "", 10);
  writeParagraph("- Supports de communication (print et numerique)", "", 10);

  title("4. Duree de l’autorisation");
  writeParagraph("Cette autorisation est valable pour une duree de 5 ans a compter de la date de signature du present document.");

  title("5. Droit de retrait");
  writeParagraph("A l’issue de cette periode de 5 ans, je pourrai demander le retrait des contenus me representant, par simple demande ecrite a l’adresse e-mail de R-One Videaste.");
  writeParagraph("Je reconnais qu’a l’expiration de cette duree, le retrait sera effectue sans delai injustifie mais sans que cela ne puisse donner lieu a reclamation, indemnisation ou poursuite judiciaire a l’encontre de R-One Videaste, conformement a l’article 9 du Code civil et aux principes de bonne foi contractuelle.");

  title("6. Protection des donnees (RGPD)");
  writeParagraph("Conformement aux articles 6, 7, 12 a 15 et 17 du Reglement (UE) 2016/679 dit RGPD, je suis informe(e) que :");
  writeParagraph("- Mes donnees (image, voix, nom, etc.) sont traitees de maniere legale, loyale et transparente.", "", 10);
  writeParagraph("- Je peux a tout moment exercer mes droits d’acces, de rectification, d’opposition, ou de suppression de mes donnees personnelles, en adressant une demande a R-One Videaste.", "", 10);
  writeParagraph("- Aucune donnee ne sera transmise a un tiers sans mon consentement.", "", 10);

  title("7. Absence de contrepartie");
  writeParagraph("Cette autorisation est accordee a titre gracieux, sans contrepartie financiere, sauf mention contraire stipulee contractuellement.");

  title("8. Articles de loi de reference");
  writeParagraph("- Article 9 du Code civil : 'Chacun a droit au respect de sa vie privee.'", "", 10);
  writeParagraph("- Article 226-1 du Code penal : interdit l’enregistrement de l’image d’une personne sans son consentement.", "", 10);
  writeParagraph("- Articles 6, 7, 12 a 15, 17 du RGPD (Reglement UE 2016/679)", "", 10);
  writeParagraph("- Jurisprudence constante : toute diffusion d’image sans autorisation est illegale, meme dans un cadre artistique ou journalistique.", "", 10);

  y -= 10;
  writeParagraph(`Fait a : ${faitA}`, "bold");
  writeParagraph(`Le : ${date}`, "bold");

  y -= 10;
  writeParagraph("Signature de la personne concernee : (precedee de la mention 'Lu et approuve')", "italic");
  writeParagraph(`Lu et approuve - ${prenom} ${nom}`, "italic");
  writeParagraph("Signature de R-One Videaste :", "italic");
  writeParagraph("R-One Videaste", "italic");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = generatePDF;
