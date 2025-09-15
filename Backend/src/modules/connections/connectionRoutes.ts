import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as ctrl from "./connectionController";

const r = Router();
r.post("/connect/:code", requireAuth, ctrl.connectWithCode);
r.post("/connections/:id/accept", requireAuth, ctrl.acceptConnection);
r.post("/connections/:id/reject", requireAuth, ctrl.rejectConnection);
r.get("/connections", requireAuth, ctrl.listConnections);
r.get("/connections/stats", requireAuth, ctrl.getStats);
r.get("/connections/:id", requireAuth, ctrl.getConnectionById)

export default r;

