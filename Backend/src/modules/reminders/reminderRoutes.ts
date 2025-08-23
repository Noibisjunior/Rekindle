import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as ctrl from "./reminderController";

const r = Router();
r.post("/reminders", requireAuth, ctrl.setReminder);
r.get("/reminders", requireAuth, ctrl.listReminders);
r.delete("/reminders/:id", requireAuth, ctrl.cancel);

export default r;
