const categorySelectedHandler = () => {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory === "all") {
    return;
  }
  let params = new URL(document.location).searchParams;
  const queryObject = JSON.stringify({ category: selectedCategory });
  const limitParamURL = params.get("limit") ? `&limit=${params.get("limit")}` : "";
  const pageParamURL = params.get("page") ? `&page=${params.get("page")}` : "";
  const queryParamURL = `&query=${queryObject}`;
  const sortParamURL = params.get("sort") ? `&sort=${params.get("sort")}` : "";
  window.location.href = `/?${limitParamURL}${pageParamURL}${queryParamURL}${sortParamURL}`;
};

const priceSelectedHandler = () => {
  const selectedPrice = priceFilter.value;
  if ([-1, 1].includes(selectedPrice)) {
    return;
  }
  let params = new URL(document.location).searchParams;
  const limitParamURL = params.get("limit") ? `&limit=${params.get("limit")}` : "";
  const pageParamURL = params.get("page") ? `&page=${params.get("page")}` : "";
  const queryParamURL = params.get("query") ? `&query=${params.get("query")}` : "";
  const sortParamURL = `&sort=${selectedPrice}`;
  console.debug("REDIRECT URL", `/?${limitParamURL}${pageParamURL}${queryParamURL}${sortParamURL}`);
  window.location.href = `/?${limitParamURL}${pageParamURL}${queryParamURL}${sortParamURL}`;
};

const categoryFilter = document.getElementById("category_filter");
categoryFilter.addEventListener("change", categorySelectedHandler);

const priceFilter = document.getElementById("price_filter");
priceFilter.addEventListener("change", priceSelectedHandler);
