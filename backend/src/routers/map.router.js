import { Router } from "express";
import { suggestionGenerator } from "../controller/map.controller.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("map");
});

router.post("/get-suggestions", suggestionGenerator);

export default router;