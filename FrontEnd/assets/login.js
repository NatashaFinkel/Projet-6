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

function errorInLogIn(type) {
  let errorLocation;
  let errorText;

  switch (type) {
    case "email":
      errorLocation = document.querySelector(".email-location");
      errorText =
        "Cette adresse e-mail n'a pas été reconnue. Merci de saisir votre identifiant une nouvelle fois.";

      break;
    case "password":
      errorLocation = document.querySelector(".password-location");
      errorText =
        "Erreur dans la saisie. Merci d'entrer votre mot de passe une nouvelle fois.";

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
