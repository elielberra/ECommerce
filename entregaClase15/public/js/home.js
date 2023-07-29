const socket = io();

const banner = document.querySelector("#discount-banner");
const cartBadge = document.querySelector("#cart-badge");

// Socket signal emision for loading the number of products on the cart badge
socket.emit("loadInitialCartBadge", { cartId: 1 })

// Socket signal emission for when a new produc is added to the cart
function addToCart(productId) {
  socket.emit("addToCart", { cartId: 1, productId });
}

// Socket signal recieval for updating the number of products on the cart badge
socket.on("productsInCart", (products) => {
  cartBadge.innerHTML = products.length;
});

// Socket signal recieval for updating the product on promotion
socket.on("promo", ({ title, sale }) => {
  const titleEl = banner.querySelector("#title");
  const saleEl = banner.querySelector("#sale");
  titleEl.innerHTML = title;
  saleEl.innerHTML = `${sale}%`;
  banner.style.visibility = "visible";
  banner.style.display = "block";
});

function refreshPromo() {
  socket.emit("promo", null);
}
