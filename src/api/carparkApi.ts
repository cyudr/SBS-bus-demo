import { apiClient } from './client';
import { LtaCarparkResponse } from './types';

/**
 * Fetch live carpark availability across Singapore (HDB + LTA + URA)
 * @param area Optional region filter (e.g. 'Orchard', 'Somerset', 'Bedok')
 */
export async function fetchCarparkAvailability(
  area?: string
): Promise<LtaCarparkResponse> {
  let url = '/api/carpark-availability';
  if (area && area !== 'All') {
    url += `?Area=${encodeURIComponent(area)}`;
  }
  return apiClient<LtaCarparkResponse>(url);
}
