//  Pour ne pas avoir à réécrire la même chose
//  si on doit télécharger d'autres données de la
//  même api.
const apiUrl = "http://localhost:5678/api/";
const postWorkUrl = apiUrl + "works";

const token = localStorage.getItem("token");
console.log(token);

const portfolio = document.querySelector("#portfolio");
const gallery = document.querySelector(".gallery");
const logInAndOut = document.querySelector(".logInAndOut");
const body = document.querySelector("body");
const header = document.querySelector("header");
const figure = document.querySelector("figure");
let adminBanner;
let modifButton;

const galleryBtn = document.querySelector(".gallery-btn");
const filterZone = document.querySelector("#filter-zone");
const addBtn = document.querySelector(".add-btn");
const imgBox = document.querySelector(".image-box");

let errorText;
let errorIsHere;

addToDOM();

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

  const categoriesData = await getCategories();

  let fragment = document.createDocumentFragment();
  fragment.appendChild(filterZone);
  portfolio.insertBefore(filterZone, gallery);

  //  Juste pour le bouton "Tous".
  let allButton = document.createElement("button");
  allButton.setAttribute("type", "button");
  allButton.setAttribute("class", "filter-button");
  allButton.setAttribute("data-category", "Tous");
  allButton.setAttribute("data-id", "0");
  allButton.textContent = "Tous";
  filterZone.appendChild(allButton);

  for (let category of categoriesData) {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "filter-button");
    button.setAttribute("data-category", category.name);
    button.setAttribute("data-id", category.id);

    button.textContent = category.name;

    filterZone.appendChild(button);
  }
  return fragment;
}

const filterButton = document.getElementsByClassName("filter-button");

