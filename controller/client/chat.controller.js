const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket");
// [GET] /chat/
module.exports.index = async (req, res) => {
  chatSocket(req, res);
};