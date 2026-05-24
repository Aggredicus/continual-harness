export const natureEvents = [
  {
    id: 'light_rain', name: 'Light Rain', type: 'blessing',
    text: 'Gentle rain recharges soil moisture and supports young plantings.',
    resolve: 'rain_light'
  },
  {
    id: 'heavy_rain', name: 'Heavy Rain', type: 'risk',
    text: 'A strong storm tests bare soil, pavement, wetlands, and swales.',
    resolve: 'rain_heavy'
  },
  {
    id: 'drought', name: 'Drought', type: 'risk',
    text: 'Dry weather stresses shallow-rooted and unmulched systems.',
    resolve: 'drought'
  },
  {
    id: 'heat_wave', name: 'Heat Wave', type: 'risk',
    text: 'Heat intensifies around pavement and warehouses but is softened by canopy and water.',
    resolve: 'heat_wave'
  },
  {
    id: 'volunteer_seedlings', name: 'Volunteer Seedlings', type: 'blessing',
    text: 'Healthy nearby trees seed the next generation.',
    resolve: 'volunteer_seedlings'
  },
  {
    id: 'pest_pressure', name: 'Pest Pressure', type: 'risk',
    text: 'Simplified ecosystems suffer more than biodiverse guilds.',
    resolve: 'pest_pressure'
  },
  {
    id: 'pollinator_boom', name: 'Pollinator Boom', type: 'blessing',
    text: 'Pollinators increase food and biodiversity in healthy plantings.',
    resolve: 'pollinator_boom'
  },
  {
    id: 'windstorm', name: 'Windstorm', type: 'risk',
    text: 'Wind damages exposed systems but creates biomass and habitat.',
    resolve: 'windstorm'
  },
  {
    id: 'mushroom_flush', name: 'Mushroom Flush', type: 'blessing',
    text: 'Fungal networks accelerate decomposition and soil building.',
    resolve: 'mushroom_flush'
  },
  {
    id: 'flood_pulse', name: 'Flood Pulse', type: 'risk',
    text: 'The river claims low ground. Wetlands and swales absorb what pavement cannot.',
    resolve: 'flood_pulse'
  }
];
