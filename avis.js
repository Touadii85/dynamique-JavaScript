// Fonction qui ajoute les listeners sur tous les boutons "Afficher les avis"
export function ajoutListenersAvis() {
    // Sélectionne tous les boutons à l’intérieur des balises <article> dans la section .fiches
    const piecesElements = document.querySelectorAll(".fiches article button");

    // Boucle sur tous les boutons trouvés
    for (let i = 0; i < piecesElements.length; i++) {

        // Ajoute un événement "click" sur chaque bouton
        piecesElements[i].addEventListener("click", async function (event) {

            // Récupère l’ID de la pièce à partir de l’attribut data-id du bouton cliqué
            const id = event.target.dataset.id;

            // Appel de l’API pour récupérer les avis liés à cette pièce
            const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");

            // Conversion de la réponse en objet JSON
            const avis = await reponse.json();

            // Enregistrement des avis dans le localStorage pour éviter de les recharger à chaque fois
            window.localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis))

            // Récupération de l’élément HTML parent (la carte de la pièce)
            const pieceElement = event.target.parentElement;

            // Affiche les avis dans la carte de la pièce
            afficherAvis(pieceElement, avis)
        });

    }
}

// Fonction pour afficher les avis à l’intérieur d’un élément de pièce
export function afficherAvis(pieceElement, avis){
    // Création d’un paragraphe pour contenir les avis
    const avisElement = document.createElement("p");

    // Boucle sur la liste des avis pour les afficher un par un
    for (let i = 0; i < avis.length; i++) {
        // Ajout de chaque avis avec l’utilisateur en gras
        avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
    }

    // Ajout du paragraphe dans l’élément HTML de la pièce
    pieceElement.appendChild(avisElement);
}

// Fonction qui ajoute un listener sur le formulaire d’envoi d’avis
export function ajoutListenerEnvoyerAvis() {
    // Sélection du formulaire avec la classe .formulaire-avis
    const formulaireAvis = document.querySelector(".formulaire-avis");

    // Écoute de l’événement submit sur le formulaire
    formulaireAvis.addEventListener("submit", function (event) {
        // Empêche le rechargement automatique de la page
        event.preventDefault();

        // Création d’un objet "avis" contenant les données du formulaire
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
        };

        // Conversion des données en JSON
        const chargeUtile = JSON.stringify(avis);

        // Envoi des données au serveur via l’API (méthode POST)
        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    });
}
