/**
 * Official LTA DataMall v3 & Unified Transit Data Types
 * (Prefix with underscore so Vercel treats as an internal module, not an API route)
 */

export interface LtaBusArrivalNextBus {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: 0 | 1 | number;
}

export interface LtaBusArrivalService {
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS' | string;
  NextBus?: LtaBusArrivalNextBus;
  NextBus2?: LtaBusArrivalNextBus;
  NextBus3?: LtaBusArrivalNextBus;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaBusArrivalService[];
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  message?: string;
  error?: string;
}

export interface LtaTrafficIncidentItem {
  Type: 'Accident' | 'Roadwork' | 'Heavy Traffic' | 'Vehicle breakdown' | 'Diversion' | string;
  Latitude: number;
  Longitude: number;
  Message: string;
  Location?: string;
  Updated?: string;
}

export interface LtaTrafficIncidentsResponse {
  'odata.metadata'?: string;
  value: LtaTrafficIncidentItem[];
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  message?: string;
  error?: string;
}

export interface LtaTrainAlertLine {
  line: string;
  code: string;
  status: 'Normal' | 'Minor Delay' | 'Disrupted';
  headway: string;
}

export interface LtaTrainAlertData {
  Status: 1 | 2 | number;
  AffectedSegments?: Array<{
    Line: string;
    Direction: string;
    Stations: string;
    FreePublicBus?: string;
    FreeMRTShuttle?: string;
    MRTShuttleDirection?: string;
  }>;
  Message?: Array<{
    Content: string;
    CreatedDate: string;
  }>;
  LinesStatus?: LtaTrainAlertLine[];
}

export interface LtaTrainAlertsResponse {
  'odata.metadata'?: string;
  value: LtaTrainAlertData;
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
}

export interface LtaCarparkLot {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string;
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string;
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface LtaCarparkAvailabilityResponse {
  'odata.metadata'?: string;
  value: LtaCarparkLot[];
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  message?: string;
  error?: string;
}

export interface LtaApiHealthResponse {
  status: string;
  healthy: boolean;
  timestamp: string;
  apiKeyConfigured: boolean;
  ltaDataMallConnected: boolean;
  ltaStatusMessage: string;
  headerRequired?: string;
  endpoints?: Record<string, string>;
  localProxies?: Record<string, string>;
}
