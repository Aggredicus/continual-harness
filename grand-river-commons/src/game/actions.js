import { playCommonsCard, endTurn, exportStateJson, newGame } from './engine.js';

export function selectCard(state, cardInstanceId) {
  state.selectedCardId = cardInstanceId;
  return state;
}

export function selectHex(state, hexId) {
  state.selectedHexId = hexId;
  return state;
}

export function playSelectedCard(state) {
  if (!state.selectedCardId || !state.selectedHexId) {
    return { ok: false, message: 'Select both a card and a hex before playing.' };
  }
  return playCommonsCard(state, state.selectedCardId, state.selectedHexId);
}

export function dispatchAction(state, action) {
  switch (action.type) {
    case 'selectCard': return selectCard(state, action.cardInstanceId);
    case 'selectHex': return selectHex(state, action.hexId);
    case 'playSelectedCard': return playSelectedCard(state);
    case 'endTurn': return endTurn(state);
    case 'exportStateJson': return exportStateJson(state);
    case 'resetGame': return newGame();
    default: return { ok: false, message: `Unknown action type: ${action.type}` };
  }
}
