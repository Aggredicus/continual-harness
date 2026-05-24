import { drawCards, playCard } from './cards.js';
import { resolveEcologicalAging, updateGlobalScores } from './climate.js';
import { takeMegaCorpTurn } from './aiMegaCorp.js';
import { takeMotherNatureTurn } from './aiMotherNature.js';
import { createInitialState, log } from './state.js';

export function newGame() {
  const state = createInitialState();
  updateGlobalScores(state);
  return state;
}

export function playCommonsCard(state, cardInstanceId, hexId) {
  const result = playCard(state, 'commons', cardInstanceId, hexId);
  checkWinLoss(state);
  return result;
}

export function endTurn(state) {
  if (state.winner) return state;

  state.phase = 'megacorp_action';
  takeMegaCorpTurn(state);

  state.phase = 'nature_event';
  takeMotherNatureTurn(state);

  state.phase = 'ecology';
  resolveEcologicalAging(state);
  updateGlobalScores(state);
  checkWinLoss(state);

  if (!state.winner) {
    state.turn += 1;
    state.season = nextSeason(state.season);
    state.phase = 'commons_action';
    drawCards(state, 'commons', Math.max(0, 5 - state.players.commons.hand.length));
    drawCards(state, 'megaCorp', Math.max(0, 3 - state.players.megaCorp.hand.length));
    log(state, `Season advances to ${state.season}. Commons may act.`);
  }
  return state;
}

export function checkWinLoss(state) {
  if (state.global.watershedResilience >= 70) {
    state.winner = 'commons';
    log(state, 'Commons victory: watershed resilience reached 70.');
  } else if (state.players.megaCorp.corporateControl >= 70 || state.players.megaCorp.profit >= 100) {
    state.winner = 'megaCorp';
    log(state, 'MegaCorp victory: corporate control or profit threshold reached.');
  } else if (state.global.climatePressure >= 100) {
    state.winner = 'climate_collapse';
    log(state, 'Shared loss: climate pressure reached collapse threshold.');
  }
  return state.winner;
}

export function exportStateJson(state) {
  return JSON.stringify(state, null, 2);
}

function nextSeason(season) {
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  return seasons[(seasons.indexOf(season) + 1) % seasons.length];
}
