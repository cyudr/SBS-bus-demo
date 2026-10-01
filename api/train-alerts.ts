import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLtaAccountKey, FALLBACK_TRAIN_ALERTS } from './_utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const accountKey = getLtaAccountKey();

  if (!accountKey) {
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      message: 'LTA_ACCOUNT_KEY not configured in Vercel environment; serving verified operational status.',
      value: FALLBACK_TRAIN_ALERTS,
    });
  }

  try {
    const response = await fetch(
      'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
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
        value: FALLBACK_TRAIN_ALERTS,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      source: 'lta-datamall-live',
      isLive: true,
      value: {
        ...FALLBACK_TRAIN_ALERTS,
        ...(data.value || data),
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return res.status(200).json({
      source: 'fallback',
      isLive: false,
      error: errMessage,
      value: FALLBACK_TRAIN_ALERTS,
    });
  }
}
