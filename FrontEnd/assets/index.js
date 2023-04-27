//  Pour ne pas avoir à réécrire la même chose
//  si on doit télécharger d'autres données de la
//  même api.
const apiUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
const logInAndOut = document.querySelector(".logInAndOut");
const body = document.querySelector("body");
const header = document.querySelector("header");
let adminBanner;
let modifButton;
const galleryBtn = document.querySelector(".galleryBtn");

async function getCategories() {
  try {
    const response = await fetch(apiUrl + "categories");
    if (!response.ok) {
      throw new Error(`Erreur : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Impossible d'obtenir les catégories: ${error}`);
  }
}

async function getPreviousWork() {
  try {
    const response = await fetch(apiUrl + "works");
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Impossible d'obtenir les projets: ${error}`);
  }
}

async function createFilterBtns(works) {
  const categories = new Set();
  categories.add("Tous");

  for (let element of works) {
    categories.add(element.category.name);
  }

  //  Pour créer la zone avec les filtres,
  //  ajouter la classe et la placer.
  const filterZone = document.createElement("div");
  filterZone.classList.add("filterZone");

  let fragment = document.createDocumentFragment();
  fragment.appendChild(filterZone);
  portfolio.insertBefore(filterZone, gallery);

  for (let element of categories) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "filterButton");
    button.setAttribute("data-category", element);
    button.textContent = element;
    //   button.addEventListener("click", test);
    filterZone.appendChild(button);
  }
  return fragment;
}

const filterButton = document.getElementsByClassName("filterButton");

//function selectFilter() {
//  this.classList.add("selectedFilter");
//}

async function worksGenerator(works) {
  let gallery = document.createElement("div");
  gallery.setAttribute("class", "gallery");

  let fragment = document.createDocumentFragment();
  fragment.appendChild(gallery);

  for (let element of works) {
    let figure = document.createElement("figure");
    figure.setAttribute("class", "galleryContent");
    figure.setAttribute("data-category", element.category.name);
    figure.setAttribute("data-id", element.id);

    let img = document.createElement("img");
    img.setAttribute("crossorigin", "anonymous");
    img.setAttribute("src", element.imageUrl);
    img.getAttribute("alt", element.title);

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = element.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  }
  return fragment;
}

async function addToDOM() {
  const portfolio = document.getElementById("portfolio");
  const works = await getPreviousWork();

  let fragment = document.createDocumentFragment();
  fragment.appendChild(await createFilterBtns(works));
  fragment.appendChild(await worksGenerator(works));

  portfolio.appendChild(fragment);
  activFilter();
}

async function activFilter() {
  const filterZone = document.querySelector(".filterZone");
  const galleryContent = document.getElementsByClassName("galleryContent");

  //  Ajoute la class selectedFilter au premier élément qui
  //  possède la class filterButton.
  filterZone.querySelector(".filterButton").classList.add("selectedFilter");

  filterZone.addEventListener("click", function (selectedItem) {

    //  Quand on clique sur l'un des filtres, la class
    //  selectedFilter se place sur celui-ci, et se
    //  déplace quand on clique sur l'un des autres filtres.
    filterZone
      .querySelector(".selectedFilter")
      .classList.remove("selectedFilter");
    selectedItem.target.classList.add("selectedFilter");

    //  Active (ou désactive) l'affichage des figures en fonction 
    //  de leur numéro de categorie.
    let category = selectedItem.target.getAttribute("data-category");
    for (let figure of galleryContent) {
      let filter = figure.getAttribute("data-category");
      switch (true) {
        case category == "Tous":
          figure.style.display = "block";
          break;
        case filter == category:
          figure.style.display = "block";
          break;
        default:
          figure.style.display = "none";
      }
    }
  });
}

addToDOM();

const createAdminBanner = () => {
  adminBanner = document.createElement("div");
  adminBanner.classList.add("adminBanner");
  adminBanner.innerHTML = `<i class="fa-regular fa-pen-to-square penIcon"></i>
       <p>Mode édition</p>
       <button class="adminBannerBtn">publier les changements</button>`;
};

const createModifBtn = (id) => {
  modifButton = document.createElement("div");
  modifButton.classList.add("flexBtn");
  modifButton.setAttribute("id", id);
  modifButton.innerHTML = `<i class="fa-regular fa-pen-to-square penIcon"></i><p>modifier</p>`;
};

if (localStorage.token) {
  logInAndOut.innerHTML = "logout";
  createAdminBanner();
  body.insertBefore(adminBanner, header);

  //  Pour créer le bouton qui modifie la photo de Sophie Bluel.
  createModifBtn("modifIntroPictureBtn");
  const introPicture = introduction.querySelector("figure");
  introPicture.append(modifButton);
  modifIntroPictureBtn.classList.add("movedBtn");

  //  Pour créer le bouton qui modifie le texte d'introduction.
  createModifBtn("modifTextIntroBtn");
  const introArticle = introduction.querySelector("article");
  const introArticleTitle = introduction.querySelector("h2");
  introArticle.insertBefore(modifButton, introArticleTitle);

  //  Pour créer le bouton qui modifie le contenu de la galerie.
  createModifBtn("modifGalleryBtn");
  modifButton.addEventListener("click", openOriginalModal);
  galleryBtn.append(modifButton);
  console.log("Vous êtes sur l'interface 'administrateur'. Bienvenue !");
} else {
  console.log("Vous êtes sur l'interface 'client'. Bienvenue !");
}

function openOriginalModal() {
  console.log("ça marche !");
}

function test() {
  console.log("Test réussi !");
}

//  Pour faire le logout.
const logBtn = document.querySelector(".logBtn");
logBtn.addEventListener("click", getOut);

function getOut() {
  if (logBtn.textContent === "logout") {
    deleteToken();
    logBtn.setAttribute("href", "./index.html");
  }

  if (logBtn.textContent === "login") {
    logBtn.setAttribute("href", "./login.html");
  }
}

function deleteToken() {
  localStorage.clear();
}
