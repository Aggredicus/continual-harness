import { generateHexGrid } from './hexGrid.js';
import { commonsCards } from '../data/commonsCards.js';
import { megaCorpCards } from '../data/megaCorpCards.js';
import { natureEvents } from '../data/natureEvents.js';

export function createInitialState() {
  const commonsDeck = expandDeck(commonsCards, 2);
  const megaCorpDeck = expandDeck(megaCorpCards, 2);
  const state = {
    gameId: 'grand_river_commons_mvp',
    turn: 1,
    phase: 'commons_action',
    season: 'spring',
    selectedCardId: null,
    selectedHexId: null,
    players: {
      commons: {
        resources: { wood: 1, biomass: 2, compost: 1, water: 2, food: 0, energy: 2, money: 3, labor: 4, trust: 2 },
        ethics: { earthCare: 5, peopleCare: 5, fairShare: 5 },
        deck: commonsDeck.slice(5),
        hand: commonsDeck.slice(0, 5),
        discard: []
      },
      megaCorp: {
        resources: { money: 10, energy: 5, labor: 4, influence: 3 },
        corporateControl: 8,
        profit: 0,
        deck: megaCorpDeck.slice(3),
        hand: megaCorpDeck.slice(0, 3),
        discard: []
      }
    },
    global: {
      climatePressure: 12,
      floodRisk: 10,
      droughtRisk: 10,
      heatRisk: 10,
      pollutionLoad: 5,
      erosionLoad: 5,
      watershedResilience: 10
    },
    hexes: generateHexGrid(15, 15),
    natureDeck: [...natureEvents],
    natureDiscard: [],
    eventLog: ['Grand River Commons begins. Restore the watershed before MegaCorp locks in extractive control.'],
    currentNatureEvent: null,
    winner: null
  };
  return state;
}

export function cloneState(state) {
  return structuredClone ? structuredClone(state) : JSON.parse(JSON.stringify(state));
}

export function expandDeck(cards, copies = 1) {
  const deck = [];
  for (let i = 0; i < copies; i += 1) {
    for (const card of cards) deck.push({ ...card, instanceId: `${card.id}_${i}` });
  }
  return shuffle(deck, 42 + cards.length + copies);
}

export function shuffle(items, seed = Date.now()) {
  const out = [...items];
  let x = seed || 1;
  const rand = () => {
    x = (x * 1664525 + 1013904223) % 4294967296;
    return x / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function log(state, message) {
  state.eventLog.unshift(`[Turn ${state.turn}] ${message}`);
  state.eventLog = state.eventLog.slice(0, 80);
}
