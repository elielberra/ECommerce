const socket = io();

const banner = document.querySelector("#discount-banner");
const cartBadge = document.querySelector("#cart-badge");

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

function addToCart(productId) {
  socket.emit("addToCart", { cartId: 1, productId });
}

socket.on("productsInCart", (products) => {
  cartBadge.innerHTML = products.length;
});
;
