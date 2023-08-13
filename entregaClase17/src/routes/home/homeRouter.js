const { Router } = require("express");
const productManager = require("../../dao/managers/mongoDB/productManager");

const router = Router();
router.get("/", async (req, res) => {
  let { limit, page, query, sort } = req.query;
  for (const queryParam of [limit, page]) {
    if (queryParam) {
      const queryParamInt = parseInt(queryParam);
      if (!Number.isInteger(queryParamInt) || queryParamInt < 1) {
        res
          .status(400)
          .send(
            `The query parameter ${queryParam === limit ? "limit" : "page"} ${queryParam}` +
            ` is invalid. It should be an integer number equal or higher than 1`
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
          `The query parameter ${query} is invalid. It should be an object of shape: {"field": "value"}`
        );
      return;
    }
  }
  if (sort) {
    const sortInt = parseInt(sort);
    const sortingOptions = [-1, 1];
    if (!Number.isInteger(sortInt) || !sortingOptions.includes(sortInt)) {
      res
        .status(400)
        .send(`The query parameter sort ${sort} is invalid. It should be either 1 or -1`);
      return;
    }
  }
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
  const {
    limit: unusedLimit,
    totalDocs: unusedTotalDocs,
    pagingCounter: unusedPageCounter,
    ...reducedPageInfo
  } = pageInfo;
  const jsonResponse = {
    status: "success",
    payload: products,
    ...reducedPageInfo
  };
  res.status(200).send(jsonResponse);
});

module.exports = router;
