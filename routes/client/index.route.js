const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
  app.use("/checkout", checkoutRoutes);

  app.use("/user", userRoutes);

  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
}