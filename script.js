// script.js
(function () {
  emailjs.init("GXk7CkwIPSce0_tCa"); // Ta public key EmailJS
})();

document.getElementById("signature-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const prenom = document.getElementById("prenom").value;
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const adresse = document.getElementById("adresse").value;
  const telephone = document.getElementById("telephone").value;
  const faitA = document.getElementById("faitA").value;
  const date = document.getElementById("date").value;
  const majeur = document.getElementById("majeur").checked;

  if (!majeur) {
    alert("Vous devez certifier etre majeur(e). Merci.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const texte = `
AUTORISATION DE DROIT A L'IMAGE\n\n
Conformement aux articles du Code civil et au Reglement General sur la Protection des Donnees (RGPD)

1. Identite des parties
Nom et prenom de la personne concernee : ${prenom} ${nom}
Adresse : ${adresse}
Telephone : ${telephone}
Adresse e-mail : ${email}

Nom de l'entreprise : R-One Videaste
Representee par : Monsieur Erwan Lebreton
Adresse professionnelle : 5 rue Rene Dumont 35235 Thorigne-Fouillard
E-mail professionnel : rone.sonsvideos@gmail.com

2. Objet de l’autorisation
Par la presente, j’autorise R-One Videaste a me filmer, photographier et enregistrer ma voix et/ou mon image dans le cadre des prestations suivantes :
- Captation d’evenements publics ou prives (mariages, reportages, interviews, etc.)
- Production de contenus a des fins de communication (reseaux sociaux, site web, supports publicitaires, etc.)
- Montage et diffusion audiovisuelle

3. Etendue de l’autorisation
J'autorise la diffusion, la reproduction, la representation et l'exploitation de mon image et/ou ma voix, en integralite ou partiellement, sur les supports suivants :
- Reseaux sociaux : Facebook, Instagram, TikTok, YouTube, LinkedIn, etc.
- Site internet de R-One Videaste
- Supports de communication (print et numerique)

4. Duree de l’autorisation
Cette autorisation est valable pour une duree de 5 ans a compter de la date de signature du present document.

5. Droit de retrait
A l’issue de cette periode de 5 ans, je pourrai demander le retrait des contenus me representant, par simple demande ecrite a l’adresse e-mail de R-One Videaste.
Je reconnais qu’a l’expiration de cette duree, le retrait sera effectue sans delai injustifie mais sans que cela ne puisse donner lieu a reclamation, indemnisation ou poursuite judiciaire a l’encontre de R-One Videaste, conformement a l’article 9 du Code civil et aux principes de bonne foi contractuelle.

6. Protection des donnees (RGPD)
Conformement aux articles 6, 7, 12 a 15 et 17 du Reglement (UE) 2016/679 dit RGPD, je suis informe(e) que :
- Mes donnees (image, voix, nom, etc.) sont traitee de maniere legale, loyale et transparente.
- Je peux a tout moment exercer mes droits d’acces, de rectification, d’opposition, ou de suppression de mes donnees personnelles, en adressant une demande a R-One Videaste.
- Aucune donnee ne sera transmise a un tiers sans mon consentement.

7. Absence de contrepartie
Cette autorisation est accordee a titre gracieux, sans contrepartie financiere, sauf mention contraire stipulee contractuellement.

8. Articles de loi de reference
- Article 9 du Code civil : "Chacun a droit au respect de sa vie privee."
- Article 226-1 du Code penal : interdit l’enregistrement de l’image d’une personne sans son consentement.
- Articles 6, 7, 12 a 15, 17 du RGPD (Reglement UE 2016/679) : cadre juridique relatif au traitement des donnees a caractere personnel.
- Jurisprudence constante : toute diffusion d’image sans autorisation est illegale, meme dans un cadre artistique ou journalistique.

Fait a : ${faitA}
Le : ${date}

Signature de la personne concernee : (precedee de la mention "Lu et approuve")
Lu et approuve – ${prenom} ${nom}

Signature de R-One Videaste : (precedee de la mention "Lu et approuve")
Lu et approuve – Erwan Lebreton
`;

  const lines = doc.splitTextToSize(texte, 180);
  doc.text(lines, 15, 15);

  const pdfData = doc.output("datauristring");
  const base64PDF = pdfData.split(",")[1];

  const templateParams = {
    prenom,
    nom,
    email,
    adresse,
    telephone,
    faitA,
    date,
    attachment: base64PDF,
    filename: `autorisation_droit_image_${prenom}_${nom}.pdf`
  };

  emailjs.send("service_sq50l0o", "template_puybdqf", templateParams)
    .then(function () {
      document.getElementById("status-message").textContent =
        "✅ Document envoye avec succes a " + email;
    }, function (error) {
      document.getElementById("status-message").textContent =
        "❌ Echec de l'envoi : " + error.text;
    });
});
