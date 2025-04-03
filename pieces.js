// Récupération des données du fichier JSON contenant les pièces automobiles
const reponse = await fetch('pieces-autos.json'); // Envoie une requête pour récupérer le fichier JSON
const pieces = await reponse.json(); // Transforme la réponse en un objet JSON (les données des pièces)
import { ajoutListenersAvis } from "./avis.js";

// Fonction pour générer l'affichage des pièces dans la page
function genererPieces(pieces){
    // Parcourt chaque pièce dans le tableau pieces
    for (let i = 0; i < pieces.length; i++) {
        const article = pieces[i]; // Récupère l'article actuel de la boucle

        // Récupère l'élément du DOM où les fiches des pièces seront affichées
        const sectionFiches = document.querySelector(".fiches");

        // Crée un nouvel élément 'article' qui contiendra toutes les informations d'une pièce
        const pieceElement = document.createElement("article");

        // Crée une balise image pour afficher l'image de la pièce
        const imageElement = document.createElement("img");
        imageElement.src = article.image; // Affecte l'URL de l'image de la pièce

        // Crée un élément 'h2' pour afficher le nom de la pièce
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom; // Affecte le nom de la pièce

        // Crée un élément 'p' pour afficher le prix de la pièce
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`; // Affiche le prix avec un symbole d'€ et une indication si le prix est faible ou élevé

        // Crée un élément 'p' pour afficher la catégorie de la pièce
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)"; // Affiche la catégorie ou un texte par défaut si aucune catégorie

        // Crée un élément 'p' pour afficher la description de la pièce
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment."; // Affiche la description ou un message par défaut si aucune description

        // Crée un élément 'p' pour afficher la disponibilité de la pièce (en stock ou rupture de stock)
        const stockElement = document.createElement("p");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock"; // Affiche si la pièce est en stock ou non

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";
        
        // Ajoute l'élément 'article' à la section d'affichage des fiches
        sectionFiches.appendChild(pieceElement);

        // Ajoute tous les éléments créés (image, nom, prix, catégorie, etc.) à l'élément 'article'
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton)
    }// Ajout de la fonction ajoutListenersAvis
    ajoutListenersAvis();
}

// Appel de la fonction pour générer les pièces à partir des données récupérées
genererPieces(pieces);

// Gestion des événements pour trier les pièces par prix (croissant)
const boutonTrier = document.querySelector(".btn-trier");

boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces); // Crée une copie du tableau pieces
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix; // Trie les pièces par prix croissant
    });
    document.querySelector(".fiches").innerHTML = ""; // Efface le contenu précédent
    genererPieces(piecesOrdonnees); // Affiche les pièces triées
});

// Gestion des événements pour filtrer les pièces avec un prix inférieur ou égal à 35€
const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35; // Filtre les pièces avec un prix inférieur ou égal à 35€
    });
    document.querySelector(".fiches").innerHTML = ""; // Efface le contenu précédent
    genererPieces(piecesFiltrees); // Affiche les pièces filtrées
});

// Gestion des événements pour trier les pièces par prix (décroissant)
const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces); // Crée une copie du tableau pieces
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix; // Trie les pièces par prix décroissant
    });
    document.querySelector(".fiches").innerHTML = ""; // Efface le contenu précédent
    genererPieces(piecesOrdonnees); // Affiche les pièces triées
});

// Gestion des événements pour filtrer les pièces avec une description disponible
const boutonNoDescription = document.querySelector(".btn-nodesc");

boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description; // Filtre les pièces qui ont une description
    });
    document.querySelector(".fiches").innerHTML = ""; // Efface le contenu précédent
    genererPieces(piecesFiltrees); // Affiche les pièces filtrées
});

// Création d'une liste des noms des pièces dont le prix est inférieur ou égal à 35€
const noms = pieces.map(piece => piece.nom); // Récupère uniquement les noms des pièces
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){ // Si le prix est supérieur à 35€, on supprime la pièce de la liste
        noms.splice(i,1);
    }
}
console.log(noms) // Affiche les noms des pièces abordables

// Création d'une liste HTML pour afficher les pièces abordables
const pElement = document.createElement('p');
pElement.innerText = "Pièces abordables"; // En-tête pour la section des pièces abordables

// Création d'une liste non ordonnée (ul) pour afficher les noms des pièces abordables
const abordablesElements = document.createElement('ul');
for(let i = 0; i < noms.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i]; // Ajoute chaque nom de pièce dans un élément 'li'
    abordablesElements.appendChild(nomElement); // Ajoute chaque élément 'li' à la liste 'ul'
}

// Ajoute l'en-tête et la liste à la section HTML prévue pour afficher les pièces abordables
document.querySelector('.abordables').appendChild(pElement).appendChild(abordablesElements);

// Code pour afficher les pièces disponibles (en stock)
const nomsDisponibles = pieces.map(piece => piece.nom); // Récupère les noms des pièces disponibles
const prixDisponibles = pieces.map(piece => piece.prix); // Récupère les prix des pièces disponibles

for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].disponibilite === false){ // Si la pièce n'est pas disponible, on la retire de la liste
        nomsDisponibles.splice(i,1);
        prixDisponibles.splice(i,1);
    }
}

// Création de la liste des pièces disponibles
const disponiblesElement = document.createElement('ul');
for(let i = 0; i < nomsDisponibles.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`; // Affiche le nom et le prix de chaque pièce disponible
    disponiblesElement.appendChild(nomElement); // Ajoute chaque élément 'li' à la liste 'ul'
}

// Création d'un paragraphe pour indiquer que ce sont les pièces disponibles
const pElementDisponible = document.createElement('p');
pElementDisponible.innerText = "Pièces disponibles:"; // En-tête pour la section des pièces disponibles

// Ajoute l'en-tête et la liste des pièces disponibles dans la section HTML prévue
document.querySelector('.disponibles').appendChild(pElementDisponible).appendChild(disponiblesElement);

// Code pour filtrer les pièces selon un prix maximum choisi par l'utilisateur via un champ de saisie
const inputPrixMax = document.querySelector('#prix-max');
inputPrixMax.addEventListener('input', function (){
    const piecesFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value; // Filtre les pièces dont le prix est inférieur ou égal à la valeur saisie
    });
    document.querySelector(".fiches").innerHTML = ''; // Efface le contenu précédent
    genererPieces(piecesFiltrees); // Affiche les pièces filtrées
});