import { Router } from "express";
import { dottedRouteGenerator, suggestionGenerator } from "../controller/map.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("map");
});

router.post("/get-suggestions", suggestionGenerator);
router.post("/get-dotted-route", dottedRouteGenerator);


export default router;