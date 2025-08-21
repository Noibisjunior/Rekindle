import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as ctrl from "./qrController";

const r = Router();
r.get("/me/qr", requireAuth, ctrl.getMyQr);
export default r;


