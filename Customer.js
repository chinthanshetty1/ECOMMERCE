const jwt = require("jsonwebtoken");
const SECRETE_KEY = "PRODUCTS";

const fetchCustomer = (req, res, next) => {
  const token = req.header("auth-token");
  console.log(token);
  if (!token) {
    res.send("token not found");
  }
  try {
    const data = jwt.verify(token, SECRETE_KEY);
    // console.log(data,'data')
    // console.log(token,'token')
    req.customer = data;
    next();
  } catch (err) {
    console.log(err);
  }
};
module.exports = fetchCustomer;
