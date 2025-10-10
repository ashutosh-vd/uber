import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.middleware.js";
import { assignCaptain, assignCaptainForAcceptance, cancelRideCustomerSide, createRideController, getActiveRide, getAllRidesForCaptain } from "../controller/ride.controller.js";
import { protectedCaptainRoute } from "../middlewares/protectedCapatainRoute.middleware.js";

const router = Router();

router.get("/", protectedRoute, (req, res) => {
  res.json(req.user);
});

router.get("/get-active-ride", protectedRoute, getActiveRide);
router.post("/create-ride", protectedRoute,  createRideController);
router.post("/cancel-ride", protectedRoute,  cancelRideCustomerSide);

router.post("/accept-ride", protectedCaptainRoute,  assignCaptainForAcceptance);
router.post("/accept-ride-assign-captain", protectedCaptainRoute,  assignCaptain);
router.post("/cancel-ride-customer-side", protectedRoute,  cancelRideCustomerSide);
router.get("/get-all-rides-for-captain", protectedCaptainRoute,  getAllRidesForCaptain);

export default router;