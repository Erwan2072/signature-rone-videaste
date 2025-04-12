window.onload = function () {
  const form = document.getElementById("signature-form");
  const inputs = form.querySelectorAll("input, button");
  inputs.forEach(el => el.disabled = true);

  const warning = document.getElementById("scroll-warning");
  if (warning) warning.style.display = "block";
};

// Vérifie si on a scrollé jusqu’en bas du règlement
function checkScroll() {
  const box = document.getElementById("terms-box");
  const form = document.getElementById("signature-form");
  const warning = document.getElementById("scroll-warning");

  if (box.scrollTop + box.clientHeight >= box.scrollHeight) {
    form.querySelectorAll("input, button").forEach(el => el.disabled = false);
    if (warning) warning.style.display = "none";
  }
}

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

  if (!majeur) {
    alert("Vous devez certifier être majeur(e). Merci.");
    return;
  }

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

    const statusMessage = document.getElementById("status-message");
    if (response.ok) {
      statusMessage.textContent = `✅ Vous recevrez une copie du droit à l'image sur ${email}`;
      statusMessage.style.color = "#2ecc71";
    } else {
      statusMessage.textContent = `❌ Erreur : ${data.error}`;
      statusMessage.style.color = "red";
    }

  } catch (error) {
    console.error("Erreur lors de l’envoi :", error);
    document.getElementById("status-message").textContent =
      "❌ Une erreur est survenue : " + error.message;
  }
});
