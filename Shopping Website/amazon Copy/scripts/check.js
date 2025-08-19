const cardItems = JSON.parse(localStorage.getItem("cardItems")) || [];
//localStorage.clear()

const calculateItemPrice = () => {
  let itemPrice = 0;
  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  cardItems.forEach(item => {
    const onePrice = parseFloat(item.price) * Number(item.quantity);
    itemPrice += onePrice;
  });
  return itemPrice;
};

function calculateShipping(price, id) {
  const deliveryDates = getDeliveryDates(); // buraya aldık
  let localShipmentArray = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");

  let deliveryDate = "";
  if (price === 0) deliveryDate = deliveryDates.free;
  else if (price === 4.99) deliveryDate = deliveryDates.standard;
  else if (price === 9.99) deliveryDate = deliveryDates.fast;

  if (localShipmentArray.length > 0) {
    const existing = localShipmentArray.find((item) => item.id == id);
    if (existing) {
      existing.price = price;
      existing.date = deliveryDate;
    } else {
      localShipmentArray.push({ id, price, date: deliveryDate });
    }
  } else {
    localShipmentArray.push({ id, price, date: deliveryDate });
  }
  console.log("localshipment",localShipmentArray)

  localStorage.setItem("localShipmentArray", JSON.stringify(localShipmentArray));
  totalCalculateShipping();
  updateDisplay();
}


function totalCalculateShipping() {
  const localShipmentArray = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");
  return localShipmentArray.reduce((sum, item) => {
    if (item.price !== null && !isNaN(item.price)) {
      return sum + item.price;
    }
    return sum;
  }, 0);
}

function deleteProduct(id, quantity) {
  const cardItems = JSON.parse(localStorage.getItem("cardItems"));
  const newCardItems = cardItems.filter(item => item.id !== id);
  localStorage.setItem("cardItems", JSON.stringify(newCardItems));

  const shippingItems = JSON.parse(localStorage.getItem("localShipmentArray")) || [];
  const newShippingItems = shippingItems.filter(item => item.id !== id);
  localStorage.setItem("localShipmentArray", JSON.stringify(newShippingItems));

  let storageNumber = JSON.parse(localStorage.getItem("storageNumber")) || 0;
  localStorage.setItem("storageNumber", JSON.stringify(storageNumber - quantity));

  updateDisplay();
}

let currentUpdateItemId = null;
let currentUpdateItemOldQuantity = null;

function updateProduct(element) {
  const item = JSON.parse(element.getAttribute('data-item'));
  currentUpdateItemId = item.id;
  currentUpdateItemOldQuantity = parseInt(item.quantity);

  const popup = document.getElementById('updatePopup');
  popup.style.display = 'flex';
  popup.querySelector(".update-popup-header").textContent = `Update ${item.name}`;
  popup.querySelector(".image-update").src = item.image;
  popup.querySelector(".product-name").textContent = item.name;
  popup.querySelector(".product-price").textContent = `$${item.price}`;

  const select = popup.querySelector("select");
  select.innerHTML = "";
  for (let i = 1; i <= 11; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    if (parseInt(item.quantity) === i) option.selected = true;
    select.appendChild(option);
  }
}

function getDeliveryDates() {
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };

  // Bugün, yarın, ve ertesi günün tarihlerini alıyoruz
  const dates = [1, 2, 3].map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return d.toLocaleDateString('en-US', options);
  });

  // Delivery tarihlerini doğru sırada eşleştir
  return { free: dates[2], standard: dates[1], fast: dates[0] }; 
}

let currentDeliveryDate = getDeliveryDates().free;

document.getElementById("save-update-button").addEventListener("click", () => {
  if (currentUpdateItemId === null) return;

  const selectedQuantity = parseInt(document.querySelector(".update-popup-quantity select").value);
  if (selectedQuantity === currentUpdateItemOldQuantity) {
    document.getElementById('updatePopup').style.display = 'none';
    currentUpdateItemId = null;
    currentUpdateItemOldQuantity = null;
    return;
  }

  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  const updatedItems = cardItems.map(item =>
    item.id === currentUpdateItemId ? { ...item, quantity: selectedQuantity } : item
  );

  let storageNumber = parseInt(localStorage.getItem("storageNumber") || "0");
  let newStorageNumber = storageNumber - currentUpdateItemOldQuantity + selectedQuantity;
  localStorage.setItem("storageNumber", JSON.stringify(newStorageNumber));
  localStorage.setItem("cardItems", JSON.stringify(updatedItems));

  document.getElementById('updatePopup').style.display = 'none';
  updateDisplay();

  currentUpdateItemId = null;
  currentUpdateItemOldQuantity = null;
});
function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function placeOrder() {
  document.querySelector(".product-approve-alert").style.display="none"
  const orderList = JSON.parse(localStorage.getItem("orderList")) || [];
  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  const localShipment = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");

  

  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const newToday = today.toLocaleDateString("en-US", options);
  const turkeyOffset = 3 * 60; 
  today.setMinutes(today.getMinutes() + today.getTimezoneOffset() + turkeyOffset);
  const createdAt = today.toISOString(); // tam zaman
  let todayOrder = orderList.find(order => order.date === newToday);

  if (!todayOrder) {
    todayOrder = {id:generateUUIDv4(), date: newToday, createdAt,todayOrders: [],totalPrice:0 };
    orderList.push(todayOrder);
    console.log("Yeni tarihli order eklendi");
  }

  cardItems.forEach((item) => {
    const shipment = localShipment.find(ship => ship.id === item.id);
    if (shipment) {
      const itemPrice = parseFloat(item.price);
      const quantity = Number(item.quantity);
      const shipmentPrice = shipment.price;

      const itemTotalPrice = (itemPrice * quantity) + shipmentPrice;

      const orderedItem = {
        name: item.name,
        quantity,
        arriveDate: shipment.date,
        image: item.image
      };

      const existingItem = todayOrder.todayOrders.find(order =>
        order.name === orderedItem.name &&
        order.image === orderedItem.image &&
        order.arriveDate === orderedItem.arriveDate
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        // NOT: shipmentPrice sadece bir kez eklenmeli. Aynı ürün eklenince tekrar eklemiyoruz.
        todayOrder.totalPrice += itemPrice * quantity;
      } else {
        todayOrder.todayOrders.push(orderedItem);
        todayOrder.totalPrice += itemTotalPrice;
      }

    } else {
      console.log("Kargo bilgisi eksik:", item);
    }
  });

  localStorage.setItem("orderList", JSON.stringify(orderList));
  localStorage.removeItem("cardItems");
  localStorage.removeItem("localShipmentArray");
  localStorage.removeItem("storageNumber")
  updateDisplay();
  console.log("Sipariş başarıyla eklendi:", orderList);
}
function orderApprove() {
  if (cardItems.length === 0) {
    alert("Shopping list is empty!");
    return;
  } 
  const box = document.querySelector(".product-approve-alert");
  box.style.display = "flex"; 
}




