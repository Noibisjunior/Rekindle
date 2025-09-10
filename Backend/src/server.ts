import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';



(async () => {
  const PORT = Number(env.PORT) || 4000;
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
    });
})();
