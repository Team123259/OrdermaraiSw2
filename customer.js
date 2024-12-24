let products = [
    { id: 1, name: 'หมูสามชั้น', price: 10 },
    { id: 2, name: 'ไส้กรอก', price: 10 },
    { id: 3, name: 'เห็ด', price: 10 }
  ];
  let cart = [];
  let orderId = JSON.parse(localStorage.getItem('orderId')) || 1;
  
  function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
      const button = document.createElement('button');
      button.textContent = `${product.name} (฿${product.price})`;
      button.className = 'btn';
      button.onclick = () => addToCart(product);
      productList.appendChild(button);
    });
  }
  
  function addToCart(product) {
    cart.push(product);
    renderCart();
  }
  
  function renderCart() {
    const cartList = document.getElementById('cartList');
    const totalPrice = document.getElementById('totalPrice');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ฿${item.price}`;
      cartList.appendChild(li);
      total += item.price;
    });
    totalPrice.textContent = total;
  }
  
  document.getElementById('placeOrder').onclick = function () {
    const name = document.getElementById('customerName').value;
    if (!name || cart.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your name and select products.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    const order = {
      id: orderId++,
      name,
      shop: cart.map(item => item.name).join(', '),
      total: cart.reduce((sum, item) => sum + item.price, 0), // บันทึกราคารวม
      items: cart, // เก็บรายการสินค้า
      status: 'Pending',
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('orderId', orderId); // Save updated orderId
    
  
    // เคลียร์ข้อมูลหลังจากสั่งซื้อ
    cart = [];
    document.getElementById('customerName').value = '';  // Clear name field
    renderCart();  // Re-render cart
  
    // แสดง modal
    const modal = document.getElementById('orderModal');
    modal.style.display = 'block';
  };
  
  // อัปโหลดสลิปการโอนเงิน
  document.getElementById('uploadSlip').onclick = function () {
    const slipInput = document.getElementById('paymentSlip');
    const file = slipInput.files[0];
  
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'No file selected',
        text: 'Please select a slip image before uploading.',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    // อ่านไฟล์เป็น Base64 เพื่อจัดเก็บใน localStorage หรือส่งไปยังเซิร์ฟเวอร์
    const reader = new FileReader();
    reader.onload = function (e) {
      const slipData = e.target.result;
    
      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      const lastOrder = orders[orders.length - 1];
      if (lastOrder) {
        lastOrder.slip = slipData; // เพิ่มข้อมูล slip
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    
      Swal.fire({
        icon: 'success',
        title: 'Slip uploaded successfully!',
        confirmButtonText: 'OK'
      });
    
      // อัปเดต UI admin หลังอัปโหลด
      window.location.reload(); // รีเฟรชหน้า
    };
  
    reader.readAsDataURL(file);
  };
  
  // ปิด modal เมื่อคลิกปุ่มปิด
  document.querySelector('.close').onclick = function () {
    document.getElementById('orderModal').style.display = 'none';
  };
  function placeOrder() {
    const name = document.getElementById('customerName').value;
    const paymentSlipInput = document.getElementById('paymentSlip');
    
    if (!name || cart.length === 0 || !paymentSlipInput.files[0]) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all fields and upload a payment slip.',
        confirmButtonText: 'OK',
      });
      return;
    }
  
    const reader = new FileReader();
    reader.onload = function(event) {
      const slipURL = event.target.result; // Base64 ของสลิปที่อัปโหลด
  
      const order = {
        id: orderId++,
        name,
        shop: cart.map(item => item.name).join(', '),
        total: cart.reduce((sum, item) => sum + item.price, 0),
        items: cart,
        status: 'Pending',
        slip: slipURL, // เก็บ Base64 สลิป
      };
  
      let orders = JSON.parse(localStorage.getItem('orders')) || [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('orderId', orderId);
  
      Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        confirmButtonText: 'OK',
      }).then(() => {
        window.location.reload(); // รีเฟรชหลังบันทึกสำเร็จ
      });
    };
  
    // อ่านไฟล์ที่อัปโหลด
    reader.readAsDataURL(paymentSlipInput.files[0]);
  }
  // Initial Render
  renderProducts();
  