// ==============================
// LOAD CART FROM LOCAL STORAGE
// ==============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ==============================
// WAIT FOR PAGE TO LOAD
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------
    // PRODUCT PAGE LOGIC
    // ------------------------------
    const addToCartBtn = document.getElementById("add-to-cart");
    const sizeSelect = document.getElementById("size");
    const cartFeedback = document.getElementById("cart-feedback");

    if (addToCartBtn && sizeSelect) {
        addToCartBtn.addEventListener("click", () => {
            addProductToCart(addToCartBtn, sizeSelect, cartFeedback);
        });
    }

    // ------------------------------
    // CART PAGE LOGIC
    // ------------------------------
    if (document.getElementById("cart-items")) {
        renderCart();
    }

    // ------------------------------
    // BUY NOW (FAKE CHECKOUT)
    // ------------------------------
    const buyNowBtn = document.getElementById("buy-now");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", fakeCheckout);
    }
});

// ==============================
// ADD PRODUCT FROM PRODUCT PAGE
// ==============================
function addProductToCart(button, sizeSelect, feedbackEl) {
    const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    if (!selectedOption.value) {
        alert("Please select a size.");
        return;
    }

    const productName = button.dataset.product;
    const size = selectedOption.value;
    const priceText = selectedOption.text;
    const price = parseFloat(priceText.split("$")[1]);

    addItem(productName, size, price, feedbackEl);
}

// ==============================
// ADD ITEM TO CART ARRAY
// ==============================
function addItem(name, size, price, feedbackEl) {
    const existingItem = cart.find(item =>
        item.name === name && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, size, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Show inline feedback
    feedbackEl.classList.add("show");
    setTimeout(() => feedbackEl.classList.remove("show"), 1500);

    renderCart();
}

// ==============================
// RENDER CART
// ==============================
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='Mainp'>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-image-area">
                    <img src="./Imgs/Coffee1.webp" alt="${item.name}">
                    <div class="quantity-controls">
                        <button onclick="decrementQuantity(${index})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="incrementQuantity(${index})">+</button>
                    </div>
                </div>
                <div class="cart-item-details">
                    <p><strong>${item.name}</strong></p>
                    <p>Size: ${item.size}</p>
                    <p class="price"> Amount: ${item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
}

// ==============================
// CART ITEM QUANTITY CONTROLS
// ==============================
function incrementQuantity(index) {
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function decrementQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ==============================
// REMOVE ITEM
// ==============================
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ==============================
// FAKE CHECKOUT
// ==============================
function fakeCheckout() {
    document.getElementById("cart-items").style.display = "none";
    document.querySelector(".cart-summary").style.display = "none";
    document.getElementById("purchase-message").style.display = "block";
    localStorage.removeItem("cart");
    cart = [];
}
