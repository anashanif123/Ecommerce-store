import { auth,signInWithEmailAndPassword } from "../utils/utils.js";

const login_form = document.getElementById("login_form");

login_form.addEventListener("submit", function (e){
    e.preventDefault()
    console.log(e);
    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log(email);
    console.log(password);
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
  console.log("succesful");
    window.location.href = "/";

    // ...
  })
  .catch((error) => {

    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Unsuccesful");
    
});
})

console.log(auth);