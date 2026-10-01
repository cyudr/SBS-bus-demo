import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey } from './_utils';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const key = getLtaAccountKey();
  return res.status(200).json({
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
  });
}
