import { auth,signOut,onAuthStateChanged,doc,getDoc,db,getDocs, collection,query,where,
} from "../auth/utils/utils.js";


const signout_btn = document.getElementById('signout_btn');
const login_link = document.getElementById('Login_link');
const user_photo = document.getElementById('user_photo');
const login_2link = document.getElementById('Login_2link');
const product_card = document.getElementById('product_card');
const addProduct_btn = document.getElementById("addProduct_btn")
const useremail = document.getElementById("useremail");


getMyProducts();

onAuthStateChanged(auth, (user) => {
   if (user) {
     // User is signed in, see docs for a list of available properties
     // https://firebase.google.com/docs/reference/js/auth.user
     const uid = user.uid;
     
     useremail.innerText = auth.currentUser.email;
     user_photo.style.display = 'inline-block'; // Assuming user_photo is an <img> element
     login_link.style.display = 'none';
     login_2link.style.display= 'none'
     signout_btn.style.display = 'inline-block'
     getUserInfo(uid);
     getMyProducts(user.uid);
   } else {
     // login_link.style.display = 'inline-block'
     user_photo.style.display = 'none'; // Assuming user_photo is an <img> element
     login_2link.style.display = 'inline-block';
   // window.location.href = '/auth/login/index.html'
  
   }
 });

 addProduct_btn.addEventListener("click",(e)=>{
   if (auth.currentUser) {

     
    window.location.href = "../auth/login/index.html"
    
   } else {
     window.location.href = "../auth/login/index.html"
   }
 })

 signout_btn.addEventListener("click", () => {
   signOut(auth);
   window.location.href = "/"
 });

function getUserInfo(uid) {
 const userRef = doc(db, 'users', uid );

 getDoc(userRef).then((data)=>{
   console.log("data....",data.id);
   console.log("data....",data.data());
  user_photo.src = data.data().img;
 })

};

async function getMyProducts (uid){

 try {
    const q = query(collection(db, "products"), where("createdBY", "==", uid));
   const querySnapshot = await getDocs(q);
   product_card.innerHTML = ""
querySnapshot.forEach((doc) => {
 console.log(`${doc.id} => ${doc.data()}`);
const products = doc.data();

// d structring
const {productImage , productPrice, productTitle, ProductDEscription,createdByEmail} = products

const cards =  `<div class="bg-white shadow-md rounded-lg overflow-hidden">
<img
 src="${productImage}"
 alt="Event Image"
 class="w-full h-48 object-cover"
/>
<div class="p-4">
 <h2 class="text-xl  mb-2">title:${productTitle}</h2>
 <p class="text-gray-600 mb-2">description: ${ProductDEscription}</p>
 <p class="text-gray-600 mb-2"> createdby: ${createdByEmail}</p>
 <p class="text-gray-600 mb-2">price: ${productPrice}</p>
 <div class="flex justify-between items-center">
   
 </div>
</div>
</div>`

   product_card.innerHTML += cards
console.log(products);


});
 } catch (error) {
   alert(error)
 }
};


console.log(auth);