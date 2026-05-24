import { clamp, getNeighbors, modifyHexStats } from './hexGrid.js';
import { addValues } from './cards.js';
import { log } from './state.js';

export function resolveNatureEvent(state, event) {
  const handlers = {
    rain_light: lightRain,
    rain_heavy: heavyRain,
    drought,
    heat_wave: heatWave,
    volunteer_seedlings: volunteerSeedlings,
    pest_pressure: pestPressure,
    pollinator_boom: pollinatorBoom,
    windstorm,
    mushroom_flush: mushroomFlush,
    flood_pulse: floodPulse
  };
  const handler = handlers[event.resolve];
  if (handler) handler(state);
  state.currentNatureEvent = event;
  log(state, `Mother Nature resolved ${event.name}: ${event.text}`);
}

export function updateGlobalScores(state) {
  const totals = state.hexes.reduce((acc, hex) => {
    acc.biodiversity += hex.biodiversity;
    acc.soil += hex.soil;
    acc.water += hex.water;
    acc.pollution += hex.pollution;
    acc.heat += hex.heat;
    acc.erosion += hex.erosionRisk;
    acc.flood += hex.floodRisk;
    if (hex.modifiers.includes('swale')) acc.swales += 1;
    if (hex.tile === 'wetland') acc.wetlands += 1;
    if (hex.tile === 'mature_oak' || hex.tile === 'young_oak') acc.trees += 1;
    if (hex.tile === 'pavement' || hex.tile === 'warehouse') acc.paved += 1;
    return acc;
  }, { biodiversity: 0, soil: 0, water: 0, pollution: 0, heat: 0, erosion: 0, flood: 0, swales: 0, wetlands: 0, trees: 0, paved: 0 });

  const resilience = Math.round((totals.biodiversity + totals.soil + totals.water) / 35 + totals.swales * 2 + totals.wetlands + totals.trees * 0.5 - totals.pollution / 25 - totals.paved * 0.5);
  state.global.watershedResilience = clamp(resilience, 0, 100);
  state.global.pollutionLoad = clamp(Math.round(totals.pollution / 12), 0, 100);
  state.global.erosionLoad = clamp(Math.round(totals.erosion / 12), 0, 100);
  state.global.heatRisk = clamp(Math.round(totals.heat / 12), 0, 100);
  state.global.floodRisk = clamp(Math.round(totals.flood / 12), 0, 100);
  state.global.climatePressure = clamp(state.global.climatePressure + Math.round((totals.paved + totals.pollution / 30 - totals.trees / 25 - totals.wetlands / 10) / 2), 0, 100);
}

export function resolveEcologicalAging(state) {
  state.hexes = state.hexes.map((hex) => {
    let next = { ...hex, tags: [...hex.tags], modifiers: [...hex.modifiers], age: hex.age + 1 };
    if (next.tile === 'oak_sapling' && next.age >= 3) {
      next.tile = 'young_oak';
      next.age = 0;
      next = modifyHexStats(next, { biodiversity: 2, heat: -1, soil: 1, water: 1 });
      log(state, `${hex.id} oak sapling matured into a young oak.`);
    } else if (next.tile === 'young_oak' && next.age >= 5) {
      next.tile = 'mature_oak';
      next.age = 0;
      next = modifyHexStats(next, { biodiversity: 3, heat: -2, soil: 2, water: 1 });
      log(state, `${hex.id} young oak matured into a mature oak.`);
    } else if (next.tile === 'compost_pile' && next.age >= 2) {
      next.tile = 'finished_compost';
      next.age = 0;
      state.players.commons.resources.compost += 2;
      next = modifyHexStats(next, { soil: 3, biodiversity: 1 });
      log(state, `${hex.id} compost finished and added fertility.`);
    }

    if (next.modifiers.includes('mulched')) next = modifyHexStats(next, { soil: 1, water: 1, erosionRisk: -1, heat: -1 });
    if (next.modifiers.includes('swale')) next = modifyHexStats(next, { water: 1, floodRisk: -1, erosionRisk: -1 });
    if (next.tile === 'bare_soil') next = modifyHexStats(next, { erosionRisk: 1, heat: 1 });
    if (next.tile === 'pavement' || next.tile === 'warehouse') next = modifyHexStats(next, { heat: 1, floodRisk: 1, water: -1 });
    if (next.tile === 'garden_bed') state.players.commons.resources.food += 1;
    if (next.tile === 'mature_oak') state.players.commons.resources.biomass += next.owner === 'commons' ? 1 : 0;
    return next;
  });
  updateGlobalScores(state);
}

