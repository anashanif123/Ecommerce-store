import {
  auth, signOut, onAuthStateChanged, doc, getDoc, db, getDocs, collection, updateDoc, arrayUnion, arrayRemove
} from "./auth/utils/utils.js";


const signout_btn = document.getElementById('signout_btn');
const login_link = document.getElementById('Login_link');
const user_photo = document.getElementById('user_photo');
const login_2link = document.getElementById('Login_2link');
const product_card = document.getElementById('product_card');
const addProduct_btn = document.getElementById("addProduct_btn")
const useremail = document.getElementById("useremail");


getAllProducts();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    useremail.innerText = auth.currentUser.email;
    user_photo.style.display = 'inline-block'; // Assuming user_photo is an <img> element
    login_link.style.display = 'none';
    login_2link.style.display = 'none'
    signout_btn.style.display = 'inline-block'
    getUserInfo(uid);
  } else {
    // login_link.style.display = 'inline-block'
    user_photo.style.display = 'none'; // Assuming user_photo is an <img> element
    login_2link.style.display = 'inline-block';
    // window.location.href = '/auth/login/index.html'

  }
});

addProduct_btn.addEventListener("click", (e) => {
  if (auth.currentUser) {


    window.location.href = "./add product/index.html"
  } else {
    window.location.href = "./auth/login/index.html"
  }
})

signout_btn.addEventListener("click", () => {
  signOut(auth);
  window.location.href = "/"
});

function getUserInfo(uid) {
  const userRef = doc(db, 'users', uid);

  getDoc(userRef).then((data) => {
    console.log("data....", data.id);
    console.log("data....", data.data());
    user_photo.src = data.data().img;
  })

};

async function getAllProducts() {

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    product_card.innerHTML = ""
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const products = doc.data();

      // d structring
      const { productImage, productPrice, productTitle, ProductDEscription, createdByEmail } = products

      const cards = `<div class="bg-white shadow-md rounded-lg overflow-hidden">
    <img src="${productImage}" alt="Product Image" class="w-full h-48 object-cover">
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-2">${productTitle}</h2>
        <p class="text-gray-600 mb-2">${ProductDEscription}</p>
        <p class="text-gray-600 mb-2">Created by: ${createdByEmail}</p>
        <p class="text-gray-600 mb-4">Price: ${productPrice}</p>
        
        <button id="${doc.id}" onclick="addTocart(this)" class="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            ${auth?.currentUser && products?.addTocart?.includes(auth?.currentUser.uid) ? "Added to Cart" : "Add to Cart"}
        </button>
    </div>
</div>
`;

      window.addTocart = addTocart;
      product_card.innerHTML += cards
      console.log(products);


    });
  } catch (error) {
    alert(error)
  }
};


// console.log(auth);

async function addTocart(e) {
  if (auth.currentUser) {
    e.disabled = true;
    const docRef = doc(db, "products", e.id);
    if (e.innerText == "Carted") {
      updateDoc(docRef, {
        addTocart: arrayRemove(auth.currentUser.uid)
      }).then(() => {
        e.innerText = "addToCart";
        e.disabled = false;
        updateCart(); // Update the cart page
      })
       .catch((err) => console.log(err));
    } else {
      updateDoc(docRef, {
        addTocart: arrayUnion(auth.currentUser.uid)
      }).then(() => {
        e.innerText = "Carted";
        e.disabled = false;
        updateCart(); // Update the cart page
      })
       .catch((err) => console.log(err));
    }
  } else {
    window.location.href = "./auth/login/index.html";
  }
}
