import type { IncomingMessage, ServerResponse } from 'http';
import { getLtaAccountKey, FALLBACK_TRAFFIC_INCIDENTS } from './utils';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const accountKey = getLtaAccountKey();

  res.setHeader('Content-Type', 'application/json');

  if (!accountKey) {
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated high-fidelity telemetry.',
      value: FALLBACK_TRAFFIC_INCIDENTS,
    }));
    return;
  }

  try {
    const response = await fetch(
      'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents',
      {
        headers: {
          'AccountKey': accountKey,
          'accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        source: 'fallback',
        isLive: false,
        error: `LTA DataMall HTTP ${response.status}`,
        value: FALLBACK_TRAFFIC_INCIDENTS,
      }));
      return;
    }

    const data = await response.json();
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'lta-datamall-live',
      isLive: true,
      value: data.value && data.value.length > 0 ? data.value : FALLBACK_TRAFFIC_INCIDENTS,
    }));
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      value: FALLBACK_TRAFFIC_INCIDENTS,
    }));
  }
}
