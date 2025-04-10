(function () {
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
        date
      };

      try {
        const response = await fetch("https://signature-backend.onrender.com/send-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        document.getElementById("status-message").textContent = result.message || "✅ Document envoyé avec succès !";
      } catch (error) {
        console.error(error);
        document.getElementById("status-message").textContent = "❌ Erreur lors de l'envoi du formulaire.";
      }
    });
  })();
