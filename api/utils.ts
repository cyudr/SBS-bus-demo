/**
 * Vercel Serverless API Utilities & Constants
 */

export function getLtaAccountKey(): string {
  return (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_API_KEY ||
    process.env.SBS_API_KEY ||
    process.env.VITE_LTA_ACCOUNT_KEY ||
    process.env.VITE_LTA_DATAMALL_API_KEY ||
    process.env.VITE_SBS_API_KEY ||
    ''
  ).trim();
}

export const FALLBACK_TRAFFIC_INCIDENTS = [
  {
    Type: 'Roadwork',
    Latitude: 1.3045,
    Longitude: 103.8322,
    Message: '(01/10)08:45 Roadworks on Orchard Boulevard (towards Paterson Rd) after Orchard Turn. Left lane closed.',
    Location: 'Orchard Boulevard',
    Updated: '15 mins ago',
  },
  {
    Type: 'Heavy Traffic',
    Latitude: 1.3001,
    Longitude: 103.8450,
    Message: '(01/10)09:05 Heavy traffic on CTE (towards AYE) before Buyong Rd Exit. Expect delays.',
    Location: 'CTE Southbound',
    Updated: '22 mins ago',
  },
  {
    Type: 'Accident',
    Latitude: 1.3325,
    Longitude: 103.8560,
    Message: '(01/10)08:15 Accident cleared on PIE (towards Tuas) after Kim Keat Link. Traffic recovering.',
    Location: 'PIE Westbound',
    Updated: '45 mins ago',
  },
  {
    Type: 'Diversion',
    Latitude: 1.2930,
    Longitude: 103.8550,
    Message: '(01/10)07:00 Scheduled road diversion along Nicoll Highway for Sunday civic run event.',
    Location: 'Nicoll Highway / Marina Centre',
    Updated: '1 hour ago',
  },
];

export const FALLBACK_TRAIN_ALERTS = {
  Status: 1,
  Line: 'All Lines',
  Direction: 'Both',
  Stations: '',
  FreePublicBus: 'No free bus bridging required. All lines operating normally.',
  FreeMRTShuttle: '',
  MRTShuttleDirection: '',
  Message: [
    {
      Content: 'All SBS Transit & SMRT train lines (North-South, East-West, North East, Circle, Downtown, Thomson-East Coast) are operating normally on scheduled headways.',
    },
  ],
  LinesStatus: [
    { line: 'North South Line (NSL)', code: 'NS', status: 'Normal', headway: '2-4 mins' },
    { line: 'East West Line (EWL)', code: 'EW', status: 'Normal', headway: '2-4 mins' },
    { line: 'North East Line (NEL)', code: 'NE', status: 'Normal', headway: '3-5 mins' },
    { line: 'Circle Line (CCL)', code: 'CC', status: 'Normal', headway: '4-6 mins' },
    { line: 'Downtown Line (DTL)', code: 'DT', status: 'Normal', headway: '3-4 mins' },
    { line: 'Thomson-East Coast Line (TEL)', code: 'TE', status: 'Normal', headway: '4-5 mins' },
  ],
};

export const FALLBACK_CARPARKS = [
  {
    CarParkID: 'ORCH-01',
    Area: 'Orchard',
    Development: 'ION Orchard Carpark',
    Location: '1.3040 103.8320',
    AvailableLots: 248,
    LotType: 'C',
    Agency: 'LTA',
  },
  {
    CarParkID: 'ORCH-02',
    Area: 'Orchard',
    Development: 'Wisma Atria',
    Location: '1.3038 103.8335',
    AvailableLots: 114,
    LotType: 'C',
    Agency: 'LTA',
  },
  {
    CarParkID: 'ORCH-03',
    Area: 'Orchard',
    Development: 'Ngee Ann City (Takashimaya)',
    Location: '1.3025 103.8345',
    AvailableLots: 420,
    LotType: 'C',
    Agency: 'LTA',
  },
  {
    CarParkID: 'SOM-01',
    Area: 'Somerset',
    Development: '313@somerset',
    Location: '1.3010 103.8385',
    AvailableLots: 89,
    LotType: 'C',
    Agency: 'LTA',
  },
  {
    CarParkID: 'DHOBY-01',
    Area: 'Dhoby Ghaut',
    Development: 'Plaza Singapura',
    Location: '1.2995 103.8450',
    AvailableLots: 312,
    LotType: 'C',
    Agency: 'LTA',
  },
  {
    CarParkID: 'BEDOK-01',
    Area: 'Bedok',
    Development: 'Bedok Mall & Town Centre (HDB)',
    Location: '1.3240 103.9300',
    AvailableLots: 175,
    LotType: 'C',
    Agency: 'HDB',
  },
  {
    CarParkID: 'CLEM-01',
    Area: 'Clementi',
    Development: 'The Clementi Mall (HDB/LTA)',
    Location: '1.3150 103.7650',
    AvailableLots: 142,
    LotType: 'C',
    Agency: 'HDB',
  },
];
