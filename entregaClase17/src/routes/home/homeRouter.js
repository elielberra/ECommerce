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
    console.debug("QUERY", query);
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
    console.debug("QUERY AFTER JSON PARSE", query);
    console.debug("QUERY TYPE", typeof query);
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
    console.debug("SORT before decode", sort)
    sort = decodeURIComponent(sort);
    console.debug("SORT after decode", sort)
    sort = parseInt(sort);
    if (!Number.isInteger(sort) || ![-1, 1].includes(sort)) {
      res
        .status(400)
        .send(
          `The query parameter sort ${sort} is invalid. It should be either 1 or -1`
        );
      return;
    }
  }
  const products = await productManager.getPaginatedProducts(limit, page, query, sort);
  const isAdminBoolean = req.user.role === "admin";
  res.render("home", {
    products,
    user: {
      ...req.user,
      isAdmin: isAdminBoolean
    },
    jsFilename: "home",
    styleFilename: "home"
  });
});

module.exports = router;
