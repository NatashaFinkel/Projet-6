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
  filterCreator();
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
  console.log(data);

  categoriesData = data;
  return categoriesData;
}

fetchCategories().then((categoriesData) => {
  console.log("Les catégories ont été transférées !");
  return categoriesData;
});

function filterCreator() {
  let filter = document.getElementById("filter-btn");
  // let nodeList = document.querySelectorAll("input");

  for (let i = 0; i < 4; i++) {
    const filterBtn = document.createElement("input");
    filterBtn.setAttribute("type", "submit");
    filterBtn.setAttribute("value", "");


    //  Pour placer les éléments crées en haut 
    //  du container (gallery)
   filter.prepend(filterBtn);

  }
}

//  on prend le nombre d'éléments inputs crées
//   dans cette fonction comme index i.
//  i = nodeList[0];
// console.log(nodeList.length);
//  console.log(nodeList[0]);

//  let nodeList = document.querySelectorAll("input");
//  console.log(nodeList);

// for (let i = 0; i < nodeList.length; i++) {
// nodeList[i].setAttribute("value", " ");

///////  ici ça marche !
// Pour lister les inputs et les afficher dans la console.
//   let nodeList = document.querySelectorAll("input");
//   console.log(nodeList);

/* function Filtername() {
  let nodeList = document.querySelectorAll("input");
  console.log(nodeList);

 // for (let i = 0; i < nodeList.length; i++) {
  nodeList[i].setAttribute("value", " ");
  } */
//  console.log(nodeList);
//    console.log(nodeList[0].value);

//  for (let i = 0; i < nodeList.length; i++) {
//   nodeList[0].setAttribute("value", categoriesData[0].name);

////// ça marche !
//    nodeList[1].setAttribute("value", "vanille");

//    nodeList[0].setAttribute("value", categoriesData[i].name);
// }

// let nodeList = document.querySelectorAll("input");
//  console.log(nodeList);

//  for (let i = 0; i < 4; i++) {

//}
//}
//console.log(nodeList);
//   const nodeList = document.querySelectorAll("input");
//   nodeList[0].setAttribute("value", "Tous");
//  nodeList[1].setAttribute("value", categories[1].name);

// Pour lister les inputs et les afficher dans la console.
// const nodeList = document.querySelectorAll("input");
// console.log(nodeList);

//  nodeList[0].setAttribute("value", "Tous");
// nodeList[1].setAttribute("value", categories[1].name);
