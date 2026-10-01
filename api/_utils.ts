/**
 * Vercel Serverless Internal Utility
 * Leading underscore ensures Vercel ignores this file for route deployment
 */

export function getLtaAccountKey(): string {
  return (
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_DATAMALL_API_KEY ||
    process.env.SBS_API_KEY ||
    process.env.VITE_LTA_ACCOUNT_KEY ||
    ''
  ).trim();
}

/**
 * Generate official LTA DataMall v3 BusArrival mock fallback matching user reference
 */
export function generateBusArrivalFallback(busStopCode: string = '20251', serviceNo?: string) {
  const allServices = [
    {
      ServiceNo: '176',
      Operator: 'SMRT',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: new Date(Date.now() + 45000).toISOString(),
        Monitored: 1,
        Latitude: '1.3100396666666667',
        Longitude: '103.75647683333334',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: new Date(Date.now() + 15 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.27424',
        Longitude: '103.79662333333333',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: new Date(Date.now() + 22 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.278829',
        Longitude: '103.81719033333333',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '30',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '84009',
        DestinationCode: '22009',
        EstimatedArrival: new Date(Date.now() + 90000).toISOString(),
        Monitored: 1,
        Latitude: '1.3144378333333333',
        Longitude: '103.75299533333333',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '84009',
        DestinationCode: '22009',
        EstimatedArrival: new Date(Date.now() + 5 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.3090805',
        Longitude: '103.76039283333333',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '84009',
        DestinationCode: '22009',
        EstimatedArrival: new Date(Date.now() + 24 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.2757191666666667',
        Longitude: '103.793202',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
    {
      ServiceNo: '78',
      Operator: 'TTS',
      NextBus: {
        OriginCode: '29009',
        DestinationCode: '29009',
        EstimatedArrival: new Date(Date.now() + 4 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.3087378333333333',
        Longitude: '103.73379016666667',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '29009',
        DestinationCode: '29009',
        EstimatedArrival: new Date(Date.now() + 26 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.312363',
        Longitude: '103.76434116666667',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '',
        DestinationCode: '',
        EstimatedArrival: '',
        Monitored: 0,
        Latitude: '',
        Longitude: '',
        VisitNumber: '',
        Load: '',
        Feature: '',
        Type: '',
      },
    },
    {
      ServiceNo: '14',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '09023',
        DestinationCode: '84009',
        EstimatedArrival: new Date(Date.now() + 40000).toISOString(),
        Monitored: 1,
        Latitude: '1.3025',
        Longitude: '103.8340',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '09023',
        DestinationCode: '84009',
        EstimatedArrival: new Date(Date.now() + 7 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.2980',
        Longitude: '103.8400',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '09023',
        DestinationCode: '84009',
        EstimatedArrival: new Date(Date.now() + 16 * 60000).toISOString(),
        Monitored: 1,
        Latitude: '1.2900',
        Longitude: '103.8500',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
  ];

  let filtered = allServices;
  if (serviceNo) {
    const match = allServices.find((s) => s.ServiceNo.toUpperCase() === serviceNo.toUpperCase());
    if (match) {
      filtered = [match];
    } else {
      filtered = [
        {
          ServiceNo: serviceNo,
          Operator: 'SBST',
          NextBus: {
            OriginCode: busStopCode,
            DestinationCode: '99999',
            EstimatedArrival: new Date(Date.now() + 3 * 60000).toISOString(),
            Monitored: 1,
            Latitude: '1.3000',
            Longitude: '103.8400',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
          },
          NextBus2: {
            OriginCode: busStopCode,
            DestinationCode: '99999',
            EstimatedArrival: new Date(Date.now() + 11 * 60000).toISOString(),
            Monitored: 1,
            Latitude: '1.2950',
            Longitude: '103.8450',
            VisitNumber: '1',
            Load: 'SDA',
            Feature: 'WAB',
            Type: 'SD',
          },
          NextBus3: {
            OriginCode: '',
            DestinationCode: '',
            EstimatedArrival: '',
            Monitored: 0,
            Latitude: '',
            Longitude: '',
            VisitNumber: '',
            Load: '',
            Feature: '',
            Type: '',
          },
        },
      ];
    }
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
    BusStopCode: busStopCode,
    Services: filtered,
  };
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
  Status: 1, // 1 = Normal Train Service / Minor Delays, 2 = Disrupted Train Service / Major Delays
  AffectedSegments: [] as Array<{
    Line: string;
    Direction: string;
    Stations: string;
    FreePublicBus?: string;
    FreeMRTShuttle?: string;
    MRTShuttleDirection?: string;
  }>,
  Message: [
    {
      Content: 'All SBS Transit & SMRT train lines (North-South, East-West, North East, Circle, Downtown, Thomson-East Coast) are operating normally on scheduled headways.',
      CreatedDate: new Date().toISOString(),
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