function resilienceFactor(state) {
  const resilient = state.hexes.filter((h) => h.tile === 'wetland' || h.modifiers.includes('swale') || h.modifiers.includes('mulched') || h.tile === 'mature_oak' || h.biodiversity >= 6).length;
  const brittle = state.hexes.filter((h) => h.tile === 'pavement' || h.tile === 'warehouse' || h.tile === 'bare_soil' || h.tile === 'monocrop' || h.pollution >= 5).length;
  return { resilient, brittle, net: brittle - resilient };
}

function lightRain(state) {
  state.hexes = state.hexes.map((hex) => modifyHexStats(hex, { water: 1, soil: hex.modifiers.includes('mulched') ? 1 : 0 }));
  addValues(state.global, { droughtRisk: -2, watershedResilience: 1 });
}

function heavyRain(state) {
  const { net } = resilienceFactor(state);
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'bare_soil' || hex.tile === 'pavement' || hex.tile === 'warehouse') return modifyHexStats(hex, { erosionRisk: 2, floodRisk: 2, pollution: hex.tile === 'warehouse' ? 1 : 0 });
    if (hex.tile === 'wetland' || hex.modifiers.includes('swale') || hex.modifiers.includes('mulched')) return modifyHexStats(hex, { water: 2, floodRisk: -2, erosionRisk: -1 });
    return modifyHexStats(hex, { water: 1 });
  });
  addValues(state.global, { floodRisk: Math.max(0, Math.round(net / 10)), climatePressure: Math.max(0, Math.round(net / 20)) });
}

function drought(state) {
  state.hexes = state.hexes.map((hex) => {
    const protectedSoil = hex.modifiers.includes('mulched') || hex.modifiers.includes('swale') || hex.soil >= 6;
    if (protectedSoil || hex.tile === 'mature_oak' || hex.tile === 'wetland') return modifyHexStats(hex, { water: -1 });
    return modifyHexStats(hex, { water: -3, biodiversity: -1, heat: 1 });
  });
  addValues(state.global, { droughtRisk: 4, climatePressure: 2 });
}

function heatWave(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'pavement' || hex.tile === 'warehouse' || hex.tile === 'bare_soil') return modifyHexStats(hex, { heat: 3, water: -2 });
    if (hex.tile === 'mature_oak' || hex.tile === 'wetland') return modifyHexStats(hex, { heat: -1 });
    return modifyHexStats(hex, { heat: 1, water: -1 });
  });
  addValues(state.global, { heatRisk: 4, climatePressure: 2 });
}

function volunteerSeedlings(state) {
  const forests = state.hexes.filter((hex) => hex.tile === 'mature_oak' || hex.tile === 'young_oak');
  for (const forest of forests.slice(0, 5)) {
    const target = getNeighbors(forest, state.hexes).find((h) => ['grassland', 'bare_soil', 'degraded_lot'].includes(h.tile));
    if (target) target.tile = 'oak_sapling', target.owner = 'neutral', target.age = 0, target.biodiversity = clamp(target.biodiversity + 1);
  }
  addValues(state.global, { watershedResilience: 2 });
}

function pestPressure(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'monocrop') return modifyHexStats(hex, { biodiversity: -2, soil: -1 });
    if (hex.biodiversity >= 5) return modifyHexStats(hex, { biodiversity: 1 });
    return hex;
  });
}

function pollinatorBoom(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'garden_bed' || hex.tile === 'mature_oak' || hex.biodiversity >= 5) return modifyHexStats(hex, { biodiversity: 1 });
    return hex;
  });
  state.players.commons.resources.food += 2;
  addValues(state.global, { watershedResilience: 2 });
}

function windstorm(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'mature_oak' && Math.random() < 0.05) {
      state.players.commons.resources.wood += hex.owner === 'commons' ? 2 : 0;
      return { ...hex, tile: 'fallen_log', age: 0, biodiversity: clamp(hex.biodiversity + 2) };
    }
    return hex;
  });
  state.players.commons.resources.biomass += 2;
}

function mushroomFlush(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.tile === 'finished_compost' || hex.tile === 'fallen_log' || hex.modifiers.includes('mulched')) return modifyHexStats(hex, { soil: 2, biodiversity: 1 });
    return hex;
  });
  state.players.commons.resources.compost += 1;
}

function floodPulse(state) {
  state.hexes = state.hexes.map((hex) => {
    if (hex.elevation <= 1 && !(hex.tile === 'wetland' || hex.modifiers.includes('swale'))) return modifyHexStats(hex, { floodRisk: 3, erosionRisk: 2, pollution: 1 });
    if (hex.tile === 'wetland' || hex.modifiers.includes('swale')) return modifyHexStats(hex, { water: 2, floodRisk: -2 });
    return hex;
  });
  addValues(state.global, { floodRisk: 4, climatePressure: 2 });
}
