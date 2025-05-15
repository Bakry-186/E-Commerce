const createFilterObj = ({ categoryParam = false, productParam = false }) => {
  return (req, res, next) => {
    const filterObject = {};

    if (categoryParam && req.params.categoryId) {
      filterObject["category"] = req.params.categoryId;
    }

    if (productParam && req.params.productId) {
      filterObject["product"] = req.params.productId;
    }

    req.filterObj = filterObject;
    next();
  };
};

export default createFilterObj;
