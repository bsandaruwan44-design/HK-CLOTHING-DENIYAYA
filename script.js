// Default Product Data
const initialProducts = [
    {
        id: 1,
        name: "Classic White Romper",
        price: 2450.00,
        image: "https://images.unsplash.com/photo-1522771935876-2497116a7a9e?auto=format&fit=crop&q=80&w=400",
        category: "Newborn",
        colors: ["White", "Pink", "Blue"]
    },
    {
        id: 2,
        name: "Cozy Knit Sweater Set",
        price: 4850.00,
        image: "https://images.unsplash.com/photo-1544126592-807daa2b56fd?auto=format&fit=crop&q=80&w=400",
        category: "Toddlers",
        colors: ["Pink", "White", "Beige"]
    },
    {
        id: 3,
        name: "Bear Ear Beanie",
        price: 1500.00,
        image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=400",
        category: "Accessories",
        colors: ["Blue", "Pink", "White"]
    },
    {
        id: 4,
        name: "Organic Cotton Onesie",
        price: 1950.00,
        image: "https://images.unsplash.com/photo-1515488404392-49a23cb39598?auto=format&fit=crop&q=80&w=400",
        category: "Newborn",
        colors: ["White", "Blue", "Pink"]
    },
    {
        id: 5,
        name: "Floral Summer Dress",
        price: 3200.00,
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=400",
        category: "Toddlers",
        colors: ["Pink", "White", "Yellow"]
    },
    {
        id: 6,
        name: "Soft Sole Booties",
        price: 1250.00,
        image: "https://images.unsplash.com/photo-1519457431-75514b723b69?auto=format&fit=crop&q=80&w=400",
        category: "Accessories",
        colors: ["Pink", "Blue", "White"]
    }
];

// Load products from localStorage or use defaults
let products = JSON.parse(localStorage.getItem('hk_products')) || initialProducts;

// DOM Elements
const productContainer = document.getElementById('product-container');
const header = document.getElementById('header');
const cartCountElement = document.getElementById('cart-count');
let cart = [];
let deliveryMethod = 'COD';

function setDeliveryMethod(method) {
    deliveryMethod = method;
    document.getElementById('delivery-cod').style.border = method === 'COD' ? '2px solid var(--primary)' : '1px solid #eee';
    document.getElementById('delivery-bank').style.border = method === 'BANK' ? '2px solid var(--primary)' : '1px solid #eee';
}

