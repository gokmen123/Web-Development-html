function calculateProgress(orderDateStr, arriveDateStr) {
  const now = new Date();  
  const year = new Date().getFullYear();
  
  // Parse orderDateStr as an ISO string or local date format
  let orderDate;
  if (orderDateStr.includes("T")) {
    orderDate = new Date(orderDateStr);  // ISO format
  } else {
    orderDate = new Date(`${orderDateStr}, ${year}`); // If it's like "Monday, April 14"
  }
  
  // Handle arriveDateStr similarly
  const arriveDate = new Date(`${arriveDateStr}, ${year} 20:59:59`); 
  const totalTime = arriveDate - orderDate;
  const totalHours = totalTime / (1000 * 60 * 60);
  const elapsedTime = now - orderDate;
  let progressRatio = elapsedTime / totalTime;
  progressRatio = Math.min(1, Math.max(0, progressRatio)); 
  console.log("progress ratio",progressRatio)
  let progress = progressRatio * 100;
  if (progress < 5) progress = 5; // Çok küçük değerleri sıfırla
  
  let statusIndex = "";
  if (progressRatio < 0.33) {
    statusIndex = "Preparing";  
  } else if (progressRatio < 0.66) {
    statusIndex = "Shipped";  
  } else if (progressRatio >= 0.99) {
    statusIndex = "Delivered";  
  }

  return { progress, statusIndex };
}

function updateDisplay() {
  const item = JSON.parse(localStorage.getItem("package")) || "no item";
  const orderList = JSON.parse(localStorage.getItem("orderList")) || [];

  const matchingOrder = orderList.find(order =>
    order.todayOrders.some(product =>
      product.arriveDate === item.arriveDate
    )
  );

  const orderDateStr = matchingOrder?.createdAt || matchingOrder?.date; 
  console.log("orderDate", orderDateStr);
  
  const { progress, statusIndex } = calculateProgress(orderDateStr, item.arriveDate);

  console.log("Progress:", progress, "%");
  console.log("Status index:", statusIndex);
  
  const main = document.querySelector(".main");
  main.innerHTML = "";
  const orderTrack = document.createElement("div");
  orderTrack.classList.add("order-tracking");

  orderTrack.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      ${item.arriveDate}
    </div>

    <div class="product-info">
      ${item.name}
    </div>

    <div class="product-info">
      Quantity: ${item.quantity}
    </div>

    <img class="product-image" src="${item.image}">

    <div class="progress-labels-container">
      <div class="progress-label current-status">
         ${statusIndex}
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%"></div>
    </div>
  `;
  main.appendChild(orderTrack);
}

updateDisplay();
