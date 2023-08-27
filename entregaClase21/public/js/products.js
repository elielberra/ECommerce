const params = new URL(document.location).searchParams;
const limit = params.get("limit");
const page = params.get("page");
const query = params.get("query");
const sort = params.get("sort");

if (query) {
  const queryObject = JSON.parse(params.get("query"));
  const categorySelector = document.getElementById("category_filter");
  categorySelector.value = queryObject.category;
}

if (sort) {
  const priceSelector = document.getElementById("price_filter");
  priceSelector.value = sort;
}

const categorySelectedHandler = () => {
  const params = new URL(document.location).searchParams;
  const limitParamURL = limit ? `&limit=${params.get("limit")}` : "";
  const pageParamURL = "&page=1";
  const selectedCategory = categoryFilter.value;
  const queryParamURL = selectedCategory
    ? `&query=${encodeURIComponent(`{"category":"${selectedCategory}"}`)}`
    : "";
  const sortParamURL = sort ? `&sort=${params.get("sort")}` : "";
  window.location.href = `/products/?${limitParamURL}${pageParamURL}${queryParamURL}${sortParamURL}`;
};

const priceSelectedHandler = () => {
  const selectedPrice = priceFilter.value;
  const params = new URL(document.location).searchParams;
  const limitParamURL = limit ? `&limit=${params.get("limit")}` : "";
  const pageParamURL = page ? `&page=${params.get("page")}` : "";
  const queryParamURL = query ? `&query=${params.get("query")}` : "";
  const sortParamURL = selectedPrice ? `&sort=${selectedPrice}` : "";
  window.location.href = `/products/?${limitParamURL}${pageParamURL}${queryParamURL}${sortParamURL}`;
};

const categoryFilter = document.getElementById("category_filter");
categoryFilter.addEventListener("change", categorySelectedHandler);

const priceFilter = document.getElementById("price_filter");
priceFilter.addEventListener("change", priceSelectedHandler);

const socket = io();
function handleProductAddedToCart(cartId, productId) {
  socket.emit("product-added-to-cart", { cartId, productId });
}
const cartBadge = document.getElementById("cart_badge");
socket.on("update-cart-badge", numProductsInCart => {
  cartBadge.innerHTML = numProductsInCart;
});
