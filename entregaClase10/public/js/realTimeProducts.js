const socket = io();

const cartBadge = document.querySelector("#cart-badge");

// Socket signal emision for loading the number of products on the cart badge
socket.emit("loadInitialCartBadge", { cartId: 1 });

// Socket signal emission for when a new produc is added to the cart
function addToCart(productId) {
  socket.emit("addToCart", { cartId: 1, productId });
}

// Socket signal recieval for updating the number of products on the cart badge
socket.on("productsInCart", (products) => {
  cartBadge.innerHTML = products.length;
});

// When a product is added on the POST /api/products endpoint this socket id will be activated
socket.on("productAdded", (product) => {
  console.log("Adding a new prodct from the Web Socket");
  const parentElement = document.getElementById("products");
  const newProduct = document.createElement("div");
  let productKeywords = "";
  product.keywords.forEach(
    (keyword) =>
      (productKeywords += `<span class=\"uk-badge\">${keyword}</span>`)
  );
  newProduct.innerHTML = `<div id="product-${product.id}">
                                <div class="uk-card uk-card-default">
                                    <div class="uk-card-media-top">
                                        <img alt="Product picture"/>
                                    </div>
                                    <div class="uk-card-body">
                                        <h3 class="uk-card-title">${product.title}</h3>
                                        <h5>u$D ${product.price}</h5>
                                        ${productKeywords}
                                        <p>${product.description}</p>
                                        <button onclick="deleteProduct(this)" id="delete-product-${product.id}
                                        class="deletion-button">Delete Product</button>
                                    </div>
                                </div>
                            </div>`;
  // The UI will be updated and the new product will be inrserted on top of all the other product
  parentElement.prepend(newProduct);
  console.log("Deleting a new prodct from the Web Socket");
});

socket.on("productDeleted", (idToDelete) => {
  // Remove the element of the product that was deleted from the UI
  const productToDelete = document.getElementById(`product-${idToDelete}`);
  productToDelete.remove();
});

// Function that will create a product from the form and send it to the server
async function handleFormSubmission(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = parseFloat(document.getElementById("price").value);
  const status = document.getElementById("status").checked;
  const stock = parseInt(document.getElementById("stock").value);
  const category = document.getElementById("category").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const keywords = document
    .getElementById("keywords")
    .value.split(",")
    .map((keyword) => keyword.trim());
  const product = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
    keywords,
  };
  console.log("The new product is:", product);
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function that will trigger a product removal from the UI by its deletion on the server through a WebSocket
async function deleteProduct(button) {
  const idString = button.id;
  // Retrieve only the numberic characters of the button id string
  const idToDelete = parseInt(idString.replace(/\D+/g, ""), 10);
  try {
    const response = await fetch(`/api/products/${idToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}
