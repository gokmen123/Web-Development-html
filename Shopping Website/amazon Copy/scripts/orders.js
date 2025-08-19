

function updateDisplay() {
  const storageNumber = JSON.parse(localStorage.getItem("storageNumber")) || "0";
  const orderList = JSON.parse(localStorage.getItem("orderList") || "[]");
  orderList.sort((a, b) => {
    const currentYear = new Date().getFullYear(); // 📅 Güncel yılı al
    const dateA = new Date(`${a.date}, ${currentYear}`);
    const dateB = new Date(`${b.date}, ${currentYear}`);
    return dateB - dateA;
  });
  
  console.log("orderList",orderList),

  
  document.querySelector(".cart-quantity").innerHTML = `${storageNumber}`;
  const main = document.querySelector(".main");
  const orderGrid = document.querySelector(".orders-grid");

  
  if (orderList.length === 0) {
    main.innerHTML = "";
    console.log("orderList empty");
    const newElement = document.createElement("div");
    newElement.classList.add("new-main");
    newElement.innerHTML = `<h1>No order added yet!</h1>`;
    main.appendChild(newElement);
  } else {
    orderGrid.innerHTML = ""; // Clear the previous content
    orderList.forEach((item) => {
      const orderContainer = document.createElement("div");
      orderContainer.classList.add("order-container");

      const orderHeader = document.createElement("div");
      orderHeader.classList.add("order-header");
      orderHeader.innerHTML = `
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${item.date}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${(item.totalPrice).toFixed(2)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${item.id}</div>
        </div>
      `;
      orderContainer.appendChild(orderHeader);

      item.todayOrders.forEach((orderItem) => {
        const orderDetails = document.createElement("div");
        orderDetails.classList.add("order-details-grid");
        orderDetails.innerHTML = `
          <div class="product-image-container">
            <img src="${orderItem.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${orderItem.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${orderItem.arriveDate}
            </div>
            <div class="product-quantity">
              Quantity: ${orderItem.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <a class="navigator" href="./amazon.html"><span class="buy-again-message">Buy it again</span></a>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
        const trackButton = orderDetails.querySelector('.track-package-button');
        trackButton.addEventListener('click', () => {
          localStorage.setItem("package",JSON.stringify(orderItem));
          
        });
        orderContainer.appendChild(orderDetails);
      });

      // Add the completed orderContainer to the orderGrid
      orderGrid.appendChild(orderContainer);
    });
  }
}

updateDisplay();
