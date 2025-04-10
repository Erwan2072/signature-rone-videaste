(function () {
  emailjs.init("GXk7CkwIPSce0_tCa");
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
    alert("Vous devez certifier être majeur(e). Merci.");
    return;
  }

  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert("Erreur : la librairie jsPDF n'est pas chargée correctement.");
    return;
  }

  const doc = new jsPDF();

  const texte = `
AUTORISATION DE DROIT À L'IMAGE

Conformément aux articles du Code civil et au Règlement Général sur la Protection des Données (RGPD)

1. Identité des parties
Nom et prénom : ${prenom} ${nom}
Adresse : ${adresse}
Téléphone : ${telephone}
Email : ${email}

Nom de l'entreprise : R-One Vidéaste
Représentée par : Monsieur Erwan Lebreton
Adresse pro : 5 rue René Dumont 35235 Thorigné-Fouillard
Email pro : rone.sonsvideos@gmail.com

2. Objet de l’autorisation
Par la présente, j’autorise R-One Vidéaste à me filmer, photographier et enregistrer ma voix et/ou mon image dans le cadre :
- d’événements publics/privés
- de contenus pour les réseaux sociaux, site web, etc.
- du montage et de la diffusion

3. Étendue
J'autorise la diffusion sur :
- Facebook, Instagram, YouTube, etc.
- Site R-One Vidéaste
- Supports print et numériques

4. Durée
Cette autorisation est valable 5 ans à partir du ${date}

5. Droit de retrait
Je peux demander le retrait à l’adresse mail de R-One après les 5 ans, sans poursuite possible.

6. Données personnelles
Conformément au RGPD, je peux exercer mes droits à tout moment. Mes données ne seront jamais transmises sans accord.

7. Absence de contrepartie
Cette autorisation est accordée gratuitement.

8. Base légale
Article 9 du Code civil, article 226-1 du Code pénal, RGPD.

Fait à : ${faitA}
Le : ${date}

Signature de la personne concernée :
Lu et approuvé – ${prenom} ${nom}

Signature de R-One Vidéaste :
Lu et approuvé – Erwan Lebreton
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
    .then(() => {
      document.getElementById("status-message").textContent =
        "✅ Document envoyé avec succès à " + email;
    })
    .catch((error) => {
      document.getElementById("status-message").textContent =
        "❌ Erreur d'envoi : " + error.text;
    });
});
