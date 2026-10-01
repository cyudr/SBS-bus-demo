/**
 * LTA DataMall API Data Types & Response Models
 * Strictly compliant with LTA DataMall API User Guide Version 6.10 (1 Oct 2026)
 */

// 1. Bus Arrival v3 Types (Section 2.1, Page 14-20)
export type LtaOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS' | string;
export type LtaLoad = 'SEA' | 'SDA' | 'LSD' | string; // Seats Available, Standing Available, Limited Standing
export type LtaBusType = 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy

export interface LtaBusArrivalNextBus {
  OriginCode?: string; // Reference code of first bus stop
  DestinationCode?: string; // Reference code of last bus stop
  EstimatedArrival?: string; // ISO 8601 UTC timestamp GMT+8 (SST)
  Monitored?: 0 | 1 | number; // 0 = Schedule based, 1 = Estimated based on bus GPS location
  Latitude?: string; // Current estimated coordinates
  Longitude?: string;
  VisitNumber?: string; // Ordinal value of nth visit (1 = 1st visit, 2 = 2nd visit)
  Load?: LtaLoad; // SEA | SDA | LSD
  Feature?: 'WAB' | string; // WAB = Wheelchair Accessible Bus
  Type?: LtaBusType; // SD | DD | BD
}

export interface LtaBusServiceArrival {
  ServiceNo: string; // Bus service number (e.g. 15, 225G, 225W, 243G, 243W)
  Operator?: LtaOperator;
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

// 2. Carpark Availability v2 Types (Section 2.12, Page 34)
export type LtaLotType = 'C' | 'H' | 'Y' | string; // C = Cars, H = Heavy Vehicles, Y = Motorcycles
export type LtaAgency = 'HDB' | 'LTA' | 'URA' | string;

export interface LtaCarparkLot {
  CarParkID: string;
  Area?: string; // Orchard, Marina, Harbfront, JurongLakeDistrict, or empty for HDB/URA
  Development: string; // Major landmark or address
  Location: string; // "Latitude Longitude" string e.g. "1.29375 103.85718"
  AvailableLots: number;
  LotType: LtaLotType;
  Agency: LtaAgency;
}

export interface LtaCarparkResponse {
  source?: 'lta-datamall-live' | 'fallback';
  isLive?: boolean;
  error?: string;
  message?: string;
  'odata.metadata'?: string;
  value: LtaCarparkLot[];
}

// 3. Traffic Incidents Types (Section 2.18, Page 39-40)
export type LtaIncidentType =
  | 'Accident'
  | 'Roadwork'
  | 'Vehicle breakdown'
  | 'Weather'
  | 'Obstacle'
  | 'Road Block'
  | 'Heavy Traffic'
  | 'Miscellaneous'
  | 'Diversion'
  | 'Unattended Vehicle'
  | 'Fire'
  | 'Plant Failure'
  | 'Reverse Flow'
  | string;

export interface LtaTrafficIncidentItem {
  Type: LtaIncidentType;
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

// 4. Train Service Alerts Types (Section 2.11 & Annex C, Page 31-33, 62-77)
export interface LtaAffectedSegment {
  Line: 'EWL' | 'NSL' | 'NEL' | 'CCL' | 'DTL' | 'TEL' | 'BPL' | 'SLRT' | 'PLRT' | string;
  Direction: string; // e.g. "Both" or "HarbourFront"
  Stations: string; // Comma-separated station codes e.g. "NE9,NE8,NE7,NE6"
  FreePublicBus?: string; // Comma-separated station codes or "Free bus service island-wide"
  FreeMRTShuttle?: string; // Comma-separated station codes or shuttle routes
  MRTShuttleDirection?: string; // Direction of shuttle
}

export interface LtaTrainAlertMessage {
  Content: string;
  CreatedDate?: string; // e.g. "2017-12-01 17:54:21"
}

export interface LtaTrainLineStatus {
  line: string;
  code: string;
  status: string;
  headway: string;
}

export interface LtaTrainAlertData {
  Status: number; // 1 = Normal Train Service / Minor Delays, 2 = Disrupted Train Service / Major Delays
  AffectedSegments?: LtaAffectedSegment[];
  Message?: LtaTrainAlertMessage[];
  // Legacy / convenience fields
  Line?: string;
  Direction?: string;
  Stations?: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  MRTShuttleDirection?: string;
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
  environment?: string;
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

/**
 * Utility: Parse LTA DataMall v3 EstimatedArrival into formatted duration
 * per LTA User Guide Page 19-20 (Rounding of Seconds):
 * - >= 60 sec: floor to whole minutes e.g. "3 min", "1 min"
 * - < 60 sec: "Arr"
 */
export function formatLtaBusDuration(estimatedArrivalIso?: string): {
  display: string;
  subText: string;
  minutes: number;
  isArrived: boolean;
} {
  if (!estimatedArrivalIso) {
    return {
      display: 'No Est.',
      subText: 'Available',
      minutes: 999,
      isArrived: false,
    };
  }

  const arrivalTime = new Date(estimatedArrivalIso).getTime();
  if (isNaN(arrivalTime)) {
    return {
      display: '--',
      subText: 'min',
      minutes: 999,
      isArrived: false,
    };
  }

  const diffMs = arrivalTime - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);

  // Per LTA Documentation Page 20: 0:59 mins -> "Arr"
  if (diffSeconds < 60) {
    return {
      display: 'Arr',
      subText: '< 1 MIN',
      minutes: 0,
      isArrived: true,
    };
  }

  // Rounded down to nearest minute (e.g. 3:49 mins -> "3 min", 1:59 mins -> "1 min")
  const minutes = Math.floor(diffSeconds / 60);
  return {
    display: `${minutes}`,
    subText: minutes === 1 ? 'min' : 'mins',
    minutes,
    isArrived: false,
  };
}

/**
 * Utility: Parse LTA Load Code into UX styling and friendly text
 * per LTA User Guide Page 20:
 * - SEA (Seats Available) -> Green
 * - SDA (Standing Available) -> Amber
 * - LSD (Limited Standing) -> Red
 */
export function formatLtaLoad(load?: LtaLoad): {
  code: string;
  label: string;
  colorHex: string;
  bgHex: string;
  textColor: string;
} {
  switch (load) {
    case 'SEA':
      return {
        code: 'SEA',
        label: 'Seats Available',
        colorHex: '#16A34A',
        bgHex: '#DCFCE7',
        textColor: 'text-[#16A34A]',
      };
    case 'SDA':
      return {
        code: 'SDA',
        label: 'Standing Available',
        colorHex: '#D97706',
        bgHex: '#FEF3C7',
        textColor: 'text-[#D97706]',
      };
    case 'LSD':
      return {
        code: 'LSD',
        label: 'Limited Standing',
        colorHex: '#DC2626',
        bgHex: '#FEE2E2',
        textColor: 'text-[#DC2626]',
      };
    default:
      return {
        code: 'NA',
        label: 'Normal Load',
        colorHex: '#64748B',
        bgHex: '#F1F5F9',
        textColor: 'text-[#64748B]',
      };
  }
}
