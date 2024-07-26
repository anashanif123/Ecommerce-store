import {
  auth, signOut, onAuthStateChanged, doc, getDoc, db, getDocs, collection, updateDoc, arrayUnion, arrayRemove, query, where
} from "../auth/utils/utils.js";

const signout_btn = document.getElementById('signout_btn');
const login_link = document.getElementById('Login_link');
const user_photo = document.getElementById('user_photo');
const login_2link = document.getElementById('Login_2link');
const product_card = document.getElementById('product_card');
const addProduct_btn = document.getElementById("addProduct_btn")
const useremail = document.getElementById("useremail");


const cartProductsContainer = document.getElementById("cart-products");

// Function to initialize the user interface based on authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    useremail.innerText = auth.currentUser.email;
    user_photo.style.display = 'inline-block';
    login_link.style.display = 'none';
    login_2link.style.display = 'none';
    signout_btn.style.display = 'inline-block';

    // Load user info and update cart
    getUserInfo(uid);
    updateCart();
  } else {
    user_photo.style.display = 'none';
    login_2link.style.display = 'inline-block';
    login_link.style.display = 'inline-block'; // Consider adding this line back for consistency
    signout_btn.style.display = 'none'; // Hide signout button if user is not authenticated
    cartProductsContainer.innerHTML = ''; // Clear cart products if user is not authenticated
  }
});

// Redirect to add product page if authenticated, else to login page
addProduct_btn.addEventListener("click", () => {
  if (auth.currentUser) {
    window.location.href = "./add product/index.html";
  } else {
    window.location.href = "./auth/login/index.html";
  }
});

// Sign out functionality
signout_btn.addEventListener("click", () => {
  signOut(auth);
  window.location.href = "/";
});

// Function to get user information from Firestore
function getUserInfo(uid) {
  const userRef = query(collection(db, 'users'), where('uid', '==', uid));
  
  getDocs(userRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
          
        firstName.textContent = userData.firstName; // Assuming firstName is an element
        useremail.textContent = userData.email;
        user_photo.src = userData.img; // Assuming img is an image element
      });
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// Function to add or remove a product to/from the cart
async function toggleCart(productId) {
  if (auth.currentUser) {
    const docRef = doc(db, "products", productId);
    const productDoc = await getDoc(docRef);
    const productData = productDoc.data();

    if (productData.addTocart && productData.addTocart.includes(auth.currentUser.uid)) {
      // Remove from cart
      await updateDoc(docRef, {
        addTocart: arrayRemove(auth.currentUser.uid)
      });
    } else {
      // Add to cart
      await updateDoc(docRef, {
        addTocart: arrayUnion(auth.currentUser.uid)
      });
    }

    updateCart(); // Update the cart UI
  } else {
    window.location.href = "./auth/login/index.html";
  }
}

// Function to update the cart UI based on the user's cart data
async function updateCart() {
  const cartProducts = [];
  const querySnapshot = await getDocs(collection(db, "products"));

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    if (product.addTocart && product.addTocart.includes(auth.currentUser.uid)) {
      cartProducts.push({ id: doc.id, ...product });
    }
  });

  const cartHtml = cartProducts.map((product) => {
    return `
     <div id="cart-products" class="bg-white shadow-md rounded-lg overflow-hidden">
<img
  src="${product.productImage}"
  alt="product Image"
  class="w-full h-48 object-cover"
/>
<div class="p-4">
  <h2 class="text-xl  mb-2">${product.productTitle}</h2>
  <p class="text-gray-600 mb-2">description: ${product.ProductDEscription}</p>
  <p class="text-gray-600 mb-2">price: ${product.productPrice}</p>
    <button class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600" onclick="removeFromCart('${product.id}')">Remove</button>
  </div>
</div>`;
  }).join("");

  cartProductsContainer.innerHTML = cartHtml;
}

// Function to remove a product from the cart
// Define removeFromCart function in the global scope or in a place accessible to HTML
async function removeFromCart(productId) {
  if (auth.currentUser) {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, {
      addTocart: arrayRemove(auth.currentUser.uid)
    });
    updateCart(); // Update the cart UI after removing
  } else {
    window.location.href = "./auth/login/index.html";
  }
}

// Update the updateCart function to correctly bind the removeFromCart function to the button onclick event


// Add event listener for the removeFromCart function after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Assuming cartProductsContainer is the ID of the element containing cart products
  cartProductsContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && event.target.getAttribute("onclick").startsWith("removeFromCart")) {
      eval(event.target.getAttribute("onclick"));
    }
  });
});

