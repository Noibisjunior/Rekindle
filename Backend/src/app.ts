import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import routes from "./routes";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "1mb" }));

const allowedOrigins = [
  "https://frontend-service-8sxa.onrender.com",
  "https://rekindle-kappa.vercel.app"
  "http://localhost:3000" 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

//  API routes under /v1
app.use("/v1", routes);

// fallback error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "ServerError" });
});

export default app;
