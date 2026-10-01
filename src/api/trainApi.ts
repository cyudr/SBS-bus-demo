import { apiClient } from './client';
import { LtaTrainAlertsResponse } from './types';

/**
 * Fetch MRT & LRT train service alerts and status from LTA
 */
export async function fetchTrainAlerts(): Promise<LtaTrainAlertsResponse> {
  return apiClient<LtaTrainAlertsResponse>('/api/train-alerts');
}
