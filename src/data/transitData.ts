export interface BusArrivalInfo {
  serviceNo: string;
  destination: string;
  routeType: 'Trunk' | 'Feeder' | 'Express';
  firstBus: string;
  lastBus: string;
  frequency: string;
  viaDescription: string;
  direction1: {
    destination: string;
    stops: RouteStop[];
  };
  direction2: {
    destination: string;
    stops: RouteStop[];
  };
  arrivals: [
    {
      etaDisplay: string;
      etaSub: string;
      minutes: number;
      type: 'Double Deck (DD)' | 'Single Deck (SD)';
      wab: boolean;
      occupancy: 'Seats Available' | 'Standing Available' | 'Limited Standing';
      occupancyPercent: number;
      vehiclePlate: string;
      locationStatus: string;
    },
    {
      etaDisplay: string;
      etaSub: string;
      minutes: number;
      type: 'Double Deck (DD)' | 'Single Deck (SD)';
      wab: boolean;
      occupancy: 'Seats Available' | 'Standing Available' | 'Limited Standing';
      occupancyPercent: number;
      vehiclePlate: string;
      locationStatus: string;
    },
    {
      etaDisplay: string;
      etaSub: string;
      minutes: number;
      type: 'Double Deck (DD)' | 'Single Deck (SD)';
      wab: boolean;
      occupancy: 'Seats Available' | 'Standing Available' | 'Limited Standing';
      occupancyPercent: number;
      vehiclePlate: string;
      locationStatus: string;
    }
  ];
}

export interface RouteStop {
  stopCode: string;
  name: string;
  road: string;
  transfers?: string;
  status: 'passed' | 'approaching' | 'current' | 'next';
  passedText?: string;
  etaDiff?: string;
  vehicleHere?: string;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  distanceMeters: number;
  walkMinutes: number;
  barrierFree: boolean;
  mrtTransfers: string[];
  mrtExit?: string;
  facing: string;
  services: {
    serviceNo: string;
    destination: string;
    via: string;
    etaDisplay: string;
    occupancy: 'Seats' | 'Standing' | 'Limited';
  }[];
}

export interface ServiceAlert {
  id: string;
  category: 'Trunk' | 'Downtown Line' | 'North East Line' | 'Diversion' | 'General';
  severity: 'Normal' | 'Advisory' | 'Diversion';
  title: string;
  description: string;
  affectedServices: string[];
  updatedTime: string;
  status: 'Active' | 'Resolved';
}

export interface TripPlanOption {
  id: string;
  title: string;
  durationMins: number;
  fare: string;
  walkingMins: number;
  tag: 'Fastest' | 'Fewest Transfers' | 'Direct Bus';
  steps: {
    type: 'walk' | 'bus' | 'mrt';
    instruction: string;
    detail: string;
    durationMins: number;
    serviceNo?: string;
    stopsCount?: number;
    color?: string;
  }[];
}

