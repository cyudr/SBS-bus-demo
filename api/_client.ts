/**
 * Unified Frontend API Client wired directly to /api/* Serverless Proxies
 * (Prefix with underscore so Vercel treats as an internal module, not an API route)
 */

import {
  LtaBusArrivalResponse,
  LtaTrafficIncidentsResponse,
  LtaTrainAlertsResponse,
  LtaCarparkAvailabilityResponse,
  LtaApiHealthResponse,
} from './_types';

export * from './_types';

const DEFAULT_TIMEOUT_MS = 8000;

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(endpoint, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Format ISO estimated arrival timestamp into minutes display
 */
export function formatLtaBusDuration(estimatedArrivalIso?: string): {
  display: string;
  subText: string;
  minutes: number;
  isArrived: boolean;
} {
  if (!estimatedArrivalIso || estimatedArrivalIso.trim() === '') {
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
      display: 'No Est.',
      subText: 'Available',
      minutes: 999,
      isArrived: false,
    };
  }

  const diffMs = arrivalTime - Date.now();
  const minutes = Math.round(diffMs / 60000);

  if (minutes <= 0) {
    return {
      display: 'Arr',
      subText: 'Arriving now',
      minutes: 0,
      isArrived: true,
    };
  }

  if (minutes === 1) {
    return {
      display: '1 min',
      subText: 'Approaching stop',
      minutes: 1,
      isArrived: false,
    };
  }

  return {
    display: `${minutes} mins`,
    subText: 'On schedule',
    minutes,
    isArrived: false,
  };
}

/**
 * Format LTA Load code into human readable label and indicator color code
 */
export function formatLtaLoad(load?: 'SEA' | 'SDA' | 'LSD' | string): {
  label: string;
  color: string;
  code: string;
} {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats Available',
        color: '#16A34A', // Green
        code: 'SEA',
      };
    case 'SDA':
      return {
        label: 'Standing Available',
        color: '#D97706', // Amber
        code: 'SDA',
      };
    case 'LSD':
      return {
        label: 'Limited Standing',
        color: '#DC2626', // Red
        code: 'LSD',
      };
    default:
      return {
        label: 'Normal Load',
        color: '#16A34A',
        code: 'SEA',
      };
  }
}

/**
 * Fetch real-time bus arrivals for a bus stop (v3)
 */
export async function fetchBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse> {
  let url = `/api/bus-arrivals?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }
  return apiFetch<LtaBusArrivalResponse>(url);
}

/**
 * Fetch live carpark lots (HDB + LTA + URA)
 */
export async function fetchCarparkAvailability(
  area?: string,
  lotType?: string,
  agency?: string
): Promise<LtaCarparkAvailabilityResponse> {
  const params = new URLSearchParams();
  if (area && area !== 'All') params.append('Area', area);
  if (lotType && lotType !== 'All') params.append('LotType', lotType);
  if (agency && agency !== 'All') params.append('Agency', agency);

  const qs = params.toString();
  const url = qs ? `/api/carpark-availability?${qs}` : '/api/carpark-availability';
  return apiFetch<LtaCarparkAvailabilityResponse>(url);
}

/**
 * Fetch expressway & road traffic incidents
 */
export async function fetchTrafficIncidents(): Promise<LtaTrafficIncidentsResponse> {
  return apiFetch<LtaTrafficIncidentsResponse>('/api/traffic-incidents');
}

/**
 * Fetch train service alerts & line headways
 */
export async function fetchTrainAlerts(): Promise<LtaTrainAlertsResponse> {
  return apiFetch<LtaTrainAlertsResponse>('/api/train-alerts');
}

/**
 * Check LTA DataMall connection health and AccountKey configuration
 */
export async function checkApiHealth(): Promise<LtaApiHealthResponse> {
  return apiFetch<LtaApiHealthResponse>('/api/health');
}

export interface RoutePlanStep {
  type: 'walk' | 'bus' | 'mrt';
  serviceNo?: string;
  operator?: string;
  line?: string;
  originCode?: string;
  destinationCode?: string;
  instruction: string;
  detail: string;
  durationMins: number;
  liveArrival?: {
    etaDisplay: string;
    subText: string;
    load: string;
    type: string;
    wab: boolean;
    monitored: 0 | 1 | number;
  };
}

export interface RoutePlanOption {
  id: string;
  tag: 'Direct Bus' | 'Fastest' | 'Fewest Transfers';
  title: string;
  durationMins: number;
  walkingMins: number;
  fare: string;
  steps: RoutePlanStep[];
}

export interface RoutePlanResponse {
  status: string;
  origin: string;
  destination: string;
  preference: string;
  totalPlans: number;
  plans: RoutePlanOption[];
  error?: string;
}

/**
 * Fetch inter-modal route plans with live bus arrival integration
 */
export async function fetchRoutePlan(
  origin?: string,
  destination?: string,
  preference?: string
): Promise<RoutePlanResponse> {
  const params = new URLSearchParams();
  if (origin) params.append('origin', origin);
  if (destination) params.append('destination', destination);
  if (preference && preference !== 'All') params.append('preference', preference);

  const qs = params.toString();
  const url = qs ? `/api/route-plan?${qs}` : '/api/route-plan';
  return apiFetch<RoutePlanResponse>(url);
}
