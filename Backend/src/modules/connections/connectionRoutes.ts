import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as ctrl from "./connectionController";

const r = Router();
r.post("/connect/:code", requireAuth, ctrl.connectWithCode);
r.post("/connections/:id/accept", requireAuth, ctrl.acceptConnection);
r.get("/connections", requireAuth, ctrl.listConnections);
r.get("/connections/stats", requireAuth, ctrl.getStats);
export default r;