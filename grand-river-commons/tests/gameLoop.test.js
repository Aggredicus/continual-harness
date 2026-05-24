import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, endTurn, checkWinLoss, exportStateJson } from '../src/game/engine.js';

test('newGame creates a 15x15 board and initial player state', () => {
  const state = newGame();
  assert.equal(state.hexes.length, 225);
  assert.equal(state.players.commons.hand.length, 5);
  assert.equal(state.players.megaCorp.hand.length, 3);
  assert.equal(state.turn, 1);
});

test('endTurn advances the season and lets automated systems act', () => {
  const state = newGame();
  const startingLogLength = state.eventLog.length;
  endTurn(state);
  assert.equal(state.turn, 2);
  assert.notEqual(state.season, 'spring');
  assert.ok(state.eventLog.length > startingLogLength);
});

test('win/loss conditions are detected', () => {
  const state = newGame();
  state.global.watershedResilience = 70;
  assert.equal(checkWinLoss(state), 'commons');
});

test('state export is valid JSON', () => {
  const state = newGame();
  const parsed = JSON.parse(exportStateJson(state));
  assert.equal(parsed.gameId, 'grand_river_commons_mvp');
});
