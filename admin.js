let orders = JSON.parse(localStorage.getItem('orders')) || [];

function renderOrders() {
  const orderTable = document.getElementById('orderTable');
  orderTable.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.name}</td>
      <td>${order.shop}</td>
      <td>฿${order.total || 0}</td>
      <td>${order.status}</td>
      <td>
        ${order.slip 
          ? `<img src="${order.slip}" alt="Payment Slip" style="width: 100px; height: auto; cursor: pointer;" onclick="openModal('${order.slip}')">`
          : 'No Slip'}
      </td>
      <td>
        <button class="btn green" onclick="updateStatus(${order.id}, 'Completed')">Complete</button>
        <button class="btn red" onclick="updateStatus(${order.id}, 'Pending')">Pending</button>
      </td>
    `;
    orderTable.appendChild(row);
  });
}



function updateStatus(id, status) {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
  }
}

function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  modal.style.display = 'block';
  modalImage.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
}

function showNotification(order) {
  const container = document.getElementById('notification-container');

  const notification = document.createElement('div');
  notification.className = 'notification';

  notification.innerHTML = `
    <img src="${order.image}" alt="Product" />
    <div class="details">
      <p class="item-name">${order.name}</p>
      <p class="item-quantity">Quantity: ${order.quantity}</p>
    </div>
    <button class="button" onclick="handleNotificationClick(${order.id})">View</button>
  `;

  container.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 100000);

  // Play notification sound
  const audio = new Audio('notification.mp3'); // Add a path to your sound file
  audio.play();
}

function handleNotificationClick(orderId) {
  alert(`Viewing details for order #${orderId}`);
}

// Example usage
setTimeout(() => {
  showNotification({
    id: 1,
    image: 'meat.png',
    name: 'เนื้อวัว',
    quantity: 1
  });
}, 1000);


// Initial Render
renderOrders();
