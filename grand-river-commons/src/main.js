import { exportStateJson, newGame, endTurn, playCommonsCard } from './game/engine.js';
import { renderHexMap } from './ui/renderHexMap.js';
import { renderCards } from './ui/renderCards.js';
import { renderSidebar } from './ui/renderSidebar.js';
import { renderLog } from './ui/renderLog.js';

let state = newGame();

const els = {
  sidebar: document.querySelector('#sidebar'),
  map: document.querySelector('#map'),
  hand: document.querySelector('#hand'),
  log: document.querySelector('#log'),
  endTurn: document.querySelector('#endTurnBtn'),
  export: document.querySelector('#exportBtn'),
  reset: document.querySelector('#resetBtn')
};

const handlers = {
  onSelectHex(id) {
    state.selectedHexId = id;
    render();
  },
  onSelectCard(id) {
    state.selectedCardId = id;
    render();
  },
  onPlaySelected() {
    if (!state.selectedCardId || !state.selectedHexId) return;
    const result = playCommonsCard(state, state.selectedCardId, state.selectedHexId);
    if (!result.ok) state.eventLog.unshift(`[Turn ${state.turn}] ${result.message}`);
    state.selectedCardId = null;
    render();
  }
};

els.endTurn.addEventListener('click', () => {
  endTurn(state);
  state.selectedCardId = null;
  render();
});

els.export.addEventListener('click', () => {
  const blob = new Blob([exportStateJson(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `grand-river-commons-turn-${state.turn}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
});

els.reset.addEventListener('click', () => {
  state = newGame();
  render();
});

function render() {
  renderSidebar(state, els.sidebar, handlers);
  renderHexMap(state, els.map, handlers);
  renderCards(state, els.hand, handlers);
  renderLog(state, els.log);
}

render();