export const BUS_STOPS: Record<string, BusStop> = {
  '09023': {
    code: '09023',
    name: 'Opp Orchard Stn / ION',
    road: 'Orchard Blvd',
    distanceMeters: 110,
    walkMinutes: 2,
    barrierFree: true,
    mrtTransfers: ['NS', 'TE'],
    mrtExit: 'ION Orchard Exit 4',
    facing: 'Facing Orchard Boulevard (Southbound)',
    services: [
      { serviceNo: '14', destination: 'To Bedok Temp Int', via: 'via Somerset, Dhoby Ghaut', etaDisplay: 'Arr', occupancy: 'Seats' },
      { serviceNo: '65', destination: 'To Tampines Int', via: 'via River Valley, Little India', etaDisplay: '2 min', occupancy: 'Standing' },
      { serviceNo: '16', destination: 'To Bedok Int', via: 'via Bras Basah, Marine Parade', etaDisplay: '4 min', occupancy: 'Seats' },
      { serviceNo: '175', destination: 'To Lor 1 Geylang Ter', via: 'via Clarke Quay, Bugis', etaDisplay: '9 min', occupancy: 'Seats' },
      { serviceNo: '5', destination: 'To Pasir Ris Int', via: 'via Novena, Toa Payoh, Eunos', etaDisplay: '11 min', occupancy: 'Limited' },
      { serviceNo: '54', destination: 'To Bishan Int', via: 'via Newton, Thomson, Marymount', etaDisplay: '14 min', occupancy: 'Seats' },
    ],
  },
  '09038': {
    code: '09038',
    name: 'Opp Somerset Stn',
    road: 'Somerset Rd',
    distanceMeters: 450,
    walkMinutes: 6,
    barrierFree: true,
    mrtTransfers: ['NS'],
    mrtExit: 'Somerset Exit B',
    facing: 'Facing Somerset Road (Eastbound)',
    services: [
      { serviceNo: '14', destination: 'To Bedok Temp Int', via: 'via Dhoby Ghaut', etaDisplay: '4 min', occupancy: 'Seats' },
      { serviceNo: '65', destination: 'To Tampines Int', via: 'via Little India', etaDisplay: '6 min', occupancy: 'Standing' },
      { serviceNo: '124', destination: 'To St. Michael\'s Ter', via: 'via Newton', etaDisplay: '3 min', occupancy: 'Seats' },
      { serviceNo: '174', destination: 'To New Bridge Rd Ter', via: 'via Chinatown', etaDisplay: '7 min', occupancy: 'Seats' },
    ],
  },
  '08031': {
    code: '08031',
    name: 'Dhoby Ghaut Stn',
    road: 'Orchard Rd',
    distanceMeters: 850,
    walkMinutes: 11,
    barrierFree: true,
    mrtTransfers: ['NS', 'NE', 'CC'],
    mrtExit: 'Dhoby Ghaut Exit A/E',
    facing: 'Facing Plaza Singapura / Orchard Rd',
    services: [
      { serviceNo: '14', destination: 'To Bedok Temp Int', via: 'via Bras Basah, Mountbatten', etaDisplay: '8 min', occupancy: 'Seats' },
      { serviceNo: '7', destination: 'To Bedok Int', via: 'via Victoria St', etaDisplay: '3 min', occupancy: 'Seats' },
      { serviceNo: '65', destination: 'To Tampines Int', via: 'via Bugis', etaDisplay: '10 min', occupancy: 'Standing' },
      { serviceNo: '174', destination: 'To New Bridge Rd Ter', via: 'via Clarke Quay', etaDisplay: '12 min', occupancy: 'Standing' },
    ],
  },
  '01019': {
    code: '01019',
    name: 'Bras Basah Complex',
    road: 'Victoria St',
    distanceMeters: 1400,
    walkMinutes: 18,
    barrierFree: true,
    mrtTransfers: ['EW', 'DT'],
    mrtExit: 'Bugis Exit C',
    facing: 'Facing Victoria St / National Library',
    services: [
      { serviceNo: '14', destination: 'To Bedok Temp Int', via: 'via Nicoll Hwy', etaDisplay: '14 min', occupancy: 'Seats' },
      { serviceNo: '7', destination: 'To Bedok Int', via: 'via Geylang', etaDisplay: '5 min', occupancy: 'Seats' },
      { serviceNo: '175', destination: 'To Lor 1 Geylang Ter', via: 'via Kallang', etaDisplay: '7 min', occupancy: 'Seats' },
    ],
  },
  '84009': {
    code: '84009',
    name: 'Bedok Temp Int',
    road: 'Bedok North Ave 1',
    distanceMeters: 11500,
    walkMinutes: 140,
    barrierFree: true,
    mrtTransfers: ['EW'],
    mrtExit: 'Bedok MRT Interchange',
    facing: 'Bedok Bus Interchange Berth B4',
    services: [
      { serviceNo: '14', destination: 'To Clementi Int', via: 'via Orchard, Dover', etaDisplay: 'Arr', occupancy: 'Seats' },
      { serviceNo: '7', destination: 'To Clementi Int', via: 'via Bugis, Orchard', etaDisplay: '5 min', occupancy: 'Seats' },
      { serviceNo: '16', destination: 'To Bukit Merah Int', via: 'via Marine Parade', etaDisplay: '7 min', occupancy: 'Standing' },
    ],
  },
  '17009': {
    code: '17009',
    name: 'Clementi Int',
    road: 'Clementi Ave 3',
    distanceMeters: 9200,
    walkMinutes: 115,
    barrierFree: true,
    mrtTransfers: ['EW'],
    mrtExit: 'Clementi Mall Level 1',
    facing: 'Clementi Central Berth 1',
    services: [
      { serviceNo: '14', destination: 'To Bedok Temp Int', via: 'via Buona Vista, Orchard', etaDisplay: '3 min', occupancy: 'Seats' },
      { serviceNo: '175', destination: 'To Lor 1 Geylang Ter', via: 'via Commonwealth', etaDisplay: '6 min', occupancy: 'Seats' },
      { serviceNo: '196', destination: 'To Bedok Int', via: 'via Shenton Way', etaDisplay: '10 min', occupancy: 'Standing' },
    ],
  }
};

