const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", auth,userController.updateUser);
router.delete("/:id", auth,  userController.deleteUser);
router.post("/create-user",auth, userController.createUserByAdmin);
module.exports = router;
