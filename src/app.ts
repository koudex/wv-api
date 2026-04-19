import { Hono, Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import hiAnimeRoutes from './routes/routes';
import { AppError } from './utils/errors';
import { fail } from './utils/response';
import config from './config/config';

const app = new Hono();

// CORS Configuration - this works in Node.js
const origins = config.origin.includes(',')
  ? config.origin.split(',').map(o => o.trim())
  : config.origin === '*'
    ? '*'
    : [config.origin];

app.use('*', cors({
  origin: origins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}));

// Logger - this works in Node.js
if (!config.isProduction || config.enableLogging) {
  app.use('/api/v2/*', logger());
}

// Health check
app.get('/ping', (c: Context) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'netlify',
  });
});

app.get('/favicon.ico', (c: Context) => {
  return c.body(null, 204);
});

app.route('/api/v2', hiAnimeRoutes);

// Error handling
app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.message, err.statusCode, err.details);
  }
  console.error('Unexpected Error:', err.message);
  return fail(c, 'Internal server error', 500);
});

app.notFound((c: Context) => {
  return fail(c, 'Route not found', 404);
});

export default app;
