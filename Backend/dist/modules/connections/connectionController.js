"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWithCode = connectWithCode;
exports.acceptConnection = acceptConnection;
exports.listConnections = listConnections;
exports.getConnectionById = getConnectionById;
exports.getStats = getStats;
exports.rejectConnection = rejectConnection;
const userModel_1 = require("../users/userModel");
const connectionModel_1 = require("./connectionModel");
const dayjs_1 = __importDefault(require("dayjs"));
async function connectWithCode(req, res) {
    try {
        const me = req.user;
        const { code } = req.params;
        if (!code || typeof code !== "string") {
            return res.status(400).json({ error: "InvalidCode" });
        }
        const target = await userModel_1.User.findOne({ "qr.code": code });
        console.log("Looking up QR code:", code, "Found user:", target?._id);
        if (!target) {
            return res.status(404).json({ error: "UserNotFound" });
        }
        // Prevent connecting to self
        if (target._id.equals(me._id)) {
            return res
                .status(400)
                .json({ error: "You cannot connect to yourself" });
        }
        // Prevent duplicates (pending or accepted)
        const existing = await connectionModel_1.Connection.findOne({
            $or: [
                { aUserId: me._id, bUserId: target._id },
                { aUserId: target._id, bUserId: me._id },
            ],
        });
        if (existing) {
            return res
                .status(400)
                .json({ error: "Already connected or request pending" });
        }
        const conn = await connectionModel_1.Connection.create({
            aUserId: me._id,
            bUserId: target._id,
            status: "pending",
            createdAt: new Date(),
        });
        res.status(201).json({
            success: true,
            message: "Connection request sent",
            connectionId: conn._id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to connect" });
    }
}
async function acceptConnection(req, res) {
    const me = req.user;
    const { id } = req.params;
    const conn = await connectionModel_1.Connection.findById(id);
    if (!conn)
        return res.status(404).json({ error: "NotFound" });
    if (!conn.bUserId.equals(me._id))
        return res.status(403).json({ error: "NotAuthorized" });
    conn.status = "accepted";
    await conn.save();
    res.json(conn);
}
async function listConnections(req, res) {
    try {
        const me = req.user;
        // Fetch connections and sort newest first
        const conns = await connectionModel_1.Connection.find({
            $or: [{ aUserId: me._id }, { bUserId: me._id }],
        })
            .sort({ createdAt: -1 })
            .populate("aUserId", "profile.fullName profile.photoUrl profile.linkedin profile.tags")
            .populate("bUserId", "profile.fullName profile.photoUrl profile.linkedin profile.tags");
        const result = conns.map((c) => {
            const aUser = c.aUserId;
            const bUser = c.bUserId;
            const isSender = aUser._id.equals(me._id);
            const isReceiver = bUser._id.equals(me._id);
            const other = isSender ? bUser : aUser;
            return {
                _id: c._id.toString(),
                status: c.status,
                createdAt: c.createdAt,
                profile: {
                    id: other._id.toString(),
                    name: other.profile?.fullName || "Unnamed User",
                    photoUrl: other.profile?.photoUrl || "",
                    linkedin: other.profile?.linkedin || "",
                    tags: Array.isArray(other.profile?.tags) ? other.profile.tags : [],
                },
                aUserId: aUser._id.toString(),
                bUserId: bUser._id.toString(),
                isSender,
                isReceiver,
            };
        });
        res.json(result);
    }
    catch (err) {
        console.error("Error listing connections:", err);
        res.status(500).json({ error: "Failed to list connections" });
    }
}
async function getConnectionById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "MissingConnectionId" });
        }
        const connection = await connectionModel_1.Connection.findById(id)
            .populate("aUserId", "email profile")
            .populate("bUserId", "email profile");
        if (!connection) {
            return res.status(404).json({ error: "ConnectionNotFound" });
        }
        const userId = req.user?._id?.toString();
        if (userId &&
            connection.aUserId._id.toString() !== userId &&
            connection.bUserId._id.toString() !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        // Decide which user is the "other person" in this connection
        const isA = connection.aUserId._id.toString() === userId;
        const otherUser = isA ? connection.bUserId : connection.aUserId;
        const profile = {
            _id: otherUser._id,
            email: otherUser.email,
            name: otherUser.profile?.fullName,
            photoUrl: otherUser.profile?.photoUrl,
            linkedin: otherUser.profile?.linkedin,
            tags: otherUser.profile?.tags || [],
        };
        const response = {
            _id: connection._id,
            createdAt: connection.createdAt,
            status: connection.status,
            event: connection.event,
            profile,
        };
        return res.json(response);
    }
    catch (err) {
        console.error("Error fetching connection:", err);
        return res.status(500).json({ error: "ServerError" });
    }
}
async function getStats(req, res) {
    const me = req.user;
    const now = (0, dayjs_1.default)();
    const startOfWeek = now.startOf("week").toDate();
    const startOfMonth = now.startOf("month").toDate();
    // Total accepted connections
    const total = await connectionModel_1.Connection.countDocuments({
        $or: [{ aUserId: me._id }, { bUserId: me._id }],
        status: "accepted",
    });
    const thisWeek = await connectionModel_1.Connection.countDocuments({
        $or: [{ aUserId: me._id }, { bUserId: me._id }],
        status: "accepted",
        createdAt: { $gte: startOfWeek },
    });
    const thisMonth = await connectionModel_1.Connection.countDocuments({
        $or: [{ aUserId: me._id }, { bUserId: me._id }],
        status: "accepted",
        createdAt: { $gte: startOfMonth },
    });
    const pending = await connectionModel_1.Connection.countDocuments({
        bUserId: me._id,
        status: "pending",
    });
    res.json({ total, thisWeek, thisMonth, pending });
}
async function rejectConnection(req, res) {
    try {
        const me = req.user;
        const { id } = req.params;
        const conn = await connectionModel_1.Connection.findById(id);
        if (!conn)
            return res.status(404).json({ error: "Connection not found" });
        // Only involved users can reject
        if (!conn.aUserId.equals(me._id) &&
            !conn.bUserId.equals(me._id)) {
            return res.status(403).json({ error: "Not authorized" });
        }
        // Delete the connection (or mark rejected)
        await conn.deleteOne();
        return res.json({ success: true, message: "Connection rejected" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to reject connection" });
    }
}
