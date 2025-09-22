"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
const allowedOrigins = [
    "https://frontend-service-8sxa.onrender.com",
    "http://localhost:3000"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
//  API routes under /v1
app.use("/v1", routes_1.default);
// fallback error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "ServerError" });
});
exports.default = app;
