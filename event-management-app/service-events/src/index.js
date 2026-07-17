import { createApp } from './config/app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Events service running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Error starting events service:', error);
  process.exit(1);
});
