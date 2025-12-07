import express, { Request, Response } from "express";
import { Role } from "../../../constants/constants.js";
import auth from "../../../middleware/auth.js";
import { vehiclesController } from "../controllers/vehicles.controllers.js";

const router = express.Router();

// create a new vehicle
router.post("/", auth(Role.admin), vehiclesController.createVehicle);

// get all vehicles

router.get("/", vehiclesController.getAllVehicles);

// get vehicle by id
router.get("/:vehicleId", vehiclesController.getVehicle);

// update vehicle by id
router.put("/:vehicleId", auth(Role.admin), vehiclesController.updateVehicle);

// delete vehicle by id
router.delete("/:vehicleId", auth(Role.admin), vehiclesController.deleteVehicle);



export const vehiclesRoutes = router;

