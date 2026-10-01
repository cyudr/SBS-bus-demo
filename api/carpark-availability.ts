import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getLtaAccountKey, FALLBACK_CARPARKS } from './utils';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const accountKey = getLtaAccountKey();
  const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const areaFilter = parsedUrl.searchParams.get('Area') || parsedUrl.searchParams.get('area') || '';
  const lotTypeFilter = parsedUrl.searchParams.get('LotType') || parsedUrl.searchParams.get('lotType') || '';
  const agencyFilter = parsedUrl.searchParams.get('Agency') || parsedUrl.searchParams.get('agency') || '';

  res.setHeader('Content-Type', 'application/json');

  const filterLots = (items: typeof FALLBACK_CARPARKS) => {
    return items.filter((cp) => {
      const matchArea = !areaFilter || areaFilter === 'All' ||
        cp.Area?.toLowerCase().includes(areaFilter.toLowerCase()) ||
        cp.Development?.toLowerCase().includes(areaFilter.toLowerCase());
      const matchType = !lotTypeFilter || lotTypeFilter === 'All' || cp.LotType === lotTypeFilter;
      const matchAgency = !agencyFilter || agencyFilter === 'All' || cp.Agency === agencyFilter;
      return matchArea && matchType && matchAgency;
    });
  };

  if (!accountKey) {
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated real-time carpark lots.',
      value: filterLots(FALLBACK_CARPARKS),
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
    const rawLots = Array.isArray(data.value) ? data.value : [];
    const lots = filterLots(rawLots.length > 0 ? rawLots : FALLBACK_CARPARKS);

    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'lta-datamall-live',
      isLive: true,
      value: lots,
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
