import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey, FALLBACK_CARPARKS } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accountKey = getLtaAccountKey(req);
  const areaFilter = (req.query.Area || req.query.area || '') as string;
  const lotTypeFilter = (req.query.LotType || req.query.lotType || '') as string;
  const agencyFilter = (req.query.Agency || req.query.agency || '') as string;

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
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated real-time carpark lots.',
      value: filterLots(FALLBACK_CARPARKS),
    });
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
      return res.status(200).json({
        source: 'fallback',
        isLive: false,
        error: `LTA DataMall HTTP ${response.status}`,
        value: filterLots(FALLBACK_CARPARKS),
      });
    }

    const data = await response.json();
    const rawLots = Array.isArray(data.value) ? data.value : [];
    const lots = filterLots(rawLots.length > 0 ? rawLots : FALLBACK_CARPARKS);

    return res.status(200).json({
      source: 'lta-datamall-live',
      isLive: true,
      value: lots,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      value: filterLots(FALLBACK_CARPARKS),
    });
  }
}
