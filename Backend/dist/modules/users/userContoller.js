"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
const userModel_1 = require("./userModel");
async function getMe(req, res) {
    const user = await userModel_1.User.findById(req.user._id);
    if (!user)
        return res.status(404).json({ error: "NotFound" });
    res.json({ user });
}
