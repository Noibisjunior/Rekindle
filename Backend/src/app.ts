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


app.use(
  cors({
    origin: (origin, cb) => {
      // allow Vite dev, LAN IP, localhost, any ngrok
      if (
        !origin ||
        origin.startsWith("http://localhost:3000") ||
        origin.startsWith("http://10.") ||            // any LAN IP 10.x.x.x
        origin.startsWith("http://192.") ||           // for 192.168.x.x networks
        /\.ngrok-free\.app$/.test(origin)             // any ngrok URL
      ) {
        cb(null, true);
      } else {
        cb(new Error(`CORS blocked: ${origin}`));
      }
    },
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
