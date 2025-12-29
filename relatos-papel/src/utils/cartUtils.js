export function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(book) {
    const cart = getCart();
    const existing = cart.find((it) => it.id === book.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...book, qty: 1 });
    }

    saveCart(cart);
    window.dispatchEvent(new Event("cartUpdated"));
}

export function saveTotals({ subtotal, discount = 0, shipping, taxes, total }) {
    const safeTotals = {
        subtotal: Number(subtotal) || 0,
        discount: Number(discount) || 0,
        shipping: Number(shipping) || 0,
        taxes: Number(taxes) || 0,
        total: Number(total) || 0,
    };

    localStorage.setItem("checkoutTotals", JSON.stringify(safeTotals));
    window.dispatchEvent(new Event("cartTotalsUpdated")); // evento para refrescar Checkout
}

export function getTotals() {
    try {
        const raw = localStorage.getItem("checkoutTotals");
        if (!raw) {
            return { subtotal: 0, discount: 0, shipping: 0, taxes: 0, total: 0 };
        }
        const parsed = JSON.parse(raw);
        return {
            subtotal: Number(parsed.subtotal) || 0,
            discount: Number(parsed.discount) || 0,
            shipping: Number(parsed.shipping) || 0,
            taxes: Number(parsed.taxes) || 0,
            total: Number(parsed.total) || 0,
        };
    } catch {
        return { subtotal: 0, discount: 0, shipping: 0, taxes: 0, total: 0 };
    }
}