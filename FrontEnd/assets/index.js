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

  galleryBtn.append(modifButton);
  console.log("Vous êtes sur l'interface 'administrateur'. Bienvenue !");
} else {
  console.log("Vous êtes sur l'interface 'client'. Bienvenue !");
}

function test1() {
  console.log("Test 1 réussi !");
}

function test2() {
  console.log("Test 2 réussi !");
}

function test3() {
  console.log("Test 3 réussi !");
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

const asideContent = document.querySelector(".aside-content");
const originalModal = document.querySelector("#original-modal");
const addWorkModal = document.querySelector("#add-work-modal");

const firstModal = document.querySelector("#first-modal");
const secondModal = document.querySelector("#second-modal");

const closeFirstModal = document.querySelector(".close-original-modal");
const closeSecondModal = document.querySelector(".close-add-work-modal");

const modifGalleryBtn = document.querySelector("#modifGalleryBtn");
modifGalleryBtn.addEventListener("click", createModalBG);
modifGalleryBtn.addEventListener("click", openOriginalModal);

const modalBG = document.querySelector(".modal-bg");

//  Pour activer le background-color plus
//  foncé et la mise en page pour les modales.
function createModalBG() {
  modalBG.classList.add("active");
  modalBG.classList.add("aside-content");
}

function openOriginalModal() {
  firstModal.classList.add("aside-content");
  firstModal.classList.add("active");
  originalModal.classList.add("active");
}

//  Pour ouvrir la deuxième modale, et s'assurer que la
//  première modale a bien été fermée.
const openSecModal = document.querySelector("#open-sec-mod");

openSecModal.addEventListener("click", (event) => {
  function openAddWorkModal() {
    firstModal.classList.remove("aside-content");
    firstModal.classList.remove("active");
    originalModal.classList.remove("active");

    secondModal.classList.add("aside-content");
    secondModal.classList.add("active");
    addWorkModal.classList.add("active");
  }

  function isFirstModalClosed() {
    if (
      firstModal.classList.contains("aside-content") &&
      firstModal.classList.contains("active") &&
      originalModal.classList.contains("active") &&
      secondModal.classList.contains("aside-content") &&
      secondModal.classList.contains("active") &&
      addWorkModal.classList.contains("active")
    ) {
      console.log("Les deux modales sont ouvertes !");
    } else if (
      !firstModal.classList.contains("aside-content") &&
      !firstModal.classList.contains("active") &&
      !originalModal.classList.contains("active") &&
      secondModal.classList.contains("aside-content") &&
      secondModal.classList.contains("active") &&
      addWorkModal.classList.contains("active")
    ) {
      console.log("La 1ère modale est fermée, et la 2e modale est ouverte !");
    }
  }

  openAddWorkModal();
  isFirstModalClosed();

  //  La fonction isFirstModalClosed est appellée
  //  uniquement lorsque la seconde modale est chargée.
  window.addEventListener("load", isFirstModalClosed);
});

closeFirstModal.addEventListener("click", closeOriginalModal);

function closeOriginalModal() {
  modalBG.classList.remove("active");
  modalBG.classList.remove("aside-content");

  firstModal.classList.remove("aside-content");
  firstModal.classList.remove("active");
  originalModal.classList.remove("active");
}

closeSecondModal.addEventListener("click", closeAddWorkModal);

function closeAddWorkModal() {
  modalBG.classList.remove("active");
  modalBG.classList.remove("aside-content");

  secondModal.classList.remove("aside-content");
  secondModal.classList.remove("active");
  addWorkModal.classList.remove("active");
}

window.addEventListener("click", clickAway);

function clickAway(event) {
  //  Renvoie true si on clique sur le btn qui ouvre la 1ère modale.
  const openModalBtn = modifGalleryBtn.contains(event.target);
  //  console.log(openModalBtn);

  //  Renvoie true si on clique sur le btn qui ouvre la 2e modale.
  const openSecModalBtn = openSecModal.contains(event.target);
  //console.log(openSecModalBtn);

  const modal = document.querySelector(".modal");
  // console.log(modal);

  const allModals = document.querySelectorAll(".modal");
  //  console.log(allModals);

  //  Renvoie true si on clique sur la 1ère  modale.
  const clickFirstModal = modal.contains(event.target);
  //  console.log(clickFirstModal);

  //  Renvoie true si on clique sur la 2e  modale.
  const clickSecondModal = addWorkModal.contains(event.target);
  // console.log(clickSecondModal);

  if (
    !openModalBtn &&
    originalModal.classList.contains("active") &&
    !clickFirstModal
  ) {
    modalBG.classList.remove("active");
    firstModal.classList.remove("active");
    originalModal.classList.remove("active");
  } else if (openModalBtn) {
    modalBG.classList.add("active");
    firstModal.classList.add("active");
    originalModal.classList.add("active");
  } else if (
    !openSecModalBtn &&
    addWorkModal.classList.contains("active") &&
    !clickSecondModal
  ) {
    modalBG.classList.remove("active");
    secondModal.classList.remove("active");
    addWorkModal.classList.remove("active");
  } else if (openSecModalBtn) {
    modalBG.classList.add("active");
    secondModal.classList.add("active");
    addWorkModal.classList.add("active");
  }
}

const arrow = document.querySelector(".arrow-icon");
arrow.addEventListener("click", test1);

/*
function closeAll() {
  asideContent.style.display = "none";
  originalModal.style.display = "none";
  addWorkModal.style.display = "none";
}
*/
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

    trashIcon.addEventListener("click", test1);

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
}

createMiniGallery();
