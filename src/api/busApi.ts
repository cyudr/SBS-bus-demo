import { apiClient } from './client';
import { LtaBusArrivalResponse } from './types';

/**
 * Fetch real-time bus arrivals for a bus stop (LTA DataMall v3)
 * @param busStopCode 5-digit bus stop identifier (e.g. '09023', '83139')
 * @param serviceNo Optional specific bus service number (e.g. '14', '15')
 */
export async function fetchBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse> {
  let url = `/api/bus-arrivals?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }
  return apiClient<LtaBusArrivalResponse>(url);
}
