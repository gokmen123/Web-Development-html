import {products} from "../data/products.js"
localStorage.setItem("products", JSON.stringify(products)); // products.js dosyasını localStorage'a ekle
//localStorage.clear()
const parsedProducts = JSON.parse(localStorage.getItem("products"));

const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");

//localStorage.removeItem("cardItems")
//localStorage.removeItem("storageNumber")
let storageNumber = Number(JSON.parse(localStorage.getItem("storageNumber")));
const updateCardCount = (count) => {
  document.querySelector(".cart-quantity").innerText = count;
}

if (isNaN(storageNumber)) {
  storageNumber = 0;
  localStorage.setItem("storageNumber", JSON.stringify(storageNumber));
  //updateCardCount(storageNumber)
}


document.querySelector(".cart-quantity").innerText = storageNumber;
const updateDisplay=(products)=>{
  const grid = document.querySelector(".products-grid");
  grid.innerHTML = ""; // Clear the grid before adding new products
  products.forEach(product => {
    const container = document.createElement("div");
    container.classList.add("product-container");
  
    container.innerHTML = `
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>
  
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>
  
      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${(product.rating.stars*10)}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>
  
      <div class="product-price">
        ${product.priceCents/100} $
      </div>
  
      <div class="product-quantity-container">
        <select>
          ${Array.from({length: 11}, (_, i) => `<option value="${i+1}">${i+1}</option>`).join("")}
        </select>
      </div>
  
      <div class="product-spacer"></div>
  
      <button onclick="addToCard(event)" class="add-to-cart-button button-primary">
        Add to Cart
      </button>
    `;
  
    grid.appendChild(container);
    let number=JSON.parse(localStorage.getItem("storageNumber"))
    console.log(number)
    updateCardCount(storageNumber)
  });
}
updateDisplay(parsedProducts)

function getProductId(productName){
  const product = parsedProducts.find(product => product.name === productName);
  return product ? product.id : null;
}


const search =(e)=>{
  const searchValue = e.target.value.toLowerCase();
  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchValue) || product.keywords.some(keyword => keyword.toLowerCase().includes(searchValue));
  });
  updateDisplay(filteredProducts);
}
window.search = search;


const addToCard=(e)=>{
  if(e.target.classList.contains("add-to-cart-button")){
    const productContainer = e.target.closest(".product-container");
    const productName = productContainer.querySelector(".product-name").innerText;
    const productPrice = parseFloat(productContainer.querySelector(".product-price").innerText.replace("$",""));
    const productQuantity = productContainer.querySelector("select").value;
    const productImage = productContainer.querySelector(".product-image").src;  // Get image src
    const relativePath = productImage.replace(window.location.origin, '');
    alert(`Added ${productQuantity} of ${productName} for ${productPrice}  to cart.`);
    
    
    if(cardItems.length>0 && getProductId(productName)!==null){
      
      const id = getProductId(productName);
      const item = cardItems.find((e) => e.id === id);
      console.log("not null")
      if (item) {
        console.log("item and productQuantity", item.quantity, productQuantity);
        item.quantity = Number(item.quantity) + Number(productQuantity);
        
        let storage = Number(localStorage.getItem("storageNumber"))
        storage = storage + Number(productQuantity); // sadece yeni eklenen kadar artır
        localStorage.setItem("storageNumber", storage);
        localStorage.setItem("cardItems", JSON.stringify(cardItems));
        updateCardCount(storage)
      }
      
      else{
        console.log("item not found")
        cardItems.push({
          name: productName,
          price: productPrice,
          quantity: productQuantity,
          image: relativePath, // Use relative path
          id:getProductId(productName)
        });
        let storage=localStorage.getItem("storageNumber")
        storage=Number(storage)+Number(productQuantity);
        localStorage.setItem("storageNumber",storage)
        console.log("length 0 or not found")
        updateCardCount(storage)
      }
      
      localStorage.setItem("cardItems", JSON.stringify(cardItems)); // cardItems'i localStorage'a ekle
      
    }
    else{
      cardItems.push({
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        image: relativePath, // Use relative path
        id:getProductId(productName)
      });
      let storage=localStorage.getItem("storageNumber")
      storage=Number(storage)+Number(productQuantity);
      localStorage.setItem("storageNumber",storage)
      console.log("length 0 or not found")
      updateCardCount(storage)
    }
    
    localStorage.setItem("cardItems", JSON.stringify(cardItems)); // cardItems'i localStorage'a ekle
  }
  
  
}
window.addToCard=addToCard;


export {cardItems,updateCardCount}
