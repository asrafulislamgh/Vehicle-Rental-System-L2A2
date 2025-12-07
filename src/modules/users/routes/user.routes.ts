import express, { Request, Response } from "express";
import { userController } from "../controllers/user.controller.js";
import auth from "../../../middleware/auth.js";
import { Role } from "../../../constants/constants.js";

const router = express.Router();

// get all users

router.get("/", auth(Role.admin), userController.getAllUsers);

// get user by id
router.get("/:userId", auth(Role.admin), userController.getUserbyId);

// update user by id
router.put("/:userId", auth(Role.admin, Role.customer), userController.updateUser);

// delete user by id
router.delete("/:userId", auth(Role.admin), userController.deleteUser);



export const userRoutes = router;

