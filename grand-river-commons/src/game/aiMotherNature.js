import { resolveNatureEvent } from './climate.js';
import { log } from './state.js';

export function takeMotherNatureTurn(state) {
  if (state.natureDeck.length === 0) {
    state.natureDeck = state.natureDiscard.splice(0);
  }
  const index = weightedEventIndex(state);
  const [event] = state.natureDeck.splice(index, 1);
  if (!event) return null;
  resolveNatureEvent(state, event);
  state.natureDiscard.push(event);
  log(state, `Mother Nature drew ${event.name}.`);
  return event;
}

function weightedEventIndex(state) {
  const risky = state.global.climatePressure + state.global.floodRisk + state.global.droughtRisk + state.global.heatRisk + state.global.pollutionLoad;
  const riskBias = risky > 130 ? 0.7 : risky > 90 ? 0.55 : 0.4;
  const riskEvents = state.natureDeck.map((event, index) => ({ event, index })).filter(({ event }) => event.type === 'risk');
  const blessingEvents = state.natureDeck.map((event, index) => ({ event, index })).filter(({ event }) => event.type === 'blessing');
  const pool = Math.random() < riskBias && riskEvents.length ? riskEvents : blessingEvents.length ? blessingEvents : state.natureDeck.map((event, index) => ({ event, index }));
  return pool[Math.floor(Math.random() * pool.length)].index;
}
