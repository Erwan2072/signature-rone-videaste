document.getElementById("signature-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const getValue = id => document.getElementById(id).value;
  const prenom = getValue("prenom");
  const nom = getValue("nom");
  const email = getValue("email");
  const adresse = getValue("adresse");
  const telephone = getValue("telephone");
  const faitA = getValue("faitA");
  const date = getValue("date");
  const majeur = document.getElementById("majeur").checked;
  const statusMessage = document.getElementById("status-message");

  if (!majeur) {
    alert("Vous devez certifier être majeur(e). Merci.");
    return;
  }

  // Réinitialiser message et afficher overlay
  statusMessage.textContent = "";
  document.getElementById("loading-overlay").style.display = "flex";

  const payload = { prenom, nom, email, adresse, telephone, faitA, date };

  try {
    const response = await fetch("https://signature-rone-videaste.onrender.com/send-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      statusMessage.textContent = `✅ Vous recevrez une copie du droit à l'image sur ${email}`;
      statusMessage.style.color = "#2ecc71";
    } else {
      statusMessage.textContent = `❌ Erreur : ${data.error}`;
      statusMessage.style.color = "red";
    }

  } catch (error) {
    console.error("Erreur lors de l’envoi :", error);
    statusMessage.textContent = "❌ Une erreur est survenue : " + error.message;
    statusMessage.style.color = "red";
  }

  // Cacher le loader une fois terminé
  document.getElementById("loading-overlay").style.display = "none";
});
