import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey, FALLBACK_TRAFFIC_INCIDENTS } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated high-fidelity telemetry.',
      value: FALLBACK_TRAFFIC_INCIDENTS,
    });
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
      return res.status(200).json({
        source: 'fallback',
        isLive: false,
        error: `LTA DataMall HTTP ${response.status}`,
        value: FALLBACK_TRAFFIC_INCIDENTS,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      source: 'lta-datamall-live',
      isLive: true,
      value: data.value && data.value.length > 0 ? data.value : FALLBACK_TRAFFIC_INCIDENTS,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      value: FALLBACK_TRAFFIC_INCIDENTS,
    });
  }
}
