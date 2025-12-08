import express from "express";
import auth from "../../../middleware/auth.js";
import { Role } from "../../../constants/constants.js";
import { bookingsController } from "../controllers/bookings.controllers.js";

const router = express.Router();

// create a new booking
router.post("/", auth(Role.admin, Role.customer), bookingsController.createBooking);

// get all bookings

router.get("/", auth(Role.admin), bookingsController.getAllBookings);

// get booking by id
router.get("/:bookingId", auth(Role.admin), bookingsController.getBooking);

// update booking by id
router.put("/:bookingId", auth(Role.admin, Role.customer), bookingsController.updateBooking);

// delete booking by id
router.delete("/:bookingId", auth(Role.admin), bookingsController.deleteBooking);



export const bookingsRoutes = router;

