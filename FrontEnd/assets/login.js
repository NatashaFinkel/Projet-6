const apiUrl = "http://localhost:5678/api/";
const logInUrl = apiUrl + "users/login";

let loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", submitForm);

async function submitForm(event) {
  //  preventDefault est une méthode qui
  //  stoppe l'action "par défaut" d'addEventListener.
  event.preventDefault();

  const loginFormData = new FormData(loginForm);
  const formDataContentAsAnObject = Object.fromEntries(loginFormData.entries());
  const formDataAsJSON = JSON.stringify(formDataContentAsAnObject);

  try {
    const response = await fetch(`${logInUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataAsJSON,
    });
    switch (true) {
      case response.ok:
        const responseBody = await response.json();
        console.log(responseBody);
        localStorage.setItem("token", responseBody.token);

        //  C'est pour renvoyer l'utilisateur sur la page d'accueil
        //  si l'identifiant et le password sont validés.
        document.location.href = "./index.html";

        console.log("Vous êtes sur l'interface Administrateur. Bienvenue !");

        break;
      case response.status == 401:
        errorInLogIn("password");
        break;
      case response.status == 404:
        errorInLogIn("email");
        break;
      default:
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return;
  } catch (error) {
    console.error(`Impossible de se connecter: ${error}`);
  }
}

//   let displayErrorMessage = document.querySelector(".errorMessage");

//   if (displayErrorMessage) {
//      form.removeChild(displayErrorMessage);
/*      let errorHere = document.querySelector(".errorContainer");
        if (errorHere) {
          loginForm.removeChild(errorHere);
        }
 */
//  Pour créer le conteneur du message d'erreur.
/*     const errorMessageContainer = document.createElement("div");
        errorMessageContainer.classList.add("errorContainer");
        let errorText = document.createTextNode(
          "Erreur dans l’identifiant ou le mot de passe."
        );
 */
/*         errorMessageContainer.appendChild(errorText);
        const connectUserInput = loginForm.querySelector('input[type="submit"]');
 */
//  Pour insérer la div (avec le message d'erreur) juste avant
//  le bouton de connection du formulaire.
/*         loginForm.insertBefore(errorMessageContainer, connectUserInput);
      } else {
        return response.json();
      }
    })
 */
//    .then((data) => {
//  Il faut stocker le token pour pouvoir réaliser les envois
//  et les suppressions des travaux.

//  On utilise localStorage pour que
//  les données soient conservées à la fermeture
//  de la page web (contrairement à sessionStorage qui les efface).

/*     localStorage.setItem("id", data.userId);
      localStorage.setItem("token", data.token); */

/* 
    .catch((error) => {
      console.error(`ERREUR : ${error}`);
    }); 
}); */

function errorInLogIn(type) {
  let errorLocation;
  let errorText;

  switch (type) {
    case "email":
      console.log("Erreur dans l'email !");
      errorLocation = document.querySelector(".email-location");
      errorText =
        "Cette adresse e-mail n'a pas été reconnue. Merci de saisir votre identifiant une nouvelle fois.";

      break;
    case "password":
      errorLocation = document.querySelector(".password-location");
      errorText =
        "Erreur dans la saisie : merci d'entrer votre mot de passe une nouvelle fois. ";

      break;
  }

  const errorMessage = document.querySelector(".error-message");

  if (errorMessage) {
    errorLocation.remove();
  }

  let errorMessageContainer = document.createElement("div");
  errorMessageContainer.setAttribute("class", "error-container");

  let message = document.createElement("p");
  message.setAttribute("class", "error-message");
  message.textContent = errorText;

  errorMessageContainer.append(message);

  errorLocation.appendChild(errorMessageContainer);
}

function isFormData(obj) {
  return obj instanceof FormData;
}
