import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, playCommonsCard } from '../src/game/engine.js';
import { canAfford, isValidTarget } from '../src/game/cards.js';
import { getHex, getNeighbors } from '../src/game/hexGrid.js';

test('hex neighbor calculation returns adjacent cells', () => {
  const state = newGame();
  const center = getHex(state.hexes, 'hex_7_7');
  assert.equal(getNeighbors(center, state.hexes).length, 6);
});

test('resource affordability checks costs', () => {
  const state = newGame();
  assert.equal(canAfford(state.players.commons, { labor: 1 }), true);
  assert.equal(canAfford(state.players.commons, { labor: 999 }), false);
});

test('card target validation respects validTargets', () => {
  const state = newGame();
  const card = state.players.commons.hand.find((candidate) => candidate.id === 'plant_oak_sapling') ?? { validTargets: ['grassland'] };
  const grass = state.hexes.find((hex) => hex.tile === 'grassland');
  assert.equal(isValidTarget(card, grass), true);
});

test('playing a Commons card changes state when legal', () => {
  const state = newGame();
  const card = state.players.commons.hand.find((candidate) => candidate.id === 'plant_oak_sapling');
  const target = state.hexes.find((hex) => card.validTargets.includes(hex.tile));
  const result = playCommonsCard(state, card.instanceId, target.id);
  assert.equal(result.ok, true);
  assert.equal(getHex(state.hexes, target.id).tile, 'oak_sapling');
});
