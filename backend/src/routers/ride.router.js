import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.middleware.js";
import { assignCaptain, cancelRideCustomerSide, createRideController, getAllRidesForCaptain } from "../controller/ride.controller.js";
import { protectedCaptainRoute } from "../middlewares/protectedCapatainRoute.middleware.js";

const router = Router();

router.get("/", protectedRoute, (req, res) => {
  res.json(req.user);
});

router.post("/create-ride", protectedRoute,  createRideController);
router.post("/accept-ride-assign-captain", protectedCaptainRoute,  assignCaptain);
router.post("/cancel-ride-customer-side", protectedCaptainRoute,  cancelRideCustomerSide);
router.get("/get-all-rides-for-captain", protectedCaptainRoute,  getAllRidesForCaptain);

export default router;