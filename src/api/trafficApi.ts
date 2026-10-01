import { apiClient } from './client';
import { LtaTrafficIncidentsResponse } from './types';

/**
 * Fetch live traffic accidents, road closures and heavy traffic from LTA
 */
export async function fetchTrafficIncidents(): Promise<LtaTrafficIncidentsResponse> {
  return apiClient<LtaTrafficIncidentsResponse>('/api/traffic-incidents');
}
