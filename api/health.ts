import type { IncomingMessage, ServerResponse } from 'http';
import { getLtaAccountKey } from './utils';

export default async function handler(req: IncomingMessage & { query?: Record<string, string> }, res: ServerResponse & { json?: (data: unknown) => void; status?: (code: number) => any }) {
  const accountKey = getLtaAccountKey();
  const hasKey = accountKey.length > 0;

  let ltaConnected = false;
  let ltaStatusMessage = hasKey
    ? 'Testing LTA DataMall connection...'
    : 'LTA_ACCOUNT_KEY not configured in Vercel environment (serving simulated telemetry)';

  if (hasKey) {
    try {
      const testRes = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
        {
          headers: {
            'AccountKey': accountKey,
            'accept': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        }
      );

      if (testRes.ok) {
        ltaConnected = true;
        ltaStatusMessage = 'Connected to LTA DataMall (HTTP 200 OK)';
      } else {
        ltaStatusMessage = `LTA DataMall responded with HTTP ${testRes.status}`;
      }
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      ltaStatusMessage = `Connection check error: ${err}`;
    }
  }

  const payload = {
    status: 'ok',
    healthy: true,
    environment: 'vercel-serverless',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: hasKey,
    ltaDataMallConnected: ltaConnected,
    ltaStatusMessage,
    headerRequired: 'AccountKey: <LTA_ACCOUNT_KEY>',
    endpoints: {
      busArrivalV3: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139&ServiceNo=15',
      carparkAvailabilityV2: 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      trafficIncidents: 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
      trainServiceAlerts: 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
    },
    localProxies: {
      busArrival: '/api/bus-arrivals?BusStopCode=09023&ServiceNo=14',
      carparkAvailability: '/api/carpark-availability',
      trafficIncidents: '/api/traffic-incidents',
      trainAlerts: '/api/train-alerts',
      health: '/api/health',
    },
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}
