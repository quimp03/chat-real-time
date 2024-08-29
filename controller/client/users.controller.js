const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
     // SocketIO
  usersSocket(req, res);
  // End SocketIO
    const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $ne: userId }, // not equal
    status: "active",
    deleted: false,
  }).select("avatar fullName");
    res.render("client/pages/users/not-friend", {
      pageTitle: "Danh sách người dùng",
      users:users
    });
  };
  // [GET] /users/request
module.exports.request = async (req, res) => {
    // SocketIO
    usersSocket(req, res);
    // End SocketIO
  
    const requestFriends = res.locals.user.requestFriends;
  
    const users = await User.find({
      _id: {$in: requestFriends},
      status: "active",
      deleted: false,
    }).select("avatar fullName");
  
    res.render("client/pages/users/request", {
      pageTitle: "Lời mời đã gửi",
      users: users
    });
  };