const socket = io();

socket.on("productAdded", (product) => {
  console.log("Adding a new prodct form the Web Socket");
  const parentElement = document.getElementById("products");
  const newProduct = document.createElement("div");
  let productKeywords = "";
  product.keywords.forEach(
    (keyword) => (productKeywords += `<span class=\"uk-badge\">${keyword}</span>`)
  );
  newProduct.innerHTML =    `<div>
                                <div class="uk-card uk-card-default">
                                    <div class="uk-card-media-top">
                                        <img alt="Product picture"/>
                                    </div>
                                    <div class="uk-card-body">
                                        <h3 class="uk-card-title">${
                                          product.title
                                        }</h3>
                                        <h5>u$D ${product.price}</h5>
                                        ${productKeywords}
                                        <p>${product.description}</p>
                                    </div>
                                </div>
                            </div>`;
  parentElement.prepend(newProduct);
});

async function handleFormSubmission(event) {
    event.preventDefault();  
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = parseFloat(document.getElementById('price').value);
    const status = document.getElementById('status').checked;
    const stock = parseInt(document.getElementById('stock').value);
    const category = document.getElementById('category').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const keywords = document.getElementById('keywords').value.split(',').map(keyword => keyword.trim());
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
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        const data = await response.json();
        console.log('Server response:', data);
      } catch (error) {
        console.error('Error:', error);
      }
  }