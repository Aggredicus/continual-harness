export const megaCorpCards = [
  {
    id: 'land_grab', name: 'Land Grab', faction: 'megaCorp', type: 'control', cost: { money: 1, influence: 1 },
    validTargets: ['grassland','farm_field','degraded_lot','upland_forest','neighborhood'], profit: 2,
    effects: [{ type: 'claim', owner: 'megaCorp' }, { type: 'mega', values: { corporateControl: 4, profit: 2 } }, { type: 'global', global: { climatePressure: 1 } }]
  },
  {
    id: 'clearcut', name: 'Clearcut', faction: 'megaCorp', type: 'extraction', cost: { energy: 1, labor: 1 },
    validTargets: ['mature_oak','young_oak','upland_forest'], profit: 6,
    effects: [{ type: 'setTile', tile: 'bare_soil', owner: 'megaCorp', age: 0 }, { type: 'mega', values: { profit: 6, corporateControl: 2 } }, { type: 'global', global: { climatePressure: 4, floodRisk: 3, heatRisk: 2, erosionLoad: 4 } }]
  },
  {
    id: 'pave', name: 'Pave', faction: 'megaCorp', type: 'infrastructure', cost: { money: 2, energy: 1 },
    validTargets: ['grassland','farm_field','degraded_lot','bare_soil'], profit: 3,
    effects: [{ type: 'setTile', tile: 'pavement', owner: 'megaCorp' }, { type: 'mega', values: { profit: 3, corporateControl: 4 } }, { type: 'global', global: { climatePressure: 3, floodRisk: 3, heatRisk: 4 } }]
  },
  {
    id: 'warehouse', name: 'Warehouse', faction: 'megaCorp', type: 'infrastructure', cost: { money: 3, energy: 1, labor: 1 },
    validTargets: ['pavement','degraded_lot','farm_field','bare_soil'], profit: 8,
    effects: [{ type: 'setTile', tile: 'warehouse', owner: 'megaCorp' }, { type: 'mega', values: { profit: 8, corporateControl: 6 } }, { type: 'global', global: { climatePressure: 4, heatRisk: 5, pollutionLoad: 2 } }]
  },
  {
    id: 'drainage_ditch', name: 'Drainage Ditch', faction: 'megaCorp', type: 'water', cost: { labor: 1, money: 1 },
    validTargets: ['wetland','farm_field','grassland'], profit: 3,
    effects: [{ type: 'modifier', modifier: 'drainage_ditch' }, { type: 'hex', stats: { water: -3, biodiversity: -2, floodRisk: 2 } }, { type: 'mega', values: { profit: 3 } }, { type: 'global', global: { floodRisk: 2, watershedResilience: -2 } }]
  },
  {
    id: 'monocrop', name: 'Monocrop', faction: 'megaCorp', type: 'agriculture', cost: { money: 1, energy: 1 },
    validTargets: ['farm_field','grassland','bare_soil'], profit: 4,
    effects: [{ type: 'setTile', tile: 'monocrop', owner: 'megaCorp' }, { type: 'mega', values: { profit: 4, corporateControl: 2 } }, { type: 'global', global: { pollutionLoad: 2, erosionLoad: 2, climatePressure: 1 } }]
  },
  {
    id: 'pr_campaign', name: 'PR Campaign', faction: 'megaCorp', type: 'social', cost: { money: 2 },
    validTargets: ['any'], profit: 1,
    effects: [{ type: 'mega', values: { influence: 2, corporateControl: 1, profit: 1 } }]
  },
  {
    id: 'fertilizer_boost', name: 'Fertilizer Boost', faction: 'megaCorp', type: 'agriculture', cost: { money: 1 },
    validTargets: ['farm_field','monocrop'], profit: 4,
    effects: [{ type: 'hex', stats: { soil: 1, pollution: 3, biodiversity: -1 } }, { type: 'mega', values: { profit: 4 } }, { type: 'global', global: { pollutionLoad: 3 } }]
  },
  {
    id: 'extract_water', name: 'Extract Water', faction: 'megaCorp', type: 'water', cost: { energy: 1 },
    validTargets: ['river','wetland','floodplain'], profit: 4,
    effects: [{ type: 'hex', stats: { water: -3, biodiversity: -1 } }, { type: 'mega', values: { profit: 4, corporateControl: 1 } }, { type: 'global', global: { droughtRisk: 2, watershedResilience: -1 } }]
  },
  {
    id: 'lobbying', name: 'Lobbying', faction: 'megaCorp', type: 'policy', cost: { money: 2 },
    validTargets: ['any'], profit: 2,
    effects: [{ type: 'mega', values: { influence: 3, corporateControl: 2, profit: 2 } }]
  }
];