function updateDisplay() {
  const deliveryDates = getDeliveryDates();
  const orderSummary = document.querySelector(".order-summary");
  orderSummary.innerHTML = "";

  const cardItems = JSON.parse(localStorage.getItem("cardItems") || "[]");
  const shippingItems = JSON.parse(localStorage.getItem("localShipmentArray") || "[]");
  const storageNumber = localStorage.getItem("storageNumber") || "0";
  document.querySelector(".checkout-header-middle-section").textContent = storageNumber;
  


  const itemPrice = calculateItemPrice();
  const shippingPrice = totalCalculateShipping();
  const tax = (itemPrice + shippingPrice) * 0.1;
  const total = itemPrice + shippingPrice + tax;
  

  const summary = document.createElement("div");
  summary.classList.add("payment-summary");
  summary.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row"><div>Items (${storageNumber}):</div><div class="payment-summary-money">$${itemPrice.toFixed(2)}</div></div>
    <div class="payment-summary-row"><div>Shipping & handling:</div><div class="payment-summary-money">$${shippingPrice.toFixed(2)}</div></div>
    <div class="payment-summary-row subtotal-row"><div>Total before tax:</div><div class="payment-summary-money">$${(itemPrice + shippingPrice).toFixed(2)}</div></div>
    <div class="payment-summary-row"><div>Estimated tax (10%):</div><div class="payment-summary-money">$${tax.toFixed(2)}</div></div>
    <div class="payment-summary-row total-row"><div>Order total:</div><div class="payment-summary-money">$${total.toFixed(2)}</div></div>
    <button class="place-order-button button-primary" onclick="orderApprove()">Place your order</button>
  `;

  orderSummary.appendChild(summary);

  cardItems.forEach(item => {
    const selectedShipping = shippingItems.find((ship) => ship.id === item.id);
    const deliveryDateText = selectedShipping?.date || deliveryDates.free;
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item-container");
    cartItem.innerHTML = `
      <div class="delivery-date dynamic-delivery-date">Delivery date: ${deliveryDateText}</div>
      <div class="cart-item-details-grid">
        <img class="product-image" src="${item.image}" />
        <div class="cart-item-details">
          <div class="product-name">${item.name}</div>
          <div class="product-price">$${item.price}</div>
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label">${item.quantity}</span></span>
            <span onclick="updateProduct(this)" class="update-quantity-link link-primary" data-item='${JSON.stringify(item)}'>Update</span>
            <span onclick="deleteProduct('${item.id}','${item.quantity}')" class="delete-quantity-link link-primary">Delete</span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${[0, 4.99, 9.99].map((price, idx) => `
            <div class="delivery-option">
              <input type="radio" class="delivery-option-input" name="delivery-option-${item.id}" value="${price}" />
              <div>
                <div class="delivery-option-date">${Object.values(deliveryDates)[idx]}</div>
                <div class="delivery-option-price">${price === 0 ? 'FREE Shipping' : `$${price} - Shipping`}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    orderSummary.appendChild(cartItem);
    const radioButtons = cartItem.querySelectorAll('.delivery-option-input');
    

    radioButtons.forEach(radioButton => {
      if ((selectedShipping && parseFloat(radioButton.value) === selectedShipping.price) || !selectedShipping && parseFloat(radioButton.value) === 0) {
        radioButton.checked = true;
        radioButton.closest(".delivery-option").classList.add("selected");
        if (!selectedShipping) calculateShipping(0, item.id);
      }

      radioButton.addEventListener("change", event => {
        radioButtons.forEach(rb => rb.closest(".delivery-option").classList.remove("selected"));
        event.target.closest(".delivery-option").classList.add("selected");
        calculateShipping(parseFloat(event.target.value), item.id);
      });
    });
  });
}

updateDisplay();