import express, { Request, Response } from "express";
import { userController } from "../controllers/user.controller.js";
import auth from "../../../middleware/auth.js";
import { Role } from "../../../constants/constants.js";

const router = express.Router();

// get all users

router.get("/", auth(Role.admin), userController.getAllUsers);

// get user by id
router.get("/:userId", userController.getUserbyId);

// update user by id
router.put("/:userId", userController.updateUser);

// delete user by id
router.delete("/:userId", userController.deleteUser);



export const userRoutes = router;

