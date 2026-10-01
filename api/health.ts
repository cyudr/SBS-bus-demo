import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const accountKey = getLtaAccountKey(req);
    const hasKey = accountKey.length > 0;

    let ltaConnected = false;
    let ltaStatusMessage = hasKey
      ? 'Testing LTA DataMall connection...'
      : 'LTA_ACCOUNT_KEY not configured (serving simulated telemetry)';

    if (hasKey) {
      try {
        const testRes = await fetch(
          'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139',
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

    return res.status(200).json(payload);
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : String(error);
    return res.status(200).json({
      status: 'ok',
      healthy: true,
      environment: 'vercel-serverless',
      apiKeyConfigured: false,
      ltaDataMallConnected: false,
      ltaStatusMessage: `Fallback mode: ${err}`,
    });
  }
}
