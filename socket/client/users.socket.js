const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports = (req, res) => {
  const userIdA = res.locals.user.id;

  _io.once('connection', (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIREND", async (userIdB) => {
      console.log(userIdA);
      console.log(userIdB);

      // Thêm id của A vào acceptFriends của B
      const existAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });

      if(!existAInB) {
        await User.updateOne({
          _id: userIdB
        }, {
          $push: { acceptFriends: userIdA }
        });
      }

      // Thêm id của B vào requestFriends của A
      const existBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      });

      if(!existBInA) {
        await User.updateOne({
          _id: userIdA
        }, {
          $push: { requestFriends: userIdB }
        });
         // Lấy độ dài acceptFriends của B trả về cho B
      const infoB = await User.findOne({
        _id: userIdB
      });
      const lengthAcceptFriends = infoB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriends
      });
       // Lấy thông tin của A để trả về cho B
       const infoUserA = await User.findOne({
        _id: userIdA
      }).select("fullName avatar");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userIdB: userIdB,
        infoUserA: infoUserA
      });
      }
       // Lấy độ dài acceptFriends của B trả về cho B
       const infoB = await User.findOne({
        _id: userIdB
      });
      const lengthAcceptFriends = infoB.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userIdB,
        lengthAcceptFriends: lengthAcceptFriends
      });
      
      // Lấy id của A để trả về cho B
      socket.broadcast.emit("SERVER_RETURN_CANCEL_FRIEND", {
        userIdB: userIdB,
        userIdA: userIdA
      });
    })

    // Khi A hủy gửi yêu cầu cho B
    socket.on("CLIENT_CANCEL_FRIREND", async (userIdB) => {
      console.log(userIdA);
      console.log(userIdB);

      // Xóa id của A trong acceptFriends của B
      await User.updateOne({
        _id: userIdB
      }, {
        $pull: { acceptFriends: userIdA }
      });

      // Xóa id của B trong requestFriends của A
      await User.updateOne({
        _id: userIdA
      }, {
        $pull: { requestFriends: userIdB }
      });
    })
    // Khi A từ chối kết bạn của B
    socket.on("CLIENT_REFUSE_FRIREND", async (userIdB) => {
        console.log(userIdA);
        console.log(userIdB);
  
        // Xóa id của B trong acceptFriends của A
        await User.updateOne({
          _id: userIdA
        }, {
          $pull: { acceptFriends: userIdB }
        });
  
        // Xóa id của A trong requestFriends của B
        await User.updateOne({
          _id: userIdB
        }, {
          $pull: { requestFriends: userIdA }
        });
      })
       // Khi A chấp nhận kết bạn của B
    socket.on("CLIENT_ACCEPT_FRIREND", async (userIdB) => {
        console.log(userIdA);
        console.log(userIdB);
        // Tạo mới một phòng chat cho A và B
      const roomChat = new RoomChat({
        typeRoom: "friend",
        users: [
          {
            user_id: userIdA,
            role: "superAdmin"
          },
          {
            user_id: userIdB,
            role: "superAdmin"
          }
        ],
      });

      await roomChat.save();
        // Thêm {user_id, room_chat_id} của B vào friendsList của A
        // Xóa id của B trong acceptFriends của A
        await User.updateOne({
          _id: userIdA
        }, {
          $push: {
            friendsList: {
              user_id: userIdB,
              room_chat_id: roomChat.id
            }
          },
          $pull: { acceptFriends: userIdB }
        });
  
        // Thêm {user_id, room_chat_id} của A vào friendsList của B
        // Xóa id của A trong requestFriends của B
        await User.updateOne({
          _id: userIdB
        }, {
          $push: {
            friendsList: {
              user_id: userIdA,
              room_chat_id: roomChat.id
            }
          },
          $pull: { requestFriends: userIdA }
        });
      })
  })
}