import app from './app';
import { env } from './config/env';
import { connectRedis } from './config/redis';

const startServer = async () => {
  try {
    await connectRedis();
    
    app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