export const BUS_SERVICES: Record<string, BusArrivalInfo> = {
  '14': {
    serviceNo: '14',
    destination: 'Bedok Temp Int',
    routeType: 'Trunk',
    firstBus: '05:45',
    lastBus: '23:45',
    frequency: '7-11 mins',
    viaDescription: 'Via Somerset Rd, Dhoby Ghaut, Bras Basah, Nicoll Hwy, Mountbatten',
    direction1: {
      destination: 'To Bedok Temp Int',
      stops: [
        { stopCode: '09139', name: 'Grange Residences', road: 'Grange Rd', status: 'passed', passedText: 'Stop 12 • Passed 3 mins ago' },
        { stopCode: '09111', name: 'Opp Four Seasons Hotel', road: 'Orchard Blvd', status: 'approaching', passedText: 'Stop 13 • 260m away', vehicleHere: 'Bus 14 Arr' },
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', transfers: 'North South & TEL Lines', status: 'current', passedText: 'Stop 14 of 44', etaDiff: '< 1 min' },
        { stopCode: '09038', name: 'Opp Somerset Stn', road: 'Somerset Rd', status: 'next', passedText: 'Stop 15 • Somerset Rd', etaDiff: '+4 mins' },
        { stopCode: '08031', name: 'Dhoby Ghaut Stn', road: 'Orchard Rd', transfers: 'NSL / NEL / CCL', status: 'next', passedText: 'Stop 16 • Orchard Rd', etaDiff: '+8 mins' },
        { stopCode: '01019', name: 'Bras Basah Complex', road: 'Victoria St', status: 'next', passedText: 'Stop 17 • Victoria St', etaDiff: '+14 mins' },
        { stopCode: '80059', name: 'Opp Mountbatten Stn', road: 'Old Airport Rd', transfers: 'CCL', status: 'next', passedText: 'Stop 23 • Mountbatten', etaDiff: '+24 mins' },
        { stopCode: '84009', name: 'Bedok Temp Int', road: 'Bedok North Ave 1', transfers: 'EWL', status: 'next', passedText: 'Stop 44 • Terminus', etaDiff: '+48 mins' },
      ],
    },
    direction2: {
      destination: 'To Clementi Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', transfers: 'NSL / TEL', status: 'current', passedText: 'Stop 18 of 45', etaDiff: '4 mins' },
        { stopCode: '09129', name: 'Royal Plaza On Scotts', road: 'Scotts Rd', status: 'next', passedText: 'Stop 19 • Scotts Rd', etaDiff: '+7 mins' },
        { stopCode: '11169', name: 'Tanglin Pk', road: 'Tanglin Rd', status: 'next', passedText: 'Stop 21 • Tanglin', etaDiff: '+12 mins' },
        { stopCode: '11209', name: 'Holland Village', road: 'Holland Ave', transfers: 'CCL', status: 'next', passedText: 'Stop 26 • Holland V', etaDiff: '+19 mins' },
        { stopCode: '17009', name: 'Clementi Int', road: 'Clementi Ave 3', transfers: 'EWL', status: 'next', passedText: 'Stop 45 • Terminus', etaDiff: '+42 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: 'Arr',
        etaSub: '< 1 MIN',
        minutes: 0,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 35,
        vehiclePlate: 'SBS6812Y',
        locationStatus: 'Approaching stop',
      },
      {
        etaDisplay: '7',
        etaSub: 'mins',
        minutes: 7,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 68,
        vehiclePlate: 'SBS3490R',
        locationStatus: 'Past Tanglin CC',
      },
      {
        etaDisplay: '16',
        etaSub: 'mins',
        minutes: 16,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 92,
        vehiclePlate: 'SBS8999K',
        locationStatus: 'At Holland V Stn',
      },
    ],
  },
  '65': {
    serviceNo: '65',
    destination: 'Tampines Int',
    routeType: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:45',
    frequency: '6-10 mins',
    viaDescription: 'Via River Valley, Little India, MacPherson, Bedok Reservoir',
    direction1: {
      destination: 'To Tampines Int',
      stops: [
        { stopCode: '09111', name: 'Opp Four Seasons Hotel', road: 'Orchard Blvd', status: 'passed', passedText: 'Stop 10 • Passed' },
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', transfers: 'NSL / TEL', status: 'current', passedText: 'Stop 11 of 48', etaDiff: '2 mins' },
        { stopCode: '09038', name: 'Opp Somerset Stn', road: 'Somerset Rd', status: 'next', passedText: 'Stop 12 • Somerset', etaDiff: '+5 mins' },
        { stopCode: '07519', name: 'Peace Ctr', road: 'Selegie Rd', status: 'next', passedText: 'Stop 15 • Selegie', etaDiff: '+12 mins' },
        { stopCode: '44109', name: 'Little India Stn', road: 'Bukit Timah Rd', transfers: 'DTL / NEL', status: 'next', passedText: 'Stop 18 • Little India', etaDiff: '+18 mins' },
        { stopCode: '75009', name: 'Tampines Int', road: 'Tampines Central 1', transfers: 'EWL / DTL', status: 'next', passedText: 'Stop 48 • Terminus', etaDiff: '+50 mins' },
      ],
    },
    direction2: {
      destination: 'To HarbourFront Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', status: 'current', passedText: 'Stop 20 of 48', etaDiff: '5 mins' },
        { stopCode: '14149', name: 'Opp Great World City', road: 'Kim Seng Rd', transfers: 'TEL', status: 'next', passedText: 'Stop 24 • River Valley', etaDiff: '+11 mins' },
        { stopCode: '14009', name: 'HarbourFront Int', road: 'Seah Im Rd', transfers: 'NEL / CCL', status: 'next', passedText: 'Stop 48 • Terminus', etaDiff: '+38 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '2',
        etaSub: 'mins',
        minutes: 2,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 62,
        vehiclePlate: 'SBS7448H',
        locationStatus: 'Passing Paterson Hill',
      },
      {
        etaDisplay: '9',
        etaSub: 'mins',
        minutes: 9,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 40,
        vehiclePlate: 'SBS3982A',
        locationStatus: 'Dep Tanglin Mall',
      },
      {
        etaDisplay: '18',
        etaSub: 'mins',
        minutes: 18,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 88,
        vehiclePlate: 'SBS8112S',
        locationStatus: 'Queensway Flyover',
      },
    ],
  },
  '16': {
    serviceNo: '16',
    destination: 'Bedok Int',
    routeType: 'Trunk',
    firstBus: '05:45',
    lastBus: '23:30',
    frequency: '8-12 mins',
    viaDescription: 'Via Bras Basah, Marine Parade, Joo Chiat, Bedok South',
    direction1: {
      destination: 'To Bedok Int',
      stops: [
        { stopCode: '09111', name: 'Opp Four Seasons Hotel', road: 'Orchard Blvd', status: 'passed', passedText: 'Stop 8 • Passed' },
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', transfers: 'NSL / TEL', status: 'current', passedText: 'Stop 9 of 41', etaDiff: '4 mins' },
        { stopCode: '08031', name: 'Dhoby Ghaut Stn', road: 'Orchard Rd', status: 'next', passedText: 'Stop 11 • Dhoby Ghaut', etaDiff: '+9 mins' },
        { stopCode: '92049', name: 'Parkway Parade', road: 'Marine Parade Rd', status: 'next', passedText: 'Stop 25 • Marine Parade', etaDiff: '+28 mins' },
      ],
    },
    direction2: {
      destination: 'To Bukit Merah Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 15 of 39', etaDiff: '6 mins' },
        { stopCode: '10009', name: 'Bukit Merah Int', road: 'Bt Merah Central', status: 'next', passedText: 'Stop 39 • Terminus', etaDiff: '+35 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '4',
        etaSub: 'mins',
        minutes: 4,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 32,
        vehiclePlate: 'SBS6020L',
        locationStatus: 'Turning into Orchard Blvd',
      },
      {
        etaDisplay: '12',
        etaSub: 'mins',
        minutes: 12,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 55,
        vehiclePlate: 'SBS3100B',
        locationStatus: 'Tiong Bahru Plaza',
      },
      {
        etaDisplay: '22',
        etaSub: 'mins',
        minutes: 22,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 28,
        vehiclePlate: 'SBS3501X',
        locationStatus: 'Bukit Merah Depot',
      },
    ],
  },
  '175': {
    serviceNo: '175',
    destination: 'Lor 1 Geylang Ter',
    routeType: 'Trunk',
    firstBus: '06:00',
    lastBus: '23:55',
    frequency: '10-14 mins',
    viaDescription: 'Via Clarke Quay, City Hall, Bugis, Kallang',
    direction1: {
      destination: 'To Lor 1 Geylang Ter',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 16 of 42', etaDiff: '9 mins' },
        { stopCode: '04211', name: 'Clarke Quay Stn', road: 'Eu Tong Sen St', status: 'next', passedText: 'Stop 20 • Clarke Quay', etaDiff: '+14 mins' },
        { stopCode: '01019', name: 'Bras Basah Complex', road: 'Victoria St', status: 'next', passedText: 'Stop 24 • Bugis', etaDiff: '+22 mins' },
      ],
    },
    direction2: {
      destination: 'To Clementi Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 19 of 42', etaDiff: '8 mins' },
        { stopCode: '17009', name: 'Clementi Int', road: 'Clementi Ave 3', status: 'next', passedText: 'Stop 42 • Terminus', etaDiff: '+36 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '9',
        etaSub: 'mins',
        minutes: 9,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 44,
        vehiclePlate: 'SBS6611G',
        locationStatus: 'Queensway Shopping Ctr',
      },
      {
        etaDisplay: '21',
        etaSub: 'mins',
        minutes: 21,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 66,
        vehiclePlate: 'SBS6689K',
        locationStatus: 'Commonwealth Ave',
      },
      {
        etaDisplay: '33',
        etaSub: 'mins',
        minutes: 33,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 91,
        vehiclePlate: 'SBS7780D',
        locationStatus: 'Clementi Depot',
      },
    ],
  },
  '5': {
    serviceNo: '5',
    destination: 'Pasir Ris Int',
    routeType: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:45',
    frequency: '8-12 mins',
    viaDescription: 'Via Novena, Toa Payoh, MacPherson, Eunos, Simei',
    direction1: {
      destination: 'To Pasir Ris Int',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 14 of 52', etaDiff: '11 mins' },
        { stopCode: '50038', name: 'Novena Stn', road: 'Thomson Rd', status: 'next', passedText: 'Stop 19 • Novena', etaDiff: '+16 mins' },
        { stopCode: '52009', name: 'Toa Payoh Int', road: 'Lor 6 Toa Payoh', status: 'next', passedText: 'Stop 25 • Toa Payoh', etaDiff: '+28 mins' },
        { stopCode: '77009', name: 'Pasir Ris Int', road: 'Pasir Ris Dr 3', status: 'next', passedText: 'Stop 52 • Terminus', etaDiff: '+62 mins' },
      ],
    },
    direction2: {
      destination: 'To Bt Merah Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 22 of 50', etaDiff: '3 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '11',
        etaSub: 'mins',
        minutes: 11,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 86,
        vehiclePlate: 'SBS3800Z',
        locationStatus: 'Tanglin Rd Junction',
      },
      {
        etaDisplay: '20',
        etaSub: 'mins',
        minutes: 20,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 38,
        vehiclePlate: 'SBS3801X',
        locationStatus: 'Bukit Merah Town Ctr',
      },
      {
        etaDisplay: '31',
        etaSub: 'mins',
        minutes: 31,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 65,
        vehiclePlate: 'SBS6222T',
        locationStatus: 'Henderson Rd',
      },
    ],
  },
  '54': {
    serviceNo: '54',
    destination: 'Bishan Int',
    routeType: 'Trunk',
    firstBus: '06:00',
    lastBus: '23:45',
    frequency: '9-13 mins',
    viaDescription: 'Via Newton, Thomson, Marymount, Bishan St 22',
    direction1: {
      destination: 'To Bishan Int',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 15 of 38', etaDiff: '14 mins' },
        { stopCode: '40049', name: 'Newton Stn Exit B', road: 'Scotts Rd', status: 'next', passedText: 'Stop 18 • Newton', etaDiff: '+19 mins' },
        { stopCode: '53009', name: 'Bishan Int', road: 'Bishan St 13', status: 'next', passedText: 'Stop 38 • Terminus', etaDiff: '+44 mins' },
      ],
    },
    direction2: {
      destination: 'To New Bridge Rd Ter',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 16 of 38', etaDiff: '7 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '14',
        etaSub: 'mins',
        minutes: 14,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 42,
        vehiclePlate: 'SBS6590U',
        locationStatus: 'Near Zion Rd Hawker Ctr',
      },
      {
        etaDisplay: '26',
        etaSub: 'mins',
        minutes: 26,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 71,
        vehiclePlate: 'SBS3200M',
        locationStatus: 'River Valley Rd',
      },
      {
        etaDisplay: '37',
        etaSub: 'mins',
        minutes: 37,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 25,
        vehiclePlate: 'SBS3201K',
        locationStatus: 'Clarke Quay Central',
      },
    ],
  },
  '174': {
    serviceNo: '174',
    destination: 'New Bridge Rd Ter',
    routeType: 'Trunk',
    firstBus: '05:30',
    lastBus: '23:30',
    frequency: '8-12 mins',
    viaDescription: 'Via Farrer Rd, Orchard, Dhoby Ghaut, Chinatown',
    direction1: {
      destination: 'To New Bridge Rd Ter',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 22 of 45', etaDiff: '6 mins' },
        { stopCode: '08031', name: 'Dhoby Ghaut Stn', road: 'Orchard Rd', status: 'next', passedText: 'Stop 24 • Dhoby Ghaut', etaDiff: '+11 mins' },
      ],
    },
    direction2: {
      destination: 'To Boon Lay Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 23 of 45', etaDiff: '9 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '6',
        etaSub: 'mins',
        minutes: 6,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 48,
        vehiclePlate: 'SBS3909J',
        locationStatus: 'Tanglin Halt',
      },
      {
        etaDisplay: '15',
        etaSub: 'mins',
        minutes: 15,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 74,
        vehiclePlate: 'SBS3910D',
        locationStatus: 'Farrer Rd Stn',
      },
      {
        etaDisplay: '24',
        etaSub: 'mins',
        minutes: 24,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 89,
        vehiclePlate: 'SBS8700Y',
        locationStatus: 'Bukit Timah Plaza',
      },
    ],
  },
  '7': {
    serviceNo: '7',
    destination: 'Bedok Int',
    routeType: 'Trunk',
    firstBus: '05:45',
    lastBus: '23:55',
    frequency: '6-9 mins',
    viaDescription: 'Via Orchard, Dhoby Ghaut, Bugis, Geylang Rd, Eunos',
    direction1: {
      destination: 'To Bedok Int',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 15 of 40', etaDiff: '5 mins' },
        { stopCode: '08031', name: 'Dhoby Ghaut Stn', road: 'Orchard Rd', status: 'next', passedText: 'Stop 17 • Dhoby Ghaut', etaDiff: '+10 mins' },
      ],
    },
    direction2: {
      destination: 'To Clementi Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 18 of 40', etaDiff: '3 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '5',
        etaSub: 'mins',
        minutes: 5,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 36,
        vehiclePlate: 'SBS7500T',
        locationStatus: 'Passing Delfi Orchard',
      },
      {
        etaDisplay: '11',
        etaSub: 'mins',
        minutes: 11,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 60,
        vehiclePlate: 'SBS7501R',
        locationStatus: 'Tanglin Mall',
      },
      {
        etaDisplay: '19',
        etaSub: 'mins',
        minutes: 19,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 22,
        vehiclePlate: 'SBS6101D',
        locationStatus: 'Holland Village',
      },
    ],
  },
  '100': {
    serviceNo: '100',
    destination: 'Serangoon Int',
    routeType: 'Trunk',
    firstBus: '05:45',
    lastBus: '23:45',
    frequency: '8-12 mins',
    viaDescription: 'Via Alexandra, Shenton Way, Beach Rd, Geylang, Upper Serangoon',
    direction1: {
      destination: 'To Serangoon Int',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 18 of 50', etaDiff: '8 mins' },
      ],
    },
    direction2: {
      destination: 'To Ghim Moh Ter',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 22 of 50', etaDiff: '4 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '8',
        etaSub: 'mins',
        minutes: 8,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 41,
        vehiclePlate: 'SBS6330H',
        locationStatus: 'Queensway',
      },
      {
        etaDisplay: '17',
        etaSub: 'mins',
        minutes: 17,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 63,
        vehiclePlate: 'SBS3400S',
        locationStatus: 'Buona Vista Flyover',
      },
      {
        etaDisplay: '29',
        etaSub: 'mins',
        minutes: 29,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Limited Standing',
        occupancyPercent: 88,
        vehiclePlate: 'SBS3401P',
        locationStatus: 'Ghim Moh Terminal',
      },
    ],
  },
  '123': {
    serviceNo: '123',
    destination: 'Beach Station Bus Terminal (Sentosa)',
    routeType: 'Trunk',
    firstBus: '06:00',
    lastBus: '23:45',
    frequency: '9-13 mins',
    viaDescription: 'Via Tiong Bahru, Bukit Purmei, VivoCity, Sentosa Gateway',
    direction1: {
      destination: 'To Beach Station (Sentosa)',
      stops: [
        { stopCode: '09023', name: 'Opp Orchard Stn / ION', road: 'Orchard Blvd', status: 'current', passedText: 'Stop 12 of 36', etaDiff: '10 mins' },
      ],
    },
    direction2: {
      destination: 'To Bukit Merah Int',
      stops: [
        { stopCode: '09022', name: 'Orchard Stn', road: 'Orchard Rd', status: 'current', passedText: 'Stop 14 of 36', etaDiff: '6 mins' },
      ],
    },
    arrivals: [
      {
        etaDisplay: '10',
        etaSub: 'mins',
        minutes: 10,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 45,
        vehiclePlate: 'SBS6440C',
        locationStatus: 'Newton Circus',
      },
      {
        etaDisplay: '21',
        etaSub: 'mins',
        minutes: 21,
        type: 'Double Deck (DD)',
        wab: true,
        occupancy: 'Standing Available',
        occupancyPercent: 70,
        vehiclePlate: 'SBS3611M',
        locationStatus: 'Novena Square',
      },
      {
        etaDisplay: '33',
        etaSub: 'mins',
        minutes: 33,
        type: 'Single Deck (SD)',
        wab: true,
        occupancy: 'Seats Available',
        occupancyPercent: 30,
        vehiclePlate: 'SBS6442Y',
        locationStatus: 'Balestier Rd',
      },
    ],
  },
};

