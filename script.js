// The cart stores every selected product and its current quantity.
const cart = [];

const cartItems = document.querySelector("#cart-items");
const cartTable = document.querySelector("#cart-table");
const emptyCartMessage = document.querySelector("#empty-cart-message");
const orderTotal = document.querySelector("#order-total");

function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
}

function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find((product) => product.id === productId);

    if (!item) {
        return;
    }

    item.quantity = Math.max(1, item.quantity + amount);
    renderCart();
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex((product) => product.id === productId);

    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        renderCart();
    }
}

function renderCart() {
    cartItems.innerHTML = "";

    cart.forEach((item) => {
        const itemSubtotal = item.price * item.quantity;
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-button" type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">&minus;</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-button" type="button" data-action="increase" data-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button>
                </div>
            </td>
            <td>${formatCurrency(itemSubtotal)}</td>
            <td><button class="remove-button" type="button" data-action="remove" data-id="${item.id}">Remove</button></td>
        `;

        cartItems.appendChild(row);
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    orderTotal.textContent = formatCurrency(total);
    emptyCartMessage.hidden = cart.length > 0;
    cartTable.hidden = cart.length === 0;
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        addToCart({
            id: button.dataset.id,
            name: button.dataset.name,
            price: Number(button.dataset.price)
        });
    });
});

cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    if (button.dataset.action === "increase") {
        changeQuantity(button.dataset.id, 1);
    } else if (button.dataset.action === "decrease") {
        changeQuantity(button.dataset.id, -1);
    } else if (button.dataset.action === "remove") {
        removeFromCart(button.dataset.id);
    }
});
