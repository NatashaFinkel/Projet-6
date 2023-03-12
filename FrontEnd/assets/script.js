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

  //  Contrairement à l'Array, Set n'accepte pas
  //  de valeurs "en doublon", donc c'est plus
  //  pratique à contrôler.
  let filterSet = new Set();

  for (let i = 0; i < 4; i++) {
    filterSet = document.createElement("input");
    filterSet.setAttribute("type", "submit");

    //  Pour placer les éléments où il faut.
    filter.prepend(filterSet);

    //  nodeList séléctione tous les éléments "inputs"
    let nodeList = document.querySelectorAll("input");

    //  Ceci change la valeur de l'élément de la nodeList
    //  dont le numéro d'index est entre les crochets.
    nodeList[0].setAttribute("value", "Tous");
    nodeList[1].setAttribute("value", "Objets");
    nodeList[2].setAttribute("value", "Appartements");
    nodeList[3].setAttribute("value", "Hôtels & restaurants");
  }
}

/////   C'est pour filtrer (à utiliser plus tard !)
// filterBtn.addEventListener("click", filterCategories() => {
//  code qui filtrera par catégorie
//   });
