

const cardItems = JSON.parse(localStorage.getItem("cardItems")) || [];
//localStorage.clear()

const calculateItemPrice = () => {
  let itemPrice = 0;
  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  if (cardItems.length > 0) {
    cardItems.forEach(item => {
      let onePrice = parseFloat(item.price).toFixed(2) * Number(item.quantity);
      itemPrice = itemPrice + onePrice;
    });
  }
  return itemPrice;
};

/* const calculateQuantity = () => {
  let quantity = 0;
  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  if (cardItems.length > 0) {
    cardItems.forEach((item) => {
      
      quantity = quantity + Number(item.quantity);
    });
  }
  return quantity;
}; */


function calculateShipping(price, id) {
  let localShipmentArray = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");
  console.log("price and id",price,id)
  //localStorage.removeItem("localShipmentArray")
  if (localShipmentArray.length > 0 && localShipmentArray!==null) {
    const isExist = localShipmentArray.find((item) => item.id == id);
    if (isExist) {
      isExist.price = price;
      localStorage.setItem("localShipmentArray", JSON.stringify(localShipmentArray));
      totalCalculateShipping();
      console.log("exist price changed");
    } else {
      if(price !==null && id!==null){
        localShipmentArray.push({ price: price, id: id });
      localStorage.setItem("localShipmentArray", JSON.stringify(localShipmentArray));
      console.log("not exist and length >0");
      totalCalculateShipping();
      
      }
      
    }
  } else {
    console.log("Not exist");
    localShipmentArray.push({ price: price, id: id });
    localStorage.setItem("localShipmentArray", JSON.stringify(localShipmentArray));
    totalCalculateShipping();
  }
  updateDisplay()
} 

function totalCalculateShipping() {
  let localShipmentArray = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");
  let totalShipping = 0;
  //localStorage.removeItem("localShipmentArray")

  if (localShipmentArray.length > 0) {
    localShipmentArray.forEach((item) => {
      // Check if price is a valid number
      if (item.price !== null && item.price !== undefined && !isNaN(item.price)) {
        totalShipping += item.price;
      } else {
        console.log("Invalid price:", item.price);  // Log invalid price
      }
    });
  } else {
    console.log("Array is empty");
  }

  console.log("totalPrice", totalShipping);
  return totalShipping;
}
function deleteProduct(id,quantity){
  //console.log("item quantity",quantity)
  //console.log("type of quantity",typeof(quantity))
  //console.log("id",id)
  let cardItems= JSON.parse(localStorage.getItem("cardItems"))
  //console.log("cardItems",cardItems)
  let newCardItems=cardItems.filter((item)=>item.id !== id)
  //console.log("after update card",newCardItems)
  localStorage.setItem("cardItems",JSON.stringify(newCardItems))
  let shippingItems=JSON.parse(localStorage.getItem("localShipmentArray"))
  //console.log("shipping Itesm",shippingItems)
  let storageNumber= JSON.parse(localStorage.getItem("storageNumber"))
  let newStorageNumber= storageNumber-quantity;
  localStorage.setItem("storageNumber",JSON.stringify(newStorageNumber))
 
  //console.log("storageNumber",storageNumber)
  if(shippingItems!==null){
    let newShippingItems=shippingItems.filter((item)=>item.id !==id)
    //console.log("after update shipping",newShippingItems)
    localStorage.setItem("localShipmentArray",JSON.stringify(newShippingItems))
  }
  calculateItemPrice()
  updateDisplay()
}


function updateDisplay() {
  const orderSummary = document.querySelector(".order-summary");
  orderSummary.innerHTML=""
  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  const shippingItems = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");
  let storageNumber=localStorage.getItem("storageNumber")
  document.querySelector(".checkout-header-middle-section").innerHTML=`${storageNumber}`
  const itemPrice = calculateItemPrice();
  const shippingPrice = totalCalculateShipping();

  const summary = document.createElement("div");
  summary.classList.add("payment-summary");
  summary.innerHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items (${storageNumber}):</div>
      <div class="payment-summary-money">$${parseFloat(itemPrice).toFixed(2)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${parseFloat(shippingPrice).toFixed(2)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${parseFloat(itemPrice+shippingPrice).toFixed(2)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${parseFloat((itemPrice+shippingPrice)*0.1).toFixed(2)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${parseFloat((itemPrice+shippingPrice)+((itemPrice+shippingPrice)*0.1)).toFixed(2)}</div>
    </div>
    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  orderSummary.appendChild(summary);

  // Loop through each cart item in the array
  for (const item of cardItems) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item-container");

    cartItem.innerHTML = `
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${item.image}" />
        <div class="cart-item-details">
          <div class="product-name">${item.name}</div>
          <div class="product-price">$${item.price}</div>
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label">${item.quantity}</span></span>
            <span  class="update-quantity-link link-primary">Update</span>
            <span onclick="deleteProduct('${item.id}','${item.quantity}')" class="delete-quantity-link link-primary">Delete</span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="delivery-option-${item.id}" value="0" />
            <div>
              <div class="delivery-option-date">Tuesday, June 21</div>
              <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input" name="delivery-option-${item.id}" value="4.99" />
            <div>
              <div class="delivery-option-date">Wednesday, June 15</div>
              <div class="delivery-option-price">$4.99 - Shipping</div>
            </div>
          </div>
          <div  class="delivery-option">
            <input type="radio" class="delivery-option-input" name="delivery-option-${item.id}" value="9.99" />
            <div>
              <div class="delivery-option-date">Monday, June 13</div>
              <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
        </div>
      </div>
    `;

    
    orderSummary.appendChild(cartItem); 
    const radioButtons = cartItem.querySelectorAll('.delivery-option-input');
    radioButtons.forEach(radioButton => {
      radioButton.addEventListener("change", (event) => {
        console.log("Radio changed!"); // Bu kontrolü yaparak çalışıp çalışmadığını görebilirsiniz
        console.log("Selected value:", event.target.value);  // Değeri kontrol et
        const price = parseFloat(event.target.value);
        const id = item.id;
        calculateShipping(price, id); // Shipping fiyatını hesapla
      });
    });
    

 
      

  }
}

// Initial display update
updateDisplay();