export const SERVICE_ALERTS: ServiceAlert[] = [
  {
    id: 'ALT-2026-081',
    category: 'Trunk',
    severity: 'Normal',
    title: 'Regular Headway Across All SBS Transit Trunk & Feeder Routes',
    description: 'Buses are operating smoothly on scheduled 5 to 11 minute headways during off-peak hours across central and regional corridors.',
    affectedServices: ['All SBS Transit Services'],
    updatedTime: '10 mins ago',
    status: 'Active',
  },
  {
    id: 'ALT-2026-079',
    category: 'Diversion',
    severity: 'Diversion',
    title: 'Temporary Bus Route Diversion Along Marina Centre & Bayfront',
    description: 'Due to road closure for civic sporting event, Services 10, 14, 16, 70, and 196 will skip bus stops along Nicoll Highway and Stamford Road this Sunday.',
    affectedServices: ['10', '14', '16', '70', '196'],
    updatedTime: '1 hour ago',
    status: 'Active',
  },
  {
    id: 'ALT-2026-074',
    category: 'Downtown Line',
    severity: 'Normal',
    title: 'Downtown Line (DTL) Regular Train Frequencies Maintained',
    description: 'All DTL train departures connecting Bugis, Newton, and Chinatown are maintaining 3-minute headways. Inter-modal transfers normal.',
    affectedServices: ['DTL', 'Bus 65', 'Bus 175'],
    updatedTime: '2 hours ago',
    status: 'Active',
  },
  {
    id: 'ALT-2026-068',
    category: 'General',
    severity: 'Advisory',
    title: 'Wheelchair Ramp Maintenance on Double Deck Units SBS3400-series',
    description: 'Preventative hydraulic servicing scheduled at Bedok & Ang Mo Kio depots. 100% WAB certified spare fleet assigned to guarantee barrier-free access.',
    affectedServices: ['14', '65', '174'],
    updatedTime: 'Yesterday',
    status: 'Active',
  },
];

