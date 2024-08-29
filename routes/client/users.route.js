const express = require("express");
const router = express.Router();

router.get("/request", controller.request);
const controller = require("../../controllers/client/users.controller");

router.get("/not-friend", controller.notFriend);

module.exports = router;