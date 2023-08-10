const { Router } = require("express");
const productManager = require("../../dao/managers/mongoDB/productManager");

const router = Router();
router.get("/", async (req, res) => {
  let { limit, page, query, sort } = req.query;
  for (queryParam of [limit, page]) {
    if (queryParam) {
      queryParamInt = parseInt(queryParam);
      if (!Number.isInteger(queryParamInt) || queryParamInt < 1) {
        res
          .status(400)
          .send(
            `The query parameter ${
              queryParam === limit ? "limit" : "page"
            } ${queryParam} is invalid.` + `It should be an integer number equal or higher than 1`
          );
        return;
      }
    }
  }
  if (query) {
    query = decodeURIComponent(query);
    try {
      query = JSON.parse(query);
    } catch (error) {
      res
        .status(400)
        .send(
          `The query parameter ${query} is invalid. It should be an object of shape: {"field": "value"}\n${error}`
        );
      return;
    }
    if (typeof query !== "object") {
      res
        .status(400)
        .send(
          `The query parameter query ${query} is invalid. It should be an object of shape: {"field": "value"}`
        );
      return;
    }
  }
  if (sort) {
    sortInt = parseInt(sort);
    if (!Number.isInteger(sortInt) || ![-1, 1].includes(sortInt)) {
      res
        .status(400)
        .send(`The query parameter sort ${sort} is invalid. It should be either 1 or -1`);
      return;
    }
  }
  const isAdminBoolean = req.user.role === "admin";
  const { docs: products, ...pageInfo } = await productManager.getPaginatedProducts(
    limit,
    page,
    query,
    sort
  );
  if (page > pageInfo.totalPages) {
    res.status(404).send(`The page ${page} does not exist`);
    return;
  }
  console.debug(pageInfo);
  const pageBaseURL = `http://localhost:${process.env.SERVER_PORT}/?`;
  const limitParamURL = limit ? `&limit=${limit}` : "";
  const queryParamURL = query ? `&query=${query}` : "";
  const sortParamURL = sort ? `&sort=${sort}` : "";
  pageInfo.prevLink = pageInfo.hasPrevPage
    ? `${pageBaseURL}${limitParamURL}&page=${pageInfo.prevPage}${queryParamURL}${sortParamURL}`
    : "";
  pageInfo.nextLink = pageInfo.hasNextPage
    ? `${pageBaseURL}${limitParamURL}&page=${pageInfo.nextPage}${queryParamURL}${sortParamURL}`
    : "";
  console.debug("products", products);
  const categories = await productManager.getCategories();
  res.render("home", {
    products,
    user: {
      ...req.user,
      isAdmin: isAdminBoolean
    },
    jsFilename: "home",
    styleFilename: "home",
    pageInfo,
    categories
  });
});

module.exports = router;
