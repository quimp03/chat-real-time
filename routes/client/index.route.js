const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);

  app.use("/chat", chatRoutes);
}