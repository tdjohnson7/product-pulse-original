const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Company = require("../models/Company");
const Customer = require("../models/Customer");
const Product = require("../models/Product")


module.exports = {
  getCustomerProfile: async (req, res) => {
    try {
      console.log("req.user", req.user)
      const posts = await Customer.find({ user: req.user.id });
     
      res.render("customerProfile.ejs", { products: [{title: "product1"}, {title: "product2"}, {title: "product3"}], companies: [{companyName: "company1"}, {companyName: "company2"}, {companyName: "company3"}], posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getCompanyProfile: async (req, res) => {
    try {
      const products = await Product.find({ companyId: req.user.id });
      console.log("getCompanyProfile see req.user.id", req.user.id)
     
      res.render("companyProfile.ejs", { products: products, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const companies = await Company.find()
      const posts = await Product.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user, companies: companies });
    } catch (err) {
      console.log(err);
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      const averageRating = await product.ratings.reduce((sum, rating) => sum + rating, 0) / product.ratings.length
      const comments = await Comment.find({product: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("product.ejs", { product: product, user: req.user, comments: comments, averageRating: averageRating });
    } catch (err) {
      console.log(err);
    }
  },
  createProduct: async (req, res) => {
    try {
      // console.log("product/createProduct req", req)
      console.log("product/createProduct req.body", req.body)
      console.log("product/createProduct req.file", req.file)
      console.log("product/createProduct req.user", req.user)
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Product.create({
        productTitle: req.body.productTitle,
        image: result ? result.secure_url : undefined,
        cloudinaryId: result ? result.public_id : undefined,
        productDescription: req.body.productDescription,
        productRating: 5,
        companyId: req.user.id,
      });
      console.log("Product has been added!");
      console.log('Products created', 
      'companyId', req.user.id)
      res.redirect("/companyProfile")
    } catch (err) {
      console.log(err);
    }
  },
  rateProduct: async (req, res) => {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { ratings: req.body.productRating}
        }
      );
      console.log("Rating Updated");
      res.redirect(`/product/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteProduct: async (req, res) => {
    try {
      // Find post by id
      let product = await Product.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(product.cloudinaryId);
      // Delete post from db
      await Product.remove({ _id: req.params.id });
      console.log("Deleted Product");
      res.redirect("/companyProfile");
    } catch (err) {
      res.redirect("/companyProfile");
    }
  },
  addComment: async (req, res) => {
    try {
      await Comment.create({
        product: req.params.id,
        comment: req.body.comment,
      });
      console.log("comment has been added!");
      res.redirect(`/product/` + req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
};
