import {  
  
    ref,
    storage,
    uploadBytes,
    getDownloadURL,
    db,
    collection,
    addDoc,
    auth, } from "../auth/utils/utils.js"

    const Product_form = document.getElementById('Product_form');

    Product_form.addEventListener('submit', (e) =>{
        e.preventDefault()
        console.log("thi is e",e);
        
        
        const productInfo = {
            productImage : e.target[0].files[0],
           ProductDEscription: e.target[1].value,
           productTitle : e.target[2].value,
           productPrice : e.target[3].value,
           createdBY : auth.currentUser.uid,
           createdByEmail: auth.currentUser.email,
           addTocart:[],
        };
        
        const imgRef = ref(storage , productInfo.productImage.name);
        
        uploadBytes(imgRef , productInfo.productImage).then(()=>{
            console.log("file Upload Done");
            
            getDownloadURL(imgRef).then((url)=>{
                console.log("url agaya", url);
                productInfo.productImage = url;
                
                
                
                const productCollection = collection(db, "products");
                addDoc(productCollection, productInfo).then((snapshot)=>{
                    console.log("Document added");
                    window.location.href = "/"
                });
            });
        });
    });
    
    