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

  function clean(text) {
    return text.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = 800;
  const margin = 40;

  const write = (text, style = "", indent = 0) => {
    const usedFont = style === "bold" ? bold : style === "italic" ? italic : font;
    page.drawText(clean(text), {
      x: margin + indent,
      y,
      font: usedFont,
      size: 11,
      color: rgb(0, 0, 0)
    });
    y -= 16;
  };

  const title = (text) => {
    page.drawText(clean(text), {
      x: margin,
      y,
      font: bold,
      size: 13,
      color: rgb(15 / 255, 82 / 255, 186 / 255)
    });
    y -= 18;
  };

  page.drawText(clean("AUTORISATION DE DROIT A L'IMAGE"), {
    x: margin,
    y,
    font: bold,
    size: 16,
    color: rgb(15 / 255, 82 / 255, 186 / 255)
  });
  y -= 25;
  write("Conformement aux articles du Code civil et au Reglement General sur la Protection des Donnees (RGPD)");

  title("1. Identite des parties");
  write(`Nom et prenom : ${prenom} ${nom}`);
  write(`Adresse : ${adresse}`);
  write(`Telephone : ${telephone}`);
  write(`Adresse e-mail : ${email}`);
  write("Nom de l'entreprise : R-One Videaste");
  write("Siret : 94288194700017");
  write("Representee par : M. Erwan Lebreton");
  write("Adresse professionnelle : 5 rue Rene Dumont 35235 Thorigne-Fouillard");
  write("E-mail professionnel : rone.sonsvideos@gmail.com");

  title("2. Objet de l’autorisation");
  write("Par la presente, j’autorise R-One Videaste à me filmer, photographier et enregistrer ma voix et/ou mon image dans le cadre des prestations suivantes :");
  write("- Captation d’evenements publics ou prives (mariages, reportages, interviews, etc.)", "", 10);
  write("- Production de contenus a des fins de communication (reseaux sociaux, site web, supports publicitaires, etc.)", "", 10);
  write("- Montage et diffusion audiovisuelle", "", 10);

  title("3. Etendue de l’autorisation");
  write("J'autorise la diffusion, la reproduction, la representation et l'exploitation de mon image et/ou ma voix, en integralite ou partiellement, sur les supports suivants :");
  write("- Reseaux sociaux : Facebook, Instagram, TikTok, YouTube, LinkedIn, etc.", "", 10);
  write("- Site internet de R-One Videaste", "", 10);
  write("- Supports de communication (print et numerique)", "", 10);

  title("4. Duree de l’autorisation");
  write("Cette autorisation est valable pour une duree de 5 ans a compter de la date de signature du present document.");

  title("5. Droit de retrait");
  write("A l’issue de cette periode de 5 ans, je pourrai demander le retrait des contenus me representant, par simple demande ecrite a l’adresse e-mail de R-One Videaste.");
  write("Je reconnais qu’a l’expiration de cette duree, le retrait sera effectue sans delai injustifie mais sans que cela ne puisse donner lieu a reclamation, indemnisation ou poursuite judiciaire a l’encontre de R-One Videaste, conformement a l’article 9 du Code civil et aux principes de bonne foi contractuelle.");

  title("6. Protection des donnees (RGPD)");
  write("Conformement aux articles 6, 7, 12 a 15 et 17 du Reglement (UE) 2016/679 dit RGPD, je suis informe(e) que :");
  write("- Mes donnees (image, voix, nom, etc.) sont traitees de maniere legale, loyale et transparente.", "", 10);
  write("- Je peux a tout moment exercer mes droits d’acces, de rectification, d’opposition, ou de suppression de mes donnees personnelles, en adressant une demande a R-One Videaste.", "", 10);
  write("- Aucune donnee ne sera transmise a un tiers sans mon consentement.", "", 10);

  title("7. Absence de contrepartie");
  write("Cette autorisation est accordee a titre gracieux, sans contrepartie financiere, sauf mention contraire stipulee contractuellement.");

  title("8. Articles de loi de reference");
  write("- Article 9 du Code civil : 'Chacun a droit au respect de sa vie privee.'", "", 10);
  write("- Article 226-1 du Code penal : interdit l’enregistrement de l’image d’une personne sans son consentement.", "", 10);
  write("- Articles 6, 7, 12 a 15, 17 du RGPD (Reglement UE 2016/679)", "", 10);
  write("- Jurisprudence constante : toute diffusion d’image sans autorisation est illegale, meme dans un cadre artistique ou journalistique.", "", 10);

  y -= 10;
  write(`Fait a : ${faitA}`, "bold");
  write(`Le : ${date}`, "bold");

  y -= 10;
  write("Signature de la personne concernee : (precedee de la mention 'Lu et approuve')", "italic");
  write(`Lu et approuve - ${prenom} ${nom}`, "italic");

  y -= 5;
  write("Signature de R-One Videaste :", "italic");
  write("Lu et approuve - Erwan Lebreton", "italic");

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = generatePDF;
