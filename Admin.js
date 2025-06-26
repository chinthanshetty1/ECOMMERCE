const adminSchema = require("../Models/admin_schema");
const categorySchema = require("../Models/category_schema");
const productSchema = require("../Models/product_schema");
const customerSchema = require("../Models/customer_schema");
const OrderSchema = require("../Models/Order.js");
const PaymentSchema = require("../Models/Payment.js");
const ShippingSchema = require("../Models/Shipping.js");

const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const SECRETE_KEY = "PRODUCTS";

const Register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const profile = req.file?.filename;
    let checkEmail = await adminSchema.findOne({ email: email });
    if (checkEmail) {
      console.log("Email already exists!");
      res.json({ success: true, message: "Email already exists!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let newAdmin = await new adminSchema({
        name,
        phone,
        email,
        password: hashedPassword,
        profile,
      });
      let savedAdmin = await newAdmin.save();
      console.log("New admin registered successfully");
      res.json({
        success: true,
        message: "New admin registered successfully",
        teacher: savedAdmin,
      });
    }
  } catch (err) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await adminSchema.findOne({ email: email });
    if (!user) {
      console.log("Email not found!");
      res.json({ success: false, message: "Email or Password Invalid!" });
    } else {
      let checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        console.log("Invalid Password!");
        res.json({ success: false, message: "Email or Password Invalid!" });
      } else {
        let userId = user.id;
        let token = await jsonwebtoken.sign(userId, SECRETE_KEY);
        console.log("Login successful!");
        res.json({
          message: "Login successful!",
          success: true,
          loggedInUser: user,
          authToken: token,
        });
      }
    }
  } catch (err) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};

//category
const InsertCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const picture = req.file?.filename;
    const newCategory = new categorySchema({
      title,
      picture,
      status: "Active",
    });
    let savedCategory = await newCategory.save();
    console.log("Category info inserted successfully");
    res.json({
      success: true,
      message: "Insertion Successful",
      newCategory: savedCategory,
    });
  } catch (err) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};
const getAllCategories = async (req, res) => {
  try {
    let category = await categorySchema.find();
    console.log(category);
    res.json(category);
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const GetSingleCategory = async (req, res) => {
  try {
    let category = await categorySchema.find(req.params.id);
    console.log("Info fetched from the database");
    res.json({ category: category });
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const UpdateCategory = async (req, res) => {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      console.log("Category Not found");
      res.json("No Category found");
    } else {
      const { title, status } = req.body;
      const picture = req.file?.filename;
      let updatedCategory = {};
      if (title) {
        updatedCategory.title = title;
      }
      if (status) {
        updatedCategory.status = status;
      }
      if (picture) {
        updatedCategory.picture = picture;
      }
      category = await categorySchema.findByIdAndUpdate(
        req.params.id,
        { $set: updatedCategory },
        { new: true }
      );
      console.log("Category information updated successfully");
      res.json({
        success: true,
        message: "Category information updated successfully",
        updatedCategory: category,
      });
    }
  } catch (error) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};
const DeleteCategory = async (req, res) => {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      console.log("Category Not found");
      res.json("No Category found");
    } else {
      console.log(category);
      await categorySchema.findByIdAndDelete(req.params.id);
      console.log("Information deleted successfully");
      res.json({
        success: true,
        message: "Category info deleted successfully",
        deletedCategory: category,
      });
    }
  } catch (error) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};

//product
const Insertproduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category_id } = req.body;
    const picture = req.file?.filename;
    const newProduct = new productSchema({
      title,
      description,
      price,
      quantity,
      category_id,
      picture,
      status: "Active",
    });
    let savedProduct = await newProduct.save();
    console.log("Product info inserted successfully");
    res.json({
      success: true,
      message: "Insertion Successful",
      newProduct: savedProduct,
    });
  } catch (err) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};
