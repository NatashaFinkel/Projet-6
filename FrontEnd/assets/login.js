const apiUrl = "http://localhost:5678/api/";

let form = document.querySelector("form");
let emailData = document.querySelector("#email");
let passwordData = document.querySelector("#password");

//  Pour envoyer les données quand on clique.
form.addEventListener("submit", (event) => {
  //  preventDefault est une méthode qui
  //  stoppe l'action addEventListener.
  event.preventDefault();

  const user = {
    email: emailData.value,
    password: passwordData.value,
  };

  //  fetch(`${apiUrl}/users/login`, {
  fetch(apiUrl + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },

    //  Il faut convertir les objets (qui sont en JSON)
    //  en chaînes (strings) afin de pouvoir les envoyer à un serveur.
    body: JSON.stringify(user),
  })
    .then((response) => {
      //  Le  !  indique l'opposé de la valeur donnée.
      // (la ligne suivante veut dire : "Si la réponse est incorrecte, alors...").
      if (!response.ok) {
        //   let displayErrorMessage = document.querySelector(".errorMessage");

        //   if (displayErrorMessage) {
        //      form.removeChild(displayErrorMessage);
        let errorHere = document.querySelector(".errorContainer");
        if (errorHere) {
          form.removeChild(errorHere);
        }

        //  Pour créer le conteneur du message d'erreur.
        const errorMessageContainer = document.createElement("div");
        errorMessageContainer.classList.add("errorContainer");
        let errorText = document.createTextNode(
          "Erreur dans l’identifiant ou le mot de passe."
        );

        errorMessageContainer.appendChild(errorText);
        const connectUserInput = form.querySelector('input[type="submit"]');

        //  Pour insérer la div (avec le message d'erreur) juste avant
        //  le bouton de connection du formulaire.
        form.insertBefore(errorMessageContainer, connectUserInput);
      } else {
        return response.json();
      }
    })

    .then((data) => {
      //  Il faut stocker le token pour pouvoir réaliser les envois
      //  et les suppressions des travaux.

      //  On utilise localStorage pour que
      //  les données soient conservées à la fermeture
      //  de la page web (contrairement à sessionStorage qui les efface).

      localStorage.setItem("id", data.userId);
      localStorage.setItem("token", data.token);

      //  C'est pour renvoyer l'utilisateur sur la page d'accueil
      //  si l'identifiant et le password sont validés.
      document.location.href = "./index.html";
    })

    .catch((error) => {
      console.error(`ERREUR : ${error}`);
    });
});
