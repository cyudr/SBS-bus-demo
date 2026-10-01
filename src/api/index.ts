/**
 * API Management Module
 * Centralized service layer for all LTA DataMall v2/v3 and backend communication
 */

export * from './types';
export * from './client';
export * from './busApi';
export * from './carparkApi';
export * from './trafficApi';
export * from './trainApi';
export * from './healthApi';

import { fetchBusArrivals } from './busApi';
import { fetchCarparkAvailability } from './carparkApi';
import { fetchTrafficIncidents } from './trafficApi';
import { fetchTrainAlerts } from './trainApi';
import { checkApiHealth } from './healthApi';

export const ltaApi = {
  getBusArrivals: fetchBusArrivals,
  getCarparks: fetchCarparkAvailability,
  getTrafficIncidents: fetchTrafficIncidents,
  getTrainAlerts: fetchTrainAlerts,
  checkHealth: checkApiHealth,
};

export default ltaApi;
