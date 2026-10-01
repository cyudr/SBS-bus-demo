import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey, generateBusArrivalFallback } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accountKey = getLtaAccountKey();
  const busStopCode = (req.query.BusStopCode || req.query.busStopCode || '20251') as string;
  const serviceNo = (req.query.ServiceNo || req.query.serviceNo || '') as string;

  const getFallback = () => ({
    source: 'fallback',
    isLive: false,
    message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated high-fidelity telemetry.',
    ...generateBusArrivalFallback(busStopCode, serviceNo),
  });

  if (!accountKey) {
    return res.status(200).json(getFallback());
  }

  try {
    let url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(url, {
      headers: {
        'AccountKey': accountKey,
        'accept': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return res.status(200).json({
        ...getFallback(),
        error: `LTA DataMall HTTP ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      source: 'lta-datamall-live',
      isLive: true,
      ...data,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return res.status(200).json({
      ...getFallback(),
      error: errMessage,
    });
  }
}
