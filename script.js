(function () {
  emailjs.init("GXk7CkwIPSce0_tCa"); // <- Ta clé publique EmailJS
})();

document.getElementById("signature-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const majeur = document.getElementById("majeur").checked;

  if (!majeur) {
    alert("Vous devez certifier être majeur(e).");
    return;
  }

  const fullName = `${prenom} ${nom}`;
  const date = new Date().toLocaleDateString("fr-FR");

  const existingPdfBytes = await fetch("modele.pdf").then(res => res.arrayBuffer());
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  firstPage.drawText(`Signataire : ${fullName}`, {
    x: 50,
    y: 100,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`Date : ${date}`, {
    x: 50,
    y: 80,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  firstPage.drawText(`Validation : J'accepte les termes du document via ce clic.`, {
    x: 50,
    y: 60,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  // Convert to base64
  const base64pdf = btoa(
    new Uint8Array(pdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );

  const templateParams = {
    prenom: prenom,
    nom: nom,
    email: email,
    attachment: base64pdf,
    filename: `Droit_image_${prenom}_${nom}.pdf`,
  };

  emailjs.send("service_sq50l0o", "template_puybdqf", templateParams)
    .then(function () {
      document.getElementById("status-message").textContent = "✅ Document envoyé avec succès à " + email;
    }, function (error) {
      document.getElementById("status-message").textContent = "❌ Échec de l'envoi : " + error.text;
    });
});
