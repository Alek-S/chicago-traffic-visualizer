const dataKey = {
  buses: {
    name: 'Buses',
    fromColor: '#A461A4',
    middleColor: '#17B8BE',
    toColor: '#3FDF00',
    description: 'Velocity within reported timeframe',
  },
  buildings: {
    name: 'Buildings',
    fromColor: '#13131A',
    middleColor: '#393976',
    toColor: '#5E5FD1',
    description: 'Year of construction',
  },
  pedestrians: {
    name: 'Pedestrians',
    fromColor: '#3BC12F',
    middleColor: '#7F9B25',
    toColor: '#C3741B',
    description: 'Number of passed pedestrians within timeframe',
  },
  potholes: {
    name: 'Potholes',
    fromColor: '#DE4234',
    middleColor: '#DE4234',
    toColor: '#DE4234',
    description: '311 service requests for open potholes',
  },
  population: {
    name: 'Population',
    fromColor: '#1A2020',
    middleColor: `#1D2F2F`,
    toColor: '#264C4B',
    description: 'Population level',
  },
  thermal: {
    name: 'Thermal',
    fromColor: '#2D1A2C',
    middleColor: '#3D1D3D',
    toColor: '#7F297E',
    description: 'Average natural gas usage',
  },
  electricity: {
    name: 'Electricity',
    fromColor: '#212119',
    middleColor: '#31351D',
    toColor: '#717D2E',
    description: 'Average electricty usage in kWh',
  }
};

export default dataKey;