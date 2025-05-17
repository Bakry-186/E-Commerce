const createFilterObj = ({ categoryParam = false, productParam = false, userField = false }) => {
  return (req, res, next) => {
    const filterObject = {};

    if (categoryParam && req.params.categoryId) {
      filterObject["category"] = req.params.categoryId;
    }

    if (productParam && req.params.productId) {
      filterObject["product"] = req.params.productId;
    }

    if(userField && req.user.role === "customer") {
      filterObject["user"] = req.user._id
    }

    req.filterObj = filterObject;
    next();
  };
};

export default createFilterObj;
