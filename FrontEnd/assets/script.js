//  Création de variables vides (pour l'instant !).
let categories;
let works;
let categoriesData;

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

  //  Les données sont placées dans la variable works
  const works = workData;

  worksGenerator(works);
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
}

//  Pour récupérer les données des
//  catégories déjà existantes.
async function fetchCategories() {
  const response = await fetch(`${apiUrl}/categories`);
  console.log("Le Fetch (catégories) a réussi !");

  const data = await response.json();
  // console.log(data);

  const categoriesData = data;
  return categoriesData;
}

fetchCategories().then((categoriesData) => {
  console.log("Les catégories ont été transférées !");

  const categories = categoriesData;

  categoriesGenerator(categories);
});

function categoriesGenerator(categories) {
  console.log(categories);

  for (let i = 0; i < categories.length; i++) {
    const WW = categories[i];

    const filterLocation = document.querySelector(".filter-box");

    const filterButtons = document.createElement("buttons");
    filterButtons.setAttribute("class", "filter-btn");
    filterButtons.innerHTML = WW.name;

    filterLocation.appendChild(filterButtons);
  }

  const filterLocation = document.querySelector(".filter-box");
  const firstFilterButton = document.createElement("button");
  firstFilterButton.setAttribute("class", "first-filter-btn");
  firstFilterButton.innerText = "Tous";
  filterLocation.prepend(firstFilterButton);
}

/////  Brouillons (on verra demain si on utilise ou pas !)

//  Pour mettre dynamiquement les filtres et
//   éviter les doublons.
// const mySet = new Set();
// console.log(mySet);

//  Pour ajouter le résultat de fetchCategories dans mySet
//  mySet.add(fetchCategories());
// console.log(mySet);

// for (let i = 0; i < mySet.length; i++) {
//  const filterButtons = document.createElement("buttons");
//  filterSet.setAttribute("type", "submit");

// mySet.add(filterButtons);
//   filterLocation.add(mySet);
//  filterLocation.appendChild(mySet);

//  console.log(mySet);
//    console.log(filterButtons);
//   console.log(categories);

//    return categories;
//  }

// function XX() {

//   //  Pour ajouter le résultat de fetchCategories dans mySet
//   mySet.add(fetchCategories());

//   return mySet;

//   function ZZ() {}

//   function TT() {}
// }
