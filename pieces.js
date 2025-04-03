// Importation des fonctions depuis le fichier avis.js
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis } from "./avis.js";

// Récupération des données "pieces" stockées dans le localStorage (si elles existent déjà)
let pieces = window.localStorage.getItem('pieces');

// Si aucune pièce n’est présente dans le localStorage
if (pieces === null){
    // Appel de l’API locale pour récupérer les pièces
    const reponse = await fetch('http://localhost:8081/pieces/');
    // Conversion de la réponse en objet JavaScript (format JSON)
    pieces = await reponse.json();
    // Transformation des données en texte JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage dans le localStorage sous forme de texte
    window.localStorage.setItem("pieces", valeurPieces);
}else{
    // Si les données sont déjà présentes : on les reconvertit en objet JS
    pieces = JSON.parse(pieces);
}

// Ajout du listener sur le formulaire pour gérer l’envoi d’un avis utilisateur
ajoutListenerEnvoyerAvis();

// Fonction qui crée les cartes de présentation des pièces dans le HTML
function genererPieces(pieces){
    // Boucle sur toutes les pièces
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i];

        // Récupération de la section HTML où insérer les cartes
        const sectionFiches = document.querySelector(".fiches");

        // Création de la carte (balise article)
        const pieceElement = document.createElement("article");
        pieceElement.dataset.id = pieces[i].id // Attribut "data-id" pour cibler l'article

        // Création des balises pour chaque info de la pièce
        const imageElement = document.createElement("img");
        imageElement.src = article.image;

        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;

        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;

        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";

        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

        // Création du bouton pour afficher les avis de cette pièce
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";

        // Ajout des éléments dans la carte
        sectionFiches.appendChild(pieceElement);
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton);
    }

    // Ajout des listeners sur tous les boutons "Afficher les avis"
    ajoutListenersAvis();
}

// Appel initial pour afficher les pièces dès le chargement
genererPieces(pieces);

// Boucle pour afficher les avis stockés localement pour chaque pièce
for(let i = 0; i < pieces.length; i++){
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
        afficherAvis(pieceElement, avis)
    }
}

// ---- GESTION DES BOUTONS ---- //

// Bouton de tri par prix croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

// Bouton de filtre : pièces à prix inférieur ou égal à 35 €
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

// Bouton de tri par prix décroissant
const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

// Bouton pour afficher uniquement les pièces avec description
const boutonNoDescription = document.querySelector(".btn-nodesc");
boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

// ---- LISTES DÉRIVÉES POUR AFFICHAGE ---- //

// Liste des noms des pièces à moins de 35 €
const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1);
    }
}
console.log(noms); // Affiche la liste filtrée dans la console

// Création d’un paragraphe d’en-tête
const pElement = document.createElement('p');
pElement.innerText = "Pièces abordables";

// Création de la liste HTML des noms
const abordablesElements = document.createElement('ul');
for(let i = 0; i < noms.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
}

// Ajout dans la section '.abordables'
document.querySelector('.abordables')
    .appendChild(pElement)
    .appendChild(abordablesElements);

// ---- DISPONIBILITÉ DES PIÈCES ---- //

// Création des listes noms/prix uniquement pour les pièces disponibles
const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);

for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].disponibilite === false){
        nomsDisponibles.splice(i,1);
        prixDisponibles.splice(i,1);
    }
}

// Création de la liste HTML
const disponiblesElement = document.createElement('ul');
for(let i = 0; i < nomsDisponibles.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement);
}

// Ajout dans la section '.disponibles'
const pElementDisponible = document.createElement('p');
pElementDisponible.innerText = "Pièces disponibles:";
document.querySelector('.disponibles')
    .appendChild(pElementDisponible)
    .appendChild(disponiblesElement);

// ---- FILTRE PAR PRIX EN TEMPS RÉEL ---- //

// Récupération du champ input de prix max
const inputPrixMax = document.querySelector('#prix-max');

// Mise à jour de l'affichage quand l'utilisateur modifie le prix
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);  
});

// ---- MISE À JOUR DES DONNÉES ---- //

// Bouton pour vider les données stockées en localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
});