async function worksGenerator(works) {
  let fragment = document.createDocumentFragment();
  fragment.appendChild(gallery);

  for (let element of works) {
    let figure = document.createElement("figure");
    figure.setAttribute("class", "bigFigure");
    figure.setAttribute("data-category", element.category.name);
    figure.setAttribute("data-id", element.id);
    figure.setAttribute("category-id", element.categoryId);

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
  const filterZone = document.querySelector(".filter-zone");
  const bigFigure = document.getElementsByClassName("bigFigure");
  const firstFilterBtn = document.querySelector(".filter-button");

  //  Pour que le premier filtre soit vert "par défaut".
  firstFilterBtn.classList.add("selected-filter");
  firstFilterBtn.setAttribute("id", "filter");

  for (const button of filterButton) {
    button.addEventListener("click", function (selectedItem) {
      filterZone
        .querySelector(".selected-filter")
        .classList.remove("selected-filter");

      let filterId = document.getElementById("filter");
      filterId.removeAttribute("id");

      selectedItem.target.classList.add("selected-filter");

      selectedItem.target.setAttribute("id", "filter");

      let category = selectedItem.target.getAttribute("data-id");

      for (let figure of bigFigure) {
        let filter = figure.getAttribute("category-id");

        if (category == "0") {
          gallery.style.display = "grid";
          figure.style.display = "block";
        } else if (category == filter) {
          gallery.style.display = "grid";
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
          gallery.style.display = "grid";
        }
      }
    });
  }
}

const createAdminBanner = () => {
  adminBanner = document.createElement("div");
  adminBanner.classList.add("admin-banner");
  adminBanner.innerHTML = `<i class="fa-regular fa-pen-to-square pen-icon"></i>
       <p>Mode édition</p>
       <button class="admin-banner-btn">publier les changements</button>`;
};

const createModifBtn = (id) => {
  modifButton = document.createElement("div");
  modifButton.classList.add("flex-btn");
  modifButton.setAttribute("id", id);
  modifButton.innerHTML = `<i class="fa-regular fa-pen-to-square pen-icon"></i><p>modifier</p>`;
};

if (localStorage.token) {
  console.log("Vous êtes sur l'interface Administrateur. Bienvenue !");
  logInAndOut.innerHTML = "logout";
  createAdminBanner();
  body.insertBefore(adminBanner, header);

  filterZone.style.display = "none";

  //  Pour créer le bouton qui modifie la photo de Sophie Bluel.
  createModifBtn("modifIntroPictureBtn");
  const introPicture = introduction.querySelector("figure");
  introPicture.append(modifButton);
  modifIntroPictureBtn.classList.add("moved-btn");

  //  Pour créer le bouton qui modifie le texte d'introduction.
  createModifBtn("modifTextIntroBtn");
  const introArticle = introduction.querySelector("article");
  const introArticleTitle = introduction.querySelector("h2");
  introArticle.insertBefore(modifButton, introArticleTitle);

  //  Pour créer le bouton qui modifie le contenu de la galerie.
  createModifBtn("openModalBtn");
  galleryBtn.addEventListener("click", createModalBG);
  galleryBtn.addEventListener("click", openOriginalModal);

  galleryBtn.append(modifButton);
} else {
  console.log("Vous êtes sur l'interface 'Client'. Bienvenue !");
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
  localStorage.removeItem("token");
}

////  Modales.

const asideContent = document.querySelector(".aside-content");
const originalModal = document.querySelector("#original-modal");
const addWorkModal = document.querySelector("#add-work-modal");

const firstModal = document.querySelector("#first-modal");
const secondModal = document.querySelector("#second-modal");

const closeFirstModal = document.querySelector(".close-original-modal");
const closeSecondModal = document.querySelector(".close-add-work-modal");

const modalBG = document.querySelector(".modal-bg");

//  Pour activer le background-color plus
//  foncé et la mise en page pour les modales.
function createModalBG() {
  modalBG.classList.add("active");
  modalBG.classList.add("aside-content");
}

function closeModalBG() {
  modalBG.classList.remove("active");
  modalBG.classList.remove("aside-content");
}

function openOriginalModal() {
  firstModal.classList.add("aside-content");
  firstModal.classList.add("active");
  originalModal.classList.add("active");
}

//  Pour ouvrir la deuxième modale.
const openSecModal = document.querySelector("#open-sec-mod");
openSecModal.addEventListener("click", closeOriginalModal);
openSecModal.addEventListener("click", openAddWorkModal);

function openAddWorkModal() {
  secondModal.classList.add("aside-content");
  secondModal.classList.add("active");
  addWorkModal.classList.add("active");
}

//  Pour savoir si les deux modales sont
//  ouvertes ou fermées (en même temps).
function AllModalsStatus() {
  if (
    firstModal.classList.contains("aside-content") &&
    firstModal.classList.contains("active") &&
    originalModal.classList.contains("active") &&
    secondModal.classList.contains("aside-content") &&
    secondModal.classList.contains("active") &&
    addWorkModal.classList.contains("active")
  ) {
    console.log("Les deux modales sont ouvertes.");
  } else if (
    !firstModal.classList.contains("aside-content") &&
    !firstModal.classList.contains("active") &&
    !originalModal.classList.contains("active") &&
    !secondModal.classList.contains("aside-content") &&
    !secondModal.classList.contains("active") &&
    !addWorkModal.classList.contains("active")
  ) {
    console.log("Les deux modales sont fermées.");
  } else if (
    !secondModal.classList.contains("aside-content") &&
    !secondModal.classList.contains("active") &&
    !addWorkModal.classList.contains("active") &&
    firstModal.classList.contains("aside-content") &&
    firstModal.classList.contains("active") &&
    originalModal.classList.contains("active")
  ) {
    console.log("La 1ère modale est ouverte, et la 2e modale est fermée.");
  } else if (
    !firstModal.classList.contains("aside-content") &&
    !firstModal.classList.contains("active") &&
    !originalModal.classList.contains("active") &&
    secondModal.classList.contains("aside-content") &&
    secondModal.classList.contains("active") &&
    addWorkModal.classList.contains("active")
  ) {
    console.log("La 2e modale est ouverte, et la 1ère modale est fermée.");
  }
}

closeFirstModal.addEventListener("click", closeOriginalModal);
closeFirstModal.addEventListener("click", closeModalBG);

function closeOriginalModal() {
  firstModal.classList.remove("aside-content");
  firstModal.classList.remove("active");
  originalModal.classList.remove("active");
}

closeSecondModal.addEventListener("click", closeAddWorkModal);
closeSecondModal.addEventListener("click", closeModalBG);

function closeAddWorkModal() {
  secondModal.classList.remove("aside-content");
  secondModal.classList.remove("active");
  addWorkModal.classList.remove("active");
}

const eraseAllBtn = document.querySelector(".erase-btn");

const eraseWork = async (workId) => {
  try {
    const response = await fetch(postWorkUrl + "/" + workId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    console.log("L'élément a été supprimé avec succès !");
  } catch (error) {
    console.error("Impossible de supprimer l'élément");
  }
};

function eraseAllWorks() {
  const allMiniFigures = document.querySelectorAll(".miniFigure");
  const allBigFigures = document.querySelectorAll(".bigFigure");

  try {
    allMiniFigures.forEach((miniFigure) => {
      const dataId = miniFigure.dataset.id;
      eraseWork(dataId)
        .then(() => {
          miniFigure.remove();
        })
        .catch((error) => {
          console.error(
            `Erreur lors de la suppression dans la mini-galerie : ${error}`
          );
        });
    });

    allBigFigures.forEach((bigFigure) => {
      const dataId = bigFigure.dataset.id;
      eraseWork(dataId)
        .then(() => {
          bigFigure.remove();
        })

        .catch((error) => {
          console.error(
            `Erreur lors de la suppression dans la grande galerie : ${error}`
          );
        });
    });
  } catch (error) {
    console.error(`Impossible de supprimer la totalité des travaux : ${error}`);
  }
}

//  Cette fonction ferme les
//   modales dès que l'utilisateur
//  clique ailleurs que sur elles et sur
//  les boutons qui les ouvrent.
async function clickAway(event) {
  //  Renvoie true si on clique sur le btn qui ouvre la 1ère modale.
  const openModalBtn = galleryBtn.contains(event.target);

  //  Renvoie true si on clique sur le btn qui ouvre la 2e modale.
  const openSecModalBtn = openSecModal.contains(event.target);

  const modal = document.querySelector(".modal");

  //  Renvoie true si on clique sur la 1ère modale.
  const clickFirstModal = modal.contains(event.target);

  //  Renvoie true si on clique sur la 2e modale.
  const clickSecondModal = addWorkModal.contains(event.target);

  //  Renvoie true si on clique sur la flèche-retour.
  const clickArrow = arrow.contains(event.target);

  //  Renvoie true si on clique sur le btn submit de la 2e modale.
  const clickAddBtn = addBtn.contains(event.target);

  //  Renvoie true si on clique sur le btn qui supprime tous les travaux.
  const clickEraseAllBtn = eraseAllBtn.contains(event.target);

  const allTrashIcons = document.querySelectorAll(".trash-can");

  function selectThisTrash() {
    allTrashIcons.forEach((trashIcon) => {
      trashIcon.addEventListener("click", function () {
        selectedTrashIcon = trashIcon;
      });

      trashIcon.addEventListener("click", removeFigure);

      function removeFigure() {
        let element = trashIcon.closest(".miniFigure");
        const dataId = element.dataset.id;

        let allBigElements = gallery.querySelectorAll(".bigFigure");

        for (let oneBigElement of allBigElements) {
          const oneBigElementId = oneBigElement.dataset.id;

          if (oneBigElementId === dataId) {
            try {
              eraseWork(dataId).then(() => {
                eraseWork(oneBigElementId)
                  .then(() => {
                    element.remove();
                    oneBigElement.remove();
                  })
                  .catch((error) => {
                    console.error(
                      `Impossible de supprimer le travail avec l'ID ${oneBigElementId}: ${error}`
                    );
                  });
              });
            } catch (error) {
              console.error(`Erreur lors de la suppression : ${error}`);
            }
          }
        }
      }
    });
  }

  selectThisTrash();

  let imageContainer = document.querySelector(".image-display");

  if (
    !openModalBtn &&
    originalModal.classList.contains("active") &&
    !clickFirstModal
  ) {
    closeOriginalModal();
    closeModalBG();
    AllModalsStatus();
  } else if (
    !openSecModalBtn &&
    addWorkModal.classList.contains("active") &&
    !clickSecondModal
  ) {
    closeAddWorkModal();
    closeModalBG();
    AllModalsStatus();
  } else if (clickArrow) {
    closeAddWorkModal();
    openOriginalModal();
    AllModalsStatus();
  } else if (clickAddBtn) {
    try {
      const formData = new FormData(formModal2);
      const newContent = await postNewWork(formData);

      const img = formData.get("image");
      const title = formData.get("title");
      const category = formData.get("category");

      if (img.name === "") {
        errorInAddWorks("image");
      } else if (!title) {
        errorInAddWorks("title");
      } else if (!category) {
        errorInAddWorks("category");
      }

      gallery.innerHTML = "";
      miniGallery.innerHTML = "";

      const works = await getPreviousWork();
      let fragment = document.createDocumentFragment();
      fragment.appendChild(await worksGenerator(works));
      portfolio.appendChild(fragment);

      createMiniGallery();

      formModal2.reset();
      imageContainer.style.backgroundImage = "";
      imgBox.classList.remove("hidden");
      imageContainer.style.display = "none";
    } catch (error) {
      console.error(`Erreur lors de l'affichage des données: ${error}`);
    }
  } else if (clickEraseAllBtn) {
    try {
      eraseAllWorks();
    } catch (error) {
      console.error(`Erreur lors de l'effacement des données: ${error}`);
    }
  }
}

window.addEventListener("click", clickAway);

const miniGallery = document.querySelector(".miniGallery");

const arrow = document.querySelector(".arrow-icon");

async function createMiniGallery(works) {
  //  Pour pouvoir utiliser les travaux précédents téléchargés.
  works = await getPreviousWork();

  for (let i = 0; i < works.length; i++) {
    const miniFigure = document.createElement("figure");
    miniFigure.classList.add("miniFigure");
    miniFigure.setAttribute("data-id", works[i].id);

    //  Pour faire apparaître et disparaître l'icône
    //  "flèche multidirectionnelle" au passage de la
    //   souris sur chacune des miniFigures.
    miniFigure.addEventListener("mouseover", displayIcon);
    miniFigure.addEventListener("mouseout", hideIcon);

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

    //  icône "poubelle".
    const trashIcon = document.createElement("figcaption");
    trashIcon.innerHTML = `<i class="fa-solid fa-trash-can trash-can"></i>`;

    const miniImage = document.createElement("img");
    miniImage.classList.add("miniImg");
    miniImage.src = works[i].imageUrl;

    const miniFigcaption = document.createElement("figcaption");
    miniFigcaption.innerHTML = `<p>éditer</p>`;

    const iconDiv = document.createElement("div");
    iconDiv.classList.add("iconDiv");

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

const imgDisplay = document.querySelector(".image-display");

const showLoadedImg = (imageLoader, imageContainer) => {
  let uploadedPic;

  imageLoader.addEventListener("change", function () {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      uploadedPic = reader.result;
      imageContainer.style.backgroundImage = `url(${uploadedPic})`;
      imageContainer.style.display = "flex";
      imgBox.classList.add("hidden");
    });

    reader.readAsDataURL(imageLoader.files[0]);
  });
};

const imageLoader = document.querySelector("#add-pic-btn");
showLoadedImg(imageLoader, imgDisplay);

const formModal2 = document.querySelector("#form-modal-2");

async function addSelectForm() {
  const labelElement = document.querySelector('label[for="category"]');
  const selectElement = await createSelectForm();
  labelElement.insertAdjacentElement("afterend", selectElement);
}

addSelectForm();

async function createSelectForm() {
  const selectElement = document.getElementById("category");

  const emptyOption = document.createElement("option");
  emptyOption.setAttribute("value", "");
  emptyOption.setAttribute("label", " ");
  selectElement.appendChild(emptyOption);

  const categoriesData = await getCategories();

  for (let category of categoriesData) {
    const option = document.createElement("option");
    option.setAttribute("value", category.id);
    option.setAttribute("id", category.id);
    option.textContent = category.name;
    selectElement.appendChild(option);
  }

  return selectElement;
}

async function postNewWork(formData) {
  let errorContainer = document.querySelector(".error-container");

  if (errorContainer) {
    errorContainer.remove();
  }

  try {
    const response = await fetch(`${postWorkUrl}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      formModal2.reset();
    } else {
      closeAddWorkModal();
      openOriginalModal();
      return true;
    }
  } catch (error) {
    console.error(`Impossible d'ajouter le projet: ${error}`);
  }
}

function errorInAddWorks(type) {
  let errorText;

  let errorLocation = document.querySelector(
    ".error-container-for-missing-data-form"
  );

  switch (type) {
    case "image":
      errorText = "Merci de choisir une image.";
      break;
    case "title":
      errorText = "Merci de choisir un titre.";
      break;
    case "category":
      errorText = "Merci de choisir une catégorie.";
      break;
  }

  let errorMessageContainer = document.createElement("div");
  errorMessageContainer.setAttribute("class", "error-container");

  let message = document.createElement("p");
  message.setAttribute("class", "error-message");
  message.textContent = errorText;

  errorMessageContainer.append(message);

  errorLocation.appendChild(errorMessageContainer);
}