export const TRIP_PLANS: Record<string, TripPlanOption[]> = {
  'default': [
    {
      id: 'plan-1',
      title: 'Direct Bus 14 via Somerset & Dhoby Ghaut',
      durationMins: 38,
      fare: 'S$ 1.84 (Adult EZ-Link)',
      walkingMins: 3,
      tag: 'Direct Bus',
      steps: [
        { type: 'walk', instruction: 'Walk 110m to Opp Orchard Stn (09023)', detail: '2 min walk from ION Orchard', durationMins: 2 },
        { type: 'bus', instruction: 'Board SBS Bus 14 towards Bedok Temp Int', detail: 'Ride 28 stops • Low floor Double Deck • Seats Available', durationMins: 34, serviceNo: '14', stopsCount: 28, color: '#801D78' },
        { type: 'walk', instruction: 'Alight at Bedok Temp Int (84009)', detail: 'Connect to Bedok Mall & East West Line', durationMins: 2 },
      ],
    },
    {
      id: 'plan-2',
      title: 'Fastest: MRT North South Line + East West Line',
      durationMins: 29,
      fare: 'S$ 1.92 (Adult EZ-Link)',
      walkingMins: 5,
      tag: 'Fastest',
      steps: [
        { type: 'walk', instruction: 'Enter ION Orchard Exit 4 to Orchard MRT (NS22)', detail: '1 min sheltered walk', durationMins: 1 },
        { type: 'mrt', instruction: 'North South Line towards Marina South Pier', detail: '2 stops to City Hall (NS25 / EW13)', durationMins: 6, color: '#D42E12' },
        { type: 'mrt', instruction: 'Cross-platform transfer to East West Line towards Pasir Ris', detail: '9 stops to Bedok (EW5)', durationMins: 19, color: '#009640' },
        { type: 'walk', instruction: 'Exit Bedok MRT to Interchange', detail: '3 min walk', durationMins: 3 },
      ],
    },
    {
      id: 'plan-3',
      title: 'Scenic: Bus 65 to Little India + Bus 7',
      durationMins: 46,
      fare: 'S$ 1.88 (Adult EZ-Link)',
      walkingMins: 4,
      tag: 'Fewest Transfers',
      steps: [
        { type: 'walk', instruction: 'Walk to Opp Orchard Stn (09023)', detail: '2 min walk', durationMins: 2 },
        { type: 'bus', instruction: 'Board Bus 65 towards Tampines', detail: 'Ride 7 stops to Peace Ctr', durationMins: 14, serviceNo: '65', stopsCount: 7, color: '#801D78' },
        { type: 'bus', instruction: 'Transfer to Bus 7 towards Bedok Int', detail: 'Ride 18 stops along Victoria St and Geylang', durationMins: 27, serviceNo: '7', stopsCount: 18, color: '#801D78' },
        { type: 'walk', instruction: 'Arrive at Bedok Interchange', detail: '1 min walk', durationMins: 1 },
      ],
    },
  ],
};

