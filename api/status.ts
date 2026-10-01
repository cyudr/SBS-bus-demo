import type { IncomingMessage, ServerResponse } from 'http';
import { getLtaAccountKey } from './utils';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const key = getLtaAccountKey();
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    environment: 'vercel-serverless',
    hasApiKey: key.length > 0,
    keyMasked: key.length > 4 ? `${key.substring(0, 4)}...${key.substring(key.length - 2)}` : null,
    provider: 'LTA DataMall v2/v3',
    endpoints: [
      '/api/health',
      '/api/bus-arrivals',
      '/api/carpark-availability',
      '/api/traffic-incidents',
      '/api/train-alerts',
    ],
  }));
}
