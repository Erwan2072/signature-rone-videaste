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

    const payload = {
      prenom,
      nom,
      email,
      adresse,
      telephone,
      faitA,
      date,
    };

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
        document.getElementById("status-message").textContent = "✅ PDF envoyé avec succès à " + email;
      } else {
        document.getElementById("status-message").textContent = "❌ Erreur : " + data.error;
      }

    } catch (error) {
      console.error("Erreur lors de l’envoi :", error);
      document.getElementById("status-message").textContent = "❌ Une erreur est survenue : " + error.message;
    }
  });
