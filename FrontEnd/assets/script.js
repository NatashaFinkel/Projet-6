//  Création de variables vides (pour l'instant !).
let categories;
let works;

//  Pour ne pas avoir à réécrire la même chose
//  si on doit télécharger d'autres données de la
//  même api.
const apiUrl = `http://localhost:5678/api`;

//  Pour récupérer les données des
//  travaux précédents.
async function fetchWorkData() {
  //  Await met en pause l'exécution du code tant que
  //  la promesse n'a pas renvoyé son résultat.
  const response = await fetch(`${apiUrl}/works`);
  console.log("Le Fetch (travaux précédents) a réussi !");

  const data = await response.json();
  console.log(data);

  const workData = data;
  return workData;
}

fetchWorkData().then((workData) => {
  console.log("Les travaux précédents ont été transférés !");

  //  Les données sont placées dans la variable works qui
  //  devient un tableau.
  const works = workData;

  worksGenerator(works);
});

//  Pour récupérer les données des
//  catégories déjà existantes.
async function fetchCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  console.log("Le Fetch (catégories) a réussi !");

  const categoriesData = await response.json();
  console.log(categoriesData);
  return categoriesData;
}

fetchCategories().then((categoriesData) => {
  console.log("Les catégories ont été transférées !");

  categories = categoriesData;
});

function worksGenerator(works) {
  //  Pour effacer dynamiquement tout
  //  le contenu de la class gallery.
  document.querySelector(".gallery").innerHTML = "";

  //  La boucle for va créer le nouveau contenu de gallery.
  for (let i = 0; i < works.length; i++) {
    const newGallery = works[i];

    const galleryNewLocation = document.querySelector(".gallery");

    const createFigure = document.createElement("figure");

    const createImage = document.createElement("img");
    createImage.src = newGallery.imageUrl;
    createImage.alt = newGallery.title;

    const createFigCaption = document.createElement("figcaption");
    createFigCaption.innerHTML = newGallery.title;

    galleryNewLocation.appendChild(createFigure);
    createFigure.appendChild(createImage);
    createFigure.appendChild(createFigCaption);
  }
  console.log();
}
