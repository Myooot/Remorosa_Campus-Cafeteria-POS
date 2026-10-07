// The cart stores every selected product and its current quantity.
const cart = [];

const cartItems = document.querySelector("#cart-items");
const cartTable = document.querySelector("#cart-table");
const emptyCartMessage = document.querySelector("#empty-cart-message");
const orderTotal = document.querySelector("#order-total");
const paymentTotal = document.querySelector("#payment-total");
const cashPayment = document.querySelector("#cash-payment");
const confirmPaymentButton = document.querySelector("#confirm-payment");
const paymentMessage = document.querySelector("#payment-message");
const paymentSummary = document.querySelector("#payment-summary");
const summaryAmountPaid = document.querySelector("#summary-amount-paid");
const summaryTotalAmount = document.querySelector("#summary-total-amount");
const summaryChange = document.querySelector("#summary-change");

function formatCurrency(amount) {
    return `₱${amount.toFixed(2)}`;
}

function getOrderTotal() {
    return cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
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

    const total = getOrderTotal();

    orderTotal.textContent = formatCurrency(total);
    paymentTotal.textContent = formatCurrency(total);
    confirmPaymentButton.disabled = cart.length === 0;
    paymentMessage.textContent = "";
    paymentMessage.className = "payment-message";
    paymentSummary.hidden = true;
    emptyCartMessage.hidden = cart.length > 0;
    cartTable.hidden = cart.length === 0;
}

function confirmPayment() {
    const total = getOrderTotal();
    const cashAmount = Number(cashPayment.value);

    paymentMessage.className = "payment-message error";
    paymentSummary.hidden = true;

    if (total === 0) {
        paymentMessage.textContent = "Add at least one product before paying.";
    } else if (cashPayment.value === "" || !Number.isFinite(cashAmount) || cashAmount < 0) {
        paymentMessage.textContent = "Please enter a valid payment amount.";
    } else if (cashAmount < total) {
        paymentMessage.textContent = `Insufficient payment. Please enter at least ${formatCurrency(total)}.`;
    } else {
        const change = cashAmount - total;

        paymentMessage.className = "payment-message success";
        paymentMessage.textContent = "Payment confirmed.";
        summaryAmountPaid.textContent = formatCurrency(cashAmount);
        summaryTotalAmount.textContent = formatCurrency(total);
        summaryChange.textContent = formatCurrency(change);
        paymentSummary.hidden = false;
    }
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

confirmPaymentButton.addEventListener("click", confirmPayment);
