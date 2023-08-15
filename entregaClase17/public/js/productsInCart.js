const socket = io();
function handleProductRemovedFromCart(cartId, productId) {
  const productToRemove = document.querySelector(`[product_id="${productId}"]`);
  productToRemove.remove();
  socket.emit("product-removed-from-cart", { cartId, productId });
}
const cartBadge = document.getElementById("cart_badge");
socket.on("update-cart-badge", (numProductsInCart) => {
  cartBadge.innerHTML = numProductsInCart;
});