export const TRANSLATIONS = {
  EN: {
    brandSubtitle: 'BUS TRACKER LIVE',
    nearestStop: 'Nearest Stop',
    away: 'away',
    walk: 'walk',
    barrierFree: 'Barrier Free',
    refreshesIn: 'Refreshes in',
    changeStop: 'Change Stop',
    checkTiming: 'Check Timing',
    searchPlaceholder: 'Enter Bus Service No. (e.g. 14, 65, 174, 190) or Stop Code',
    quickAccess: 'QUICK ACCESS:',
    upcomingArrivals: 'Upcoming Arrivals',
    liveTelemetry: 'Live LTA Telemetry API',
    firstBus: '1ST BUS',
    secondBus: '2ND BUS',
    thirdBus: '3RD BUS',
    doubleDeck: 'Double Deck (DD)',
    singleDeck: 'Single Deck (SD)',
    seatsAvailable: 'Seats Available',
    standingAvailable: 'Standing Available',
    limitedStanding: 'Limited Standing',
    approaching: 'Approaching stop',
    notifyText: 'Get notified before Bus arrives at stop',
    notifyBtn: 'Notify 2 mins before',
    routeProgress: 'Route Progress & Live Vehicles',
    yourLocation: 'YOUR LOCATION',
    transitHub: 'Orchard Transit Hub',
    allServices: 'All Services at this Stop',
    wheelchairFleet: '100% Wheelchair Accessible Fleet',
    wheelchairFleetDesc: 'All SBS Transit scheduled buses deploy low-floor ramps with dedicated passenger-in-wheelchair (PIW) berths. Priority boarding is enforced at all terminals.',
    advisoryText: 'Network Advisory: All SBS Transit trunk, feeder and express routes operating at scheduled headways.',
  },
  CN: {
    brandSubtitle: '实时巴士追踪系统',
    nearestStop: '最近巴士站',
    away: '距离',
    walk: '步行',
    barrierFree: '无障碍通行',
    refreshesIn: '刷新倒计时',
    changeStop: '更换站点',
    checkTiming: '查询到站时间',
    searchPlaceholder: '输入巴士路线号 (例如 14, 65, 174) 或 站点编号',
    quickAccess: '快速选择：',
    upcomingArrivals: '即将到站巴士',
    liveTelemetry: '陆路交通管理局实时数据',
    firstBus: '第一班车',
    secondBus: '第二班车',
    thirdBus: '第三班车',
    doubleDeck: '双层巴士 (DD)',
    singleDeck: '单层巴士 (SD)',
    seatsAvailable: '有座位',
    standingAvailable: '有站位',
    limitedStanding: '站位拥挤',
    approaching: '正接近站点',
    notifyText: '巴士进站前提醒我',
    notifyBtn: '提前2分钟提醒',
    routeProgress: '路线进度与实时车辆位置',
    yourLocation: '您的当前位置',
    transitHub: '乌节路交通换乘枢纽',
    allServices: '途经本站的所有路线',
    wheelchairFleet: '100% 轮椅无障碍车队',
    wheelchairFleetDesc: '新捷运所有运营巴士均配备低地板登车斜坡与专用轮椅停放区，并在各巴士总站严格执行优先登车机制。',
    advisoryText: '网络通告：新捷运所有干线、支线及快捷巴士均按准点班次平稳运营。',
  },
  MY: {
    brandSubtitle: 'PENJEJAK BAS LANGSUNG',
    nearestStop: 'Hentian Terdekat',
    away: 'jarak',
    walk: 'jalan kaki',
    barrierFree: 'Mesra Kerusi Roda',
    refreshesIn: 'Kemas kini dalam',
    changeStop: 'Tukar Hentian',
    checkTiming: 'Semak Masa',
    searchPlaceholder: 'Masukkan No. Bas (cth. 14, 65, 174) atau Kod Hentian',
    quickAccess: 'PILIHAN PANTAS:',
    upcomingArrivals: 'Ketibaan Seterusnya',
    liveTelemetry: 'Telemetri Langsung LTA',
    firstBus: 'BAS PERTAMA',
    secondBus: 'BAS KEDUA',
    thirdBus: 'BAS KETIGA',
    doubleDeck: 'Dua Tingkat (DD)',
    singleDeck: 'Satu Tingkat (SD)',
    seatsAvailable: 'Tempat Duduk Kosong',
    standingAvailable: 'Ruang Berdiri',
    limitedStanding: 'Berdiri Terhad',
    approaching: 'Menghampiri hentian',
    notifyText: 'Dapatkan pemberitahuan sebelum bas tiba',
    notifyBtn: 'Ingatkan 2 minit sebelum',
    routeProgress: 'Kemajuan Laluan & Bas Langsung',
    yourLocation: 'LOKASI ANDA',
    transitHub: 'Hab Transit Orchard',
    allServices: 'Semua Laluan di Hentian Ini',
    wheelchairFleet: '100% Armada Boleh Diakses Kerusi Roda',
    wheelchairFleetDesc: 'Semua bas berjadual SBS Transit dilengkapi tanjakan lantai rendah dan ruang khas penumpang berkerusi roda.',
    advisoryText: 'Nasihat Rangkaian: Semua perkhidmatan SBS Transit beroperasi mengikut jadual yang ditetapkan.',
  },
  TA: {
    brandSubtitle: 'நேரலை பேருந்து கண்காணிப்பு',
    nearestStop: 'அருகிலுள்ள நிறுத்தம்',
    away: 'தொலைவு',
    walk: 'நடைபயணம்',
    barrierFree: 'சக்கர நாற்காலி அணுகல்',
    refreshesIn: 'புதுப்பிக்கப்படும் நேரம்',
    changeStop: 'நிறுத்தத்தை மாற்று',
    checkTiming: 'நேரத்தை சரிபார்க்கவும்',
    searchPlaceholder: 'பேருந்து எண் அல்லது நிறுத்தக் குறியீட்டை உள்ளிடவும்',
    quickAccess: 'விரைவு அணுகல்:',
    upcomingArrivals: 'அடுத்து வரும் பேருந்துகள்',
    liveTelemetry: 'LTA நேரலை தரவுத்தளம்',
    firstBus: '1வது பேருந்து',
    secondBus: '2வது பேருந்து',
    thirdBus: '3வது பேருந்து',
    doubleDeck: 'இரட்டை அடுக்கு (DD)',
    singleDeck: 'ஒற்றை அடுக்கு (SD)',
    seatsAvailable: 'இருக்கைகள் உள்ளன',
    standingAvailable: 'நிற்க இடமுள்ளது',
    limitedStanding: 'குறைந்த இடமே உள்ளது',
    approaching: 'நிறுத்தத்தை நெருங்குகிறது',
    notifyText: 'பேருந்து வருவதற்கு முன் நினைவூட்டு',
    notifyBtn: '2 நிமிடத்திற்கு முன் நினைவூட்டு',
    routeProgress: 'வழித்தட முன்னேற்றம் & நேரலை பேருந்துகள்',
    yourLocation: 'உங்கள் இருப்பிடம்',
    transitHub: 'ஆர்ச்சர்ட் போக்குவரத்து மையம்',
    allServices: 'இந்த நிறுத்தத்தில் அனைத்து சேவைகளும்',
    wheelchairFleet: '100% சக்கர நாற்காலி அணுகக்கூடிய பேருந்துகள்',
    wheelchairFleetDesc: 'அனைத்து எஸ்பிஎஸ் டிரான்சிட் பேருந்துகளும் மாற்றுத்திறனாளிகளுக்கான தாழ்தள சாய்வுதள வசதியைக் கொண்டுள்ளன.',
    advisoryText: 'அனைத்து எஸ்பிஎஸ் டிரான்சிட் பேருந்துகளும் அட்டவணைப்படி சீராக இயங்குகின்றன.',
  },
};
