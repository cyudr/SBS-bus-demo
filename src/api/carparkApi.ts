import { apiClient } from './client';
import { LtaCarparkResponse } from './types';

/**
 * Fetch live carpark availability across Singapore (HDB + LTA + URA)
 * @param area Optional region filter (e.g. 'Orchard', 'Somerset', 'Bedok')
 */
export async function fetchCarparkAvailability(
  area?: string,
  lotType?: string,
  agency?: string
): Promise<LtaCarparkResponse> {
  const params = new URLSearchParams();
  if (area && area !== 'All') params.set('Area', area);
  if (lotType && lotType !== 'All') params.set('LotType', lotType);
  if (agency && agency !== 'All') params.set('Agency', agency);
  const qs = params.toString();
  return apiClient<LtaCarparkResponse>(`/api/carpark-availability${qs ? `?${qs}` : ''}`);
}
