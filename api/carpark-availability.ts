import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getLtaAccountKey, FALLBACK_CARPARKS } from './utils';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const accountKey = getLtaAccountKey();
  const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const areaFilter = parsedUrl.searchParams.get('Area') || parsedUrl.searchParams.get('area') || '';

  res.setHeader('Content-Type', 'application/json');

  if (!accountKey) {
    let list = FALLBACK_CARPARKS;
    if (areaFilter) {
      list = list.filter((cp) => cp.Area.toLowerCase().includes(areaFilter.toLowerCase()));
    }
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated real-time carpark lots.',
      value: list,
    }));
    return;
  }

  try {
    const response = await fetch(
      'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      {
        headers: {
          'AccountKey': accountKey,
          'accept': 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!response.ok) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        source: 'fallback',
        isLive: false,
        error: `LTA DataMall HTTP ${response.status}`,
        value: FALLBACK_CARPARKS,
      }));
      return;
    }

    const data = await response.json();
    let lots = data.value || [];
    if (areaFilter && Array.isArray(lots)) {
      lots = lots.filter((c: { Area?: string }) =>
        c.Area?.toLowerCase().includes(areaFilter.toLowerCase())
      );
    }

    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'lta-datamall-live',
      isLive: true,
      value: lots.length > 0 ? lots : FALLBACK_CARPARKS,
    }));
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      value: FALLBACK_CARPARKS,
    }));
  }
}
