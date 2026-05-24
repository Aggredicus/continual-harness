import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/game/engine.js';
import { resolveEcologicalAging, resolveNatureEvent } from '../src/game/climate.js';

test('light rain increases water on the board', () => {
  const state = newGame();
  const before = state.hexes.reduce((sum, hex) => sum + hex.water, 0);
  resolveNatureEvent(state, { name: 'Light Rain', text: 'test', resolve: 'rain_light' });
  const after = state.hexes.reduce((sum, hex) => sum + hex.water, 0);
  assert.ok(after > before);
});

test('ecological aging can mature compost into a resource', () => {
  const state = newGame();
  const target = state.hexes.find((hex) => hex.tile === 'grassland');
  target.tile = 'compost_pile';
  target.owner = 'commons';
  target.age = 1;
  const before = state.players.commons.resources.compost;
  resolveEcologicalAging(state);
  assert.ok(state.players.commons.resources.compost > before);
});
