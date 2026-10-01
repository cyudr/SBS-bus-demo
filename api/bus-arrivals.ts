import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { getLtaAccountKey } from './utils';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const accountKey = getLtaAccountKey();
  const parsedUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const busStopCode = parsedUrl.searchParams.get('BusStopCode') || parsedUrl.searchParams.get('busStopCode') || '09023';
  const serviceNo = parsedUrl.searchParams.get('ServiceNo') || parsedUrl.searchParams.get('serviceNo') || '';

  res.setHeader('Content-Type', 'application/json');

  if (!accountKey) {
    const fallbackResponse = {
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving simulated high-fidelity telemetry.',
      BusStopCode: busStopCode,
      Services: [
        {
          ServiceNo: serviceNo || '14',
          Operator: 'SBST',
          NextBus: {
            OriginCode: '09023',
            DestinationCode: '84009',
            EstimatedArrival: new Date(Date.now() + 45000).toISOString(),
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
            VisitNumber: '1',
          },
          NextBus2: {
            OriginCode: '09023',
            DestinationCode: '84009',
            EstimatedArrival: new Date(Date.now() + 7 * 60000).toISOString(),
            Load: 'SDA',
            Feature: 'WAB',
            Type: 'SD',
            VisitNumber: '1',
          },
          NextBus3: {
            OriginCode: '09023',
            DestinationCode: '84009',
            EstimatedArrival: new Date(Date.now() + 16 * 60000).toISOString(),
            Load: 'LSD',
            Feature: 'WAB',
            Type: 'DD',
            VisitNumber: '1',
          },
        },
      ],
    };
    res.statusCode = 200;
    res.end(JSON.stringify(fallbackResponse));
    return;
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
      res.statusCode = 200;
      res.end(JSON.stringify({
        source: 'fallback',
        isLive: false,
        error: `LTA DataMall HTTP ${response.status}`,
        BusStopCode: busStopCode,
      }));
      return;
    }

    const data = await response.json();
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'lta-datamall-live',
      isLive: true,
      ...data,
    }));
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    res.statusCode = 200;
    res.end(JSON.stringify({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      BusStopCode: busStopCode,
    }));
  }
}
