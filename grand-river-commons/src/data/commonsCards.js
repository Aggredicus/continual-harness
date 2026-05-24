export const commonsCards = [
  {
    id: 'observe_site', name: 'Observe Site', faction: 'commons', type: 'survey', cost: {},
    validTargets: ['any'], text: 'Study a hex. Gain knowledge, trust, and a clearer design path.',
    effects: [{ type: 'resources', resources: { trust: 1 } }, { type: 'ethics', ethics: { peopleCare: 1 } }]
  },
  {
    id: 'gather_biomass', name: 'Gather Biomass', faction: 'commons', type: 'harvest', cost: { labor: 1 },
    validTargets: ['grassland','farm_field','mature_oak','young_oak','wetland'], text: 'Collect leaves, sticks, weeds, and prunings without degrading the system.',
    effects: [{ type: 'resources', resources: { biomass: 2 } }]
  },
  {
    id: 'plant_oak_sapling', name: 'Plant Oak Sapling', faction: 'commons', type: 'plant', cost: { labor: 1, water: 1 },
    validTargets: ['grassland','bare_soil','degraded_lot','farm_field'], text: 'Plant a native oak sapling that matures into a resilient canopy tree.',
    effects: [{ type: 'setTile', tile: 'oak_sapling', owner: 'commons', age: 0 }, { type: 'hex', stats: { biodiversity: 1, heat: -1 } }, { type: 'ethics', ethics: { earthCare: 2, peopleCare: 1 } }]
  },
  {
    id: 'compost_pile', name: 'Compost Pile', faction: 'commons', type: 'soil', cost: { biomass: 2, labor: 1 },
    validTargets: ['grassland','farm_field','degraded_lot','garden_bed','bare_soil'], text: 'Turn organic matter into fertility. Matures after two turns.',
    effects: [{ type: 'setTile', tile: 'compost_pile', owner: 'commons', age: 0 }, { type: 'ethics', ethics: { earthCare: 1, fairShare: 1 } }]
  },
  {
    id: 'mulch', name: 'Mulch', faction: 'commons', type: 'soil', cost: { biomass: 1, labor: 1 },
    validTargets: ['grassland','farm_field','degraded_lot','bare_soil','garden_bed','oak_sapling','young_oak'], text: 'Cover soil, retain moisture, reduce heat, and prevent erosion.',
    effects: [{ type: 'modifier', modifier: 'mulched' }, { type: 'hex', stats: { soil: 1, water: 1, heat: -1, erosionRisk: -2 } }, { type: 'ethics', ethics: { earthCare: 1 } }]
  },
  {
    id: 'build_pathway', name: 'Build Pathway', faction: 'commons', type: 'access', cost: { wood: 1, labor: 1 },
    validTargets: ['grassland','bare_soil','degraded_lot','farm_field'], text: 'Create low-impact access through the site.',
    effects: [{ type: 'setTile', tile: 'pathway', owner: 'commons' }, { type: 'ethics', ethics: { peopleCare: 2, fairShare: 1 } }]
  },
  {
    id: 'community_workday', name: 'Community Workday', faction: 'commons', type: 'social', cost: { trust: 1 },
    validTargets: ['any'], text: 'Neighbors gather to help. Gain labor and fair-share momentum.',
    effects: [{ type: 'resources', resources: { labor: 3 } }, { type: 'ethics', ethics: { peopleCare: 1, fairShare: 2 } }]
  },
  {
    id: 'swale', name: 'Swale', faction: 'commons', type: 'water', cost: { labor: 2 },
    validTargets: ['grassland','farm_field','degraded_lot','bare_soil'], text: 'Slow, spread, and sink stormwater along contour.',
    effects: [{ type: 'modifier', modifier: 'swale' }, { type: 'hex', stats: { water: 2, floodRisk: -2, erosionRisk: -2 } }, { type: 'global', global: { watershedResilience: 3, floodRisk: -2 } }, { type: 'ethics', ethics: { earthCare: 2, peopleCare: 1 } }]
  },
  {
    id: 'garden_bed', name: 'Garden Bed', faction: 'commons', type: 'food', cost: { compost: 1, labor: 1, water: 1 },
    validTargets: ['grassland','farm_field','degraded_lot','bare_soil'], text: 'Create a food-producing garden bed.',
    effects: [{ type: 'setTile', tile: 'garden_bed', owner: 'commons' }, { type: 'resources', resources: { food: 1 } }, { type: 'ethics', ethics: { peopleCare: 2, fairShare: 1 } }]
  },
  {
    id: 'solar_charger', name: 'Solar Charger', faction: 'commons', type: 'energy', cost: { money: 2, labor: 1 },
    validTargets: ['grassland','degraded_lot','pathway','neighborhood'], text: 'Install small solar infrastructure for clean recurring energy.',
    effects: [{ type: 'modifier', modifier: 'solar_charger' }, { type: 'resources', resources: { energy: 2 } }, { type: 'global', global: { climatePressure: -1 } }, { type: 'ethics', ethics: { earthCare: 1, peopleCare: 1 } }]
  }
];
