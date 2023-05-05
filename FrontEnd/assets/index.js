//  Pour ne pas avoir à réécrire la même chose
//  si on doit télécharger d'autres données de la
//  même api.
const apiUrl = "http://localhost:5678/api/";

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
const logInAndOut = document.querySelector(".logInAndOut");
const body = document.querySelector("body");
const header = document.querySelector("header");
const figure = document.querySelector("figure");
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
    filterZone.appendChild(button);
  }
  return fragment;
}

const filterButton = document.getElementsByClassName("filterButton");

async function worksGenerator(works) {
  let fragment = document.createDocumentFragment();
  fragment.appendChild(gallery);

  for (let element of works) {
    let figure = document.createElement("figure");
    figure.setAttribute("class", "bigFigure");
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
  const bigFigure = document.getElementsByClassName("bigFigure");

  //  Ajoute la class selectedFilter au premier élément qui
  //  possède la class filterButton (pour qu'il soit vert "par défaut").
  filterZone.querySelector(".filterButton").classList.add("selectedFilter");

  //  J'ai choisi de mettre l'addEventListener sur filterZone pour ne pas
  //  appeller la méthode plusieurs fois (à chaque filtre).
  filterZone.addEventListener("click", function (selectedItem) {
    //  Quand on clique sur l'un des filtres, la class
    //  selectedFilter se place sur celui-ci, et se
    //  déplace quand on clique sur l'un des autres filtres.
    filterZone
      .querySelector(".selectedFilter")
      .classList.remove("selectedFilter");
    selectedItem.target.classList.add("selectedFilter");

    // categorie renvoie le nom de la catégorie du filtre sur lequel on clique.
    let category = selectedItem.target.getAttribute("data-category");

    //  Pour chaque figure de chacun des éléments avec la classe bigFigure.
    for (let figure of bigFigure) {
      //  filter renvoie le nom de catégorie de chacune des figures.
      let filter = figure.getAttribute("data-category");

      //  switch est utile quand on veut exécuter une action
      //  qui peut être différente selon certaines conditions.
      //  ici : on vérifie si la valeur est "vraie".
      switch (true) {
        case category == "Tous":
          gallery.style.display = "grid";
          figure.style.display = "block";
          break;

        //  Si le nom de catégorie du filtre est le même que
        //  celui de la figure.
        case category == filter:
          gallery.style.display = "grid";
          figure.style.display = "block";
          break;

        default:
          figure.style.display = "none";
          gallery.style.display = "grid";
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
  originalModal.style.display = "flex";
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

////  Modales.

const originalModal = document.querySelector("#originalModal");
const closeIcon = document.querySelector(".closeIcon");
closeIcon.addEventListener("click", closeModal);

function closeModal() {
  originalModal.style.display = "none";
}

const miniGallery = document.querySelector(".miniGallery");
miniGallery.classList.add("galleryContent");

async function createMiniGallery(works) {
  const modalContent = document.querySelector(".modal-content");
  //  Pour pouvoir utiliser les travaux précédents téléchargés.

  works = await getPreviousWork();
//   console.log(works);
  for (let i = 0; i < works.length; i++) {
    const miniFigure = document.createElement("figure");
    miniFigure.classList.add("miniFigure");

    //  Pour faire apparaître et disparaître l'icône
    //  directionArrow au passage de la souris sur chacune des miniFigures.
    miniFigure.addEventListener("mouseover", displayIcon);
    miniFigure.addEventListener("mouseout", hideIcon);

    const miniImage = document.createElement("img");
    miniImage.classList.add("miniImg");
    miniImage.src = works[i].imageUrl;

    const miniFigcaption = document.createElement("figcaption");
    miniFigcaption.innerHTML = `<p>éditer</p>`;

    const iconDiv = document.createElement("div");
    iconDiv.classList.add("iconDiv");

    //  icône "poubelle".
    const trashIcon = document.createElement("figcaption");
    trashIcon.innerHTML = `<i class="fa-solid fa-trash-can trashCan"></i>`;

    // function removeFigure() {
    //   let element = trashIcon.closest(".miniFigure");
    //   let elementB = works[i];
    //   // let elementB = works[i];
    //   console.log(element);
    //   console.log(elementB);
    //   //    element.parentNode.removeChild(element);
    // }

    trashIcon.addEventListener("click", test);

    //  icône "flèche multidirectionnelle".
    const directionArrow = document.createElement("figcaption");
    directionArrow.innerHTML = `<i class="fa-solid fa-arrows-up-down-left-right"></i>`;
    directionArrow.style.display = "none";

    function displayIcon() {
      directionArrow.style.display = "block";
    }

    function hideIcon() {
      directionArrow.style.display = "none";
    }

    iconDiv.append(directionArrow);
    iconDiv.append(trashIcon);
    miniFigure.append(iconDiv);

    miniFigure.append(miniFigcaption);
    miniFigure.append(miniImage);
    miniFigure.append(miniFigcaption);
    miniGallery.append(miniFigure);
  }

const btnDiv = document.createElement("div");
btnDiv.classList.add("btn-div");

const submitBtn = document.createElement("input");
submitBtn.setAttribute("type", "submit");
submitBtn.classList.add("submitBtn");
submitBtn.setAttribute("value", "Ajouter une photo");
submitBtn.addEventListener("click", test);

const eraseBtn = document.createElement("input");
eraseBtn.addEventListener("click", test);
eraseBtn.setAttribute("type", "button");
eraseBtn.classList.add("erase-btn");
eraseBtn.setAttribute("value", "Supprimer la galerie");

btnDiv.append(submitBtn);
btnDiv.append(eraseBtn);
modalContent.append(btnDiv);
}

createMiniGallery();
