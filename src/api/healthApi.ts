import { apiClient } from './client';
import { LtaApiHealthResponse } from './types';

/**
 * Check LTA DataMall connection health and AccountKey configuration
 */
export async function checkApiHealth(): Promise<LtaApiHealthResponse> {
  return apiClient<LtaApiHealthResponse>('/api/health');
}
