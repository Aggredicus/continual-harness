export const DIRECTIONS = [[1,0],[1,-1],[0,-1],[-1,0],[-1,1],[0,1]];

export function hexId(q, r) {
  return `hex_${q}_${r}`;
}

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function generateHexGrid(width = 15, height = 15) {
  const hexes = [];
  for (let r = 0; r < height; r += 1) {
    for (let q = 0; q < width; q += 1) {
      hexes.push(createHex(q, r));
    }
  }
  return hexes;
}

export function createHex(q, r) {
  const terrain = inferTerrain(q, r);
  return {
    id: hexId(q, r), q, r,
    baseTerrain: terrain.baseTerrain,
    tile: terrain.tile,
    owner: 'neutral',
    elevation: terrain.elevation,
    soil: terrain.soil,
    water: terrain.water,
    biodiversity: terrain.biodiversity,
    pollution: terrain.pollution,
    heat: terrain.heat,
    erosionRisk: terrain.erosionRisk,
    floodRisk: terrain.floodRisk,
    age: 0,
    tags: [...terrain.tags],
    modifiers: []
  };
}

export function getNeighbors(hex, hexes) {
  const byId = new Map(hexes.map((h) => [h.id, h]));
  return DIRECTIONS.map(([dq, dr]) => byId.get(hexId(hex.q + dq, hex.r + dr))).filter(Boolean);
}

export function getHex(hexes, id) {
  return hexes.find((hex) => hex.id === id);
}

export function patchHex(hexes, id, patcher) {
  return hexes.map((hex) => hex.id === id ? patcher(cloneHex(hex)) : hex);
}

export function cloneHex(hex) {
  return { ...hex, tags: [...hex.tags], modifiers: [...hex.modifiers] };
}

export function addModifier(hex, modifier) {
  const next = cloneHex(hex);
  if (!next.modifiers.includes(modifier)) next.modifiers.push(modifier);
  return next;
}

export function modifyHexStats(hex, delta) {
  const next = cloneHex(hex);
  for (const [key, value] of Object.entries(delta)) {
    if (typeof value === 'number') next[key] = clamp((next[key] ?? 0) + value);
  }
  return next;
}

function inferTerrain(q, r) {
  const river = Math.abs(q - 7) <= 1;
  const tributary = r === 5 && q > 2 && q < 12;
  const wetland = (q < 4 && r < 4) || (q > 9 && r < 3);
  const forest = r < 5 && q > 4 && q < 11;
  const farm = r > 5 && r < 10 && q > 3 && q < 11;
  const neighborhood = q < 4 && r > 9;
  const industrial = q > 11 && r > 8;

  if (river || tributary) return terrain('river', 'river', 0, 1, 8, 5, 0, 0, 0, 6, ['river','waterway']);
  if (wetland) return terrain('wetland', 'wetland', 1, 6, 7, 7, 0, 0, 1, 5, ['wetland','riparian']);
  if (forest) return terrain('upland_forest', 'mature_oak', 6, 6, 4, 7, 0, 0, 1, 1, ['forest','tree','native']);
  if (farm) return terrain('farm_field', 'farm_field', 3, 4, 3, 1, 1, 2, 3, 3, ['farm','open']);
  if (neighborhood) return terrain('neighborhood', 'grassland', 2, 4, 3, 2, 1, 2, 2, 3, ['community','road_access']);
  if (industrial) return terrain('industrial_edge', 'degraded_lot', 3, 2, 1, 0, 4, 4, 5, 4, ['industrial','road_access']);
  return terrain('grassland', 'grassland', 4, 4, 3, 3, 0, 1, 2, 2, ['open']);
}

function terrain(baseTerrain, tile, elevation, soil, water, biodiversity, pollution, heat, erosionRisk, floodRisk, tags) {
  return { baseTerrain, tile, elevation, soil, water, biodiversity, pollution, heat, erosionRisk, floodRisk, tags };
}
