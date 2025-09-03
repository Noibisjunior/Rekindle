import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

(async () => {
  await connectDB();
  app.listen(Number(env.PORT), () => {
    console.log(`API running on http://localhost:${env.PORT}`);
    });
})();
