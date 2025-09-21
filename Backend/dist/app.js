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
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        // allow Vite dev, LAN IP, localhost, any ngrok
        if (!origin ||
            origin.startsWith("http://localhost:3000") ||
            origin.startsWith("http://10.") || // any LAN IP 10.x.x.x
            origin.startsWith("http://192.") || // for 192.168.x.x networks
            /\.ngrok-free\.app$/.test(origin) // any ngrok URL
        ) {
            cb(null, true);
        }
        else {
            cb(new Error(`CORS blocked: ${origin}`));
        }
    },
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