const GetAllProducts = async (req, res) => {
  try {
    let product = await productSchema.find().populate("category_id");
    console.log(product);
    res.json(product);
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const GetSingleProduct = async (req, res) => {
  try {
    let product = await productSchema
      .findById(req.params.id)
      .populate("category_id");
    console.log("Info fetched from the database");
    res.json(product);
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const updateProduct = async (req, res) => {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      console.log("product Not found");
      res.json("No product found");
    } else {
      const { title, description, price, quantity, category_id, status } =
        req.body;
      const picture = req.file?.filename;
      let updatedProduct = {};
      if (title) {
        updatedProduct.title = title;
      }
      if (description) {
        updatedProduct.description = description;
      }
      if (price) {
        updatedProduct.price = price;
      }
      if (quantity) {
        updatedProduct.quantity = quantity;
      }
      if (category_id) {
        updatedProduct.category_id = category_id;
      }
      if (status) {
        updatedProduct.status = status;
      }
      if (picture) {
        updatedProduct.picture = picture;
      }
      product = await productSchema.findByIdAndUpdate(
        req.params.id,
        { $set: updatedProduct },
        { new: true }
      );
      console.log("Product information updated successfully");
      res.json({
        success: true,
        message: "Product information updated successfully",
        updatedProduct: product,
      });
    }
  } catch (error) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};
const DeleteProduct = async (req, res) => {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      console.log("Product Not found");
      res.json("No product found");
    } else {
      console.log(product);
      await productSchema.findByIdAndDelete(req.params.id);
      console.log("Information deleted successfully");
      res.json({
        success: true,
        message: "product info deleted successfully",
        deletedProduct: product,
      });
    }
  } catch (error) {
    console.log("Error occured" + err);
    res.status(400).json({ error: "Invalid Data" });
  }
};

const GetAllCustomers = async (req, res) => {
  try {
    let customers = await customerSchema.find();
    console.log(customers);
    res.json(customers);
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const GetOrder = async (req, res) => {
  try {
    const order = await OrderSchema.find()
      .populate("User_id")
      .populate("OrderDetails.product_id");
    const shipping = await ShippingSchema.find().populate("Order_id");
    const payment = await PaymentSchema.find().populate("Order_id");
    // .populate("OrderDetails.product_id");

    res.json({ order, shipping, payment, success: true });
  } catch (error) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};
const updateOrder = async (req, res) => {
  try {
    let orderUpdate = await OrderSchema.findById(req.params.id);
    if (!orderUpdate) {
      console.log("Order Not found");
    }
    const NewOrder = {};
    NewOrder.status = "Delivered";
    orderUpdate = await OrderSchema.findByIdAndUpdate(
      req.params.id,
      { $set: NewOrder },
      { new: true }
    );
    res.json({
      message: "Order status updated successfully",
      success: true,
      orderUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message });
  }
};
const updatePayment = async (req, res) => {
  try {
    let paymentUpdate = await PaymentSchema.findById(req.params.id);
    if (!paymentUpdate) {
      console.log("payment Not found");
    }
    const NewPayment = {};
    NewPayment.status = "Paid";
    paymentUpdate = await PaymentSchema.findByIdAndUpdate(
      req.params.id,
      { $set: NewPayment },
      { new: true }
    );
    res.json({
      message: "Payment status updated successfully",
      success: true,
      paymentUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateCashOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    let paymentUpdate = await PaymentSchema.findById(req.params.id);
    if (!paymentUpdate) {
      console.log("payment Not found");
    }
    const NewPayment = {};
    NewPayment.status = "Paid";
    paymentUpdate = await PaymentSchema.findByIdAndUpdate(
      req.params.id,
      { $set: NewPayment },
      { new: true }
    );
    console.log(orderId);
    let orderUpdate = await OrderSchema.findOne({ _id: orderId });
    if (!orderUpdate) {
      console.log("Order Not found");
    }
    const NewOrder = {};
    NewOrder.status = "Delivered";
    orderUpdate = await OrderSchema.findByIdAndUpdate(
      orderId,
      { $set: NewOrder },
      { new: true }
    );
    // console.log(orderUpdate, paymentUpdate);
    res.json({
      message: "Order and Payment status updated successfully",
      success: true,
      orderUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: err.message });
  }
};

module.exports = {
  Register,
  Login,
  InsertCategory,
  getAllCategories,
  GetSingleCategory,
  UpdateCategory,
  DeleteCategory,
  Insertproduct,
  GetAllProducts,
  GetSingleProduct,
  updateProduct,
  DeleteProduct,
  GetAllCustomers,
  GetOrder,
  updateOrder,
  updatePayment,
  updateCashOrder,
};
