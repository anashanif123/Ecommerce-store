import {
    auth,
    createUserWithEmailAndPassword,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    db,
    setDoc,
    doc,
} from "../utils/utils.js"

const signup_Form = document.getElementById('signup_form');
const signup_btn = document.getElementById('signup_btn');

signup_Form.addEventListener("submit", function (e) {
    signup_btn.disabled = true;
    signup_btn.innerText = "Loading...";
    e.preventDefault();
    console.log(e);
    console.log(e.target);
    const img = e.target[0].files[0];
    const email = e.target[1].value;
    const password = e.target[2].value;
    const firstName = e.target[3].value;
    const LastName = e.target[4].value;
    const Company = e.target[5].value;
    

    console.log(email);
    console.log(password);
    console.log(img);
    console.log(firstName);
    console.log(LastName);
    console.log(Company);
    const userInfo = {
        img,
        email,
        password,
        firstName,
        LastName,
        Company,
    }



    createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {

            console.log(user);
            const userRef = ref(storage, `user/${user.user.uid}`)
            console.log("succesful");
            console.log(userInfo);
            uploadBytes(userRef, img).then((snapshot) => {

                console.log('Uploaded a blob or file!');
                getDownloadURL(userRef)
                    .then((url) => {
                        console.log("url is here", url);

                        userInfo.img = url;

                        const userDbRef = doc(db, "users", user.user.uid);

                        setDoc(userDbRef, userInfo).then(() => {
                            console.log("user ki info gaye");
                            window.location.href = "/"
                            signup_btn.disabled = false;
                            signup_btn.innerText = "Submit";
                        });
                    })

                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        signup_btn.disabled = false;
                        signup_btn.innerText = "Submit";
                        console.log("Unsuccesful");

                    });
            })

                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    signup_btn.disabled = false;
                    signup_btn.innerText = "Submit";
                    console.log("Unsuccesful");

                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Unsuccesful");
            signup_btn.disabled = false;
            signup_btn.innerText = "Submit";

        });



});



