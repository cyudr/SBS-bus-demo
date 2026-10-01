/**
 * LTA DataMall API Data Types & Response Models
 */

// 1. Bus Arrival v3 Types
export interface LtaBusArrivalNextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string; // Seats Available, Standing Available, Limited Standing
  Feature?: 'WAB' | string; // Wheelchair Accessible Bus
  Type?: 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy
}

export interface LtaBusServiceArrival {
  ServiceNo: string;
  Operator?: string;
  NextBus?: LtaBusArrivalNextBus;
  NextBus2?: LtaBusArrivalNextBus;
  NextBus3?: LtaBusArrivalNextBus;
}

export interface LtaBusArrivalResponse {
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
  message?: string;
  'odata.metadata'?: string;
  BusStopCode: string;
  Services?: LtaBusServiceArrival[];
}

// 2. Carpark Availability v2 Types
export interface LtaCarparkLot {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: string;
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface LtaCarparkResponse {
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
  message?: string;
  'odata.metadata'?: string;
  value: LtaCarparkLot[];
}

// 3. Traffic Incidents Types
export interface LtaTrafficIncidentItem {
  Type: string;
  Latitude?: number;
  Longitude?: number;
  Message: string;
  Location?: string;
  Updated?: string;
}

export interface LtaTrafficIncidentsResponse {
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
  message?: string;
  'odata.metadata'?: string;
  value: LtaTrafficIncidentItem[];
}

// 4. Train Service Alerts Types
export interface LtaTrainAlertMessage {
  Content: string;
}

export interface LtaTrainLineStatus {
  line: string;
  code: string;
  status: string;
  headway: string;
}

export interface LtaTrainAlertData {
  Status: number; // 1 = Normal, 2 = Disrupted
  Line?: string;
  Direction?: string;
  Stations?: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  MRTShuttleDirection?: string;
  Message?: LtaTrainAlertMessage[];
  LinesStatus?: LtaTrainLineStatus[];
}

export interface LtaTrainAlertsResponse {
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
  message?: string;
  'odata.metadata'?: string;
  value: LtaTrainAlertData;
}

// 5. Health Check Response
export interface LtaApiHealthResponse {
  status: string;
  healthy: boolean;
  timestamp: string;
  apiKeyConfigured: boolean;
  ltaDataMallConnected: boolean;
  ltaStatusMessage: string;
  headerRequired: string;
  endpoints: {
    busArrivalV3: string;
    carparkAvailabilityV2: string;
    trafficIncidents: string;
    trainServiceAlerts: string;
  };
  localProxies: {
    busArrival: string;
    carparkAvailability: string;
    trafficIncidents: string;
    trainAlerts: string;
    health: string;
  };
}