// Initialize Products
function renderProducts() {
    if (!productContainer) return;
    productContainer.innerHTML = products.map((product, index) => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <p style="color: var(--text-light); font-size: 0.8rem; margin-bottom: 5px;">${product.category}</p>
                <h3>${product.name}</h3>
                <p class="product-price">Rs. ${product.price ? Number(product.price).toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '0.00'}</p>
                
                <div style="margin: 10px 0;">
                    <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 5px;">Select Color:</label>
                    <div style="display: flex; gap: 8px;" id="color-options-${product.id}">
                        ${(product.colors || ["White", "Pink", "Blue"]).map((color, i) => `
                            <button onclick="selectColor(${product.id}, '${color}')" 
                                    id="btn-${product.id}-${color}"
                                    class="color-btn ${i === 0 ? 'active' : ''}"
                                    style="padding: 5px 12px; border-radius: 20px; border: 1px solid #ddd; background: white; font-size: 0.75rem; cursor: pointer; transition: 0.3s;">
                                ${color}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="add-to-cart" onclick="addToCartProxy(${index}, ${product.id})" style="flex: 1; margin-top: 0;">Add to Cart</button>
                    <button onclick="orderViaWhatsApp('${product.name}', ${product.price}, ${product.id})" style="padding: 12px; background: #25D366; color: white; border: none; border-radius: 10px; cursor: pointer; transition: var(--transition);">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

const selectedColors = {};

function selectColor(prodId, color) {
    selectedColors[prodId] = color;
    // UI update
    const container = document.getElementById(`color-options-${prodId}`);
    container.querySelectorAll('.color-btn').forEach(btn => {
        btn.style.background = 'white';
        btn.style.borderColor = '#ddd';
        btn.style.color = 'var(--text-dark)';
    });
    const activeBtn = document.getElementById(`btn-${prodId}-${color}`);
    activeBtn.style.background = 'var(--primary)';
    activeBtn.style.borderColor = 'var(--primary)';
    activeBtn.style.color = 'white';
}

function addToCartProxy(index, prodId) {
    const color = selectedColors[prodId] || products[index].colors?.[0] || "White";
    addToCart(index, color);
}

// WhatsApp Functionality (Direct)
function orderViaWhatsApp(name, price, prodId) {
    const color = selectedColors[prodId] || "Default";
    const phoneNumber = "94727244022";
    const message = `Hello HK CLOTHING! I would like to order:
Product: ${name}
Color: ${color}
Price: Rs. ${price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}

Is this available?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Cart Management
function addToCart(index, color) {
    const product = { ...products[index], selectedColor: color };
    cart.push(product);
    updateCartUI();

    // Feedback animation on the basket icon
    cartCountElement.style.transform = 'scale(1.5)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    renderCart();
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    const deliveryInput = document.getElementById('input-delivery-charge');
    const discountInput = document.getElementById('input-discount');

    let subtotal = 0;

    if (!container || !totalElement) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #aaa; margin-top: 50px;">Your cart is empty.</p>';
        totalElement.innerText = 'Rs. 0.00';
        return;
    }

    container.innerHTML = cart.map((item, index) => {
        subtotal += item.price;
        return `
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; background: #f9f9f9; padding: 10px; border-radius: 15px;">
                <img src="${item.image}" width="60" height="60" style="object-fit: cover; border-radius: 10px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 0.9rem;">${item.name}</h4>
                    <p style="font-size: 0.75rem; color: #888;">Color: ${item.selectedColor}</p>
                    <p style="color: var(--primary-dark); font-weight: 700;">Rs. ${Number(item.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</p>
                </div>
                <button onclick="removeFromCart(${index})" style="border: none; background: none; color: #ff7675; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');

    const deliveryCharge = parseFloat(deliveryInput?.value) || 0;
    const discount = parseFloat(discountInput?.value) || 0;
    const finalTotal = subtotal + deliveryCharge - discount;

    totalElement.innerText = `Rs. ${finalTotal.toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;

    // Add event listeners to refresh UI on change, if they don't already exist
    if (deliveryInput && !deliveryInput.dataset.listenerAdded) {
        deliveryInput.addEventListener('input', renderCart);
        deliveryInput.dataset.listenerAdded = 'true';
    }
    if (discountInput && !discountInput.dataset.listenerAdded) {
        discountInput.addEventListener('input', renderCart);
        discountInput.dataset.listenerAdded = 'true';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkoutViaWhatsApp() {
    if (cart.length === 0) return alert('Your cart is empty!');

    const deliveryCharge = parseFloat(document.getElementById('input-delivery-charge').value) || 0;
    const discount = parseFloat(document.getElementById('input-discount').value) || 0;

    const phoneNumber = "94727244022";
    let message = `*HK CLOTHING - NEW ORDER*\n----------------------\n`;
    let subtotal = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.selectedColor}) - Rs. ${Number(item.price).toLocaleString()}\n`;
        subtotal += item.price;
    });

    const finalTotal = subtotal + deliveryCharge - discount;

    message += `\nSubtotal: Rs. ${subtotal.toLocaleString()}`;
    message += `\nDelivery: Rs. ${deliveryCharge.toLocaleString()}`;
    if (discount > 0) message += `\nDiscount: - Rs. ${discount.toLocaleString()}`;
    message += `\n*Final Total: Rs. ${finalTotal.toLocaleString()}*`;
    message += `\n*Delivery: ${deliveryMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}*`;
    message += "\n\nඔබ ලැබූ ලාභය - ස්තූතියි!";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function processCheckout() {
    if (cart.length === 0) return alert('Please add items to your cart first.');
    generateInvoice();
}

function generateInvoice() {
    const invoiceId = 'HK' + Date.now().toString().slice(-6);
    const date = new Date().toLocaleDateString();

    const deliveryCharge = parseFloat(document.getElementById('input-delivery-charge').value) || 0;
    const discount = parseFloat(document.getElementById('input-discount').value) || 0;

    document.getElementById('invoice-id').innerText = invoiceId;
    document.getElementById('invoice-date').innerText = date;
    document.getElementById('invoice-delivery-type').innerText = `Delivery: ${deliveryMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}`;

    const itemsTbody = document.getElementById('invoice-items');
    let subtotal = 0;

    itemsTbody.innerHTML = cart.map(item => {
        subtotal += item.price;
        return `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.name} (${item.selectedColor})</td>
                <td style="padding: 10px; text-align: center;">1</td>
                <td style="padding: 10px; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
            </tr>
        `;
    }).join('');

    const finalTotal = subtotal + deliveryCharge - discount;

    document.getElementById('inv-subtotal').innerText = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('inv-delivery').innerText = `Rs. ${deliveryCharge.toLocaleString()}`;
    document.getElementById('inv-discount').innerText = `- Rs. ${discount.toLocaleString()}`;
    document.getElementById('invoice-total').innerText = `Rs. ${finalTotal.toLocaleString()}`;

    toggleInvoiceModal();
}

function toggleInvoiceModal() {
    const modal = document.getElementById('invoice-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Admin Management Functions
function saveProducts() {
    localStorage.setItem('hk_products', JSON.stringify(products));
    renderProducts();
    renderAdminTable();
}

const ADMIN_PASSWORD = "HK_ADMIN_2024";

function toggleAdminModal() {
    if (document.getElementById('admin-modal').style.display !== 'flex') {
        const password = prompt("Please enter Admin Password to access Management Mode:");
        if (password !== ADMIN_PASSWORD) {
            alert("Incorrect password! Access denied.");
            return;
        }
    }

    const modal = document.getElementById('admin-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
    if (modal.style.display === 'flex') renderAdminTable();
}

function renderAdminTable() {
    const tableBody = document.getElementById('admin-product-list');
    if (!tableBody) return;
    tableBody.innerHTML = products.map((p, index) => `
        <tr>
            <td><img src="${p.image}" width="40" height="40" style="object-fit: cover; border-radius: 5px;"></td>
            <td>${p.name}</td>
            <td>Rs. ${Number(p.price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
            <td>${p.category}</td>
            <td>
                <button onclick="editProduct(${index})" style="padding: 5px 10px; background: #6c5ce7; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-edit"></i></button>
                <button onclick="deleteProduct(${index})" style="padding: 5px 10px; background: #ff7675; color: white; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const fileInput = document.getElementById('prod-image-file');

    const finalizeSave = (imageData) => {
        const newProduct = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('prod-name').value,
            price: parseFloat(document.getElementById('prod-price').value),
            category: document.getElementById('prod-category').value,
            colors: document.getElementById('prod-colors').value.split(',').map(c => c.trim()).filter(c => c !== ""),
            image: imageData || document.getElementById('prod-image-url').value || 'https://via.placeholder.com/400'
        };

        if (id) {
            const index = products.findIndex(p => p.id === parseInt(id));
            products[index] = newProduct;
        } else {
            products.push(newProduct);
        }

        saveProducts();
        e.target.reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('form-title').innerText = 'Add New Product';
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => finalizeSave(event.target.result);
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        finalizeSave();
    }
}

function editProduct(index) {
    const p = products[index];
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-colors').value = (p.colors || []).join(', ');
    document.getElementById('prod-image-url').value = p.image.startsWith('data:') ? '' : p.image;
    document.getElementById('edit-id').value = p.id;
    document.getElementById('form-title').innerText = 'Edit Product';

    // Smooth scroll to form
    document.getElementById('admin-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        products.splice(index, 1);
        saveProducts();
    }
}

// Header Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Submissions
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerText = 'Message Sent! Thank You';
        btn.style.background = '#88d8b0';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = 'var(--primary)';
            btn.disabled = false;
            e.target.reset();
        }, 3000);
    }, 1500);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    document.getElementById('admin-form')?.addEventListener('submit', handleProductSubmit);

    // Listen for delivery/discount changes in cart
    document.getElementById('input-delivery-charge')?.addEventListener('input', renderCart);
    document.getElementById('input-discount')?.addEventListener('input', renderCart);
});
