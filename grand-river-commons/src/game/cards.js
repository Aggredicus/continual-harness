import { addModifier, clamp, getHex, modifyHexStats, patchHex } from './hexGrid.js';
import { log } from './state.js';

export function canAfford(player, cost = {}) {
  return Object.entries(cost).every(([resource, amount]) => (player.resources[resource] ?? 0) >= amount);
}

export function payCost(player, cost = {}) {
  for (const [resource, amount] of Object.entries(cost)) {
    player.resources[resource] = (player.resources[resource] ?? 0) - amount;
  }
}

export function isValidTarget(card, hex) {
  if (!hex) return false;
  if (!card.validTargets || card.validTargets.includes('any')) return true;
  return card.validTargets.includes(hex.tile) || card.validTargets.includes(hex.baseTerrain) || hex.tags.some((tag) => card.validTargets.includes(tag));
}

export function playCard(state, faction, cardInstanceId, hexId) {
  if (state.winner) return { ok: false, message: 'Game already ended.' };
  const player = state.players[faction];
  const handIndex = player.hand.findIndex((card) => card.instanceId === cardInstanceId || card.id === cardInstanceId);
  if (handIndex < 0) return { ok: false, message: 'Card not found in hand.' };

  const card = player.hand[handIndex];
  const target = getHex(state.hexes, hexId) ?? state.hexes[0];
  if (!isValidTarget(card, target)) return { ok: false, message: `${card.name} cannot target ${target.tile}.` };
  if (!canAfford(player, card.cost)) return { ok: false, message: `Not enough resources for ${card.name}.` };

  payCost(player, card.cost);
  applyEffects(state, faction, card, target.id);
  player.discard.push(card);
  player.hand.splice(handIndex, 1);
  log(state, `${label(faction)} played ${card.name} on ${target.id}.`);
  return { ok: true, message: `${card.name} played.` };
}

export function applyEffects(state, faction, card, targetId) {
  for (const effect of card.effects ?? []) {
    applyEffect(state, faction, effect, targetId);
  }
}

function applyEffect(state, faction, effect, targetId) {
  const player = state.players[faction];
  if (effect.type === 'resources') addValues(player.resources, effect.resources);
  if (effect.type === 'ethics') addValues(state.players.commons.ethics, effect.ethics);
  if (effect.type === 'global') addValues(state.global, effect.global);
  if (effect.type === 'mega') addValues(state.players.megaCorp, effect.values);
  if (effect.type === 'claim') state.hexes = patchHex(state.hexes, targetId, (hex) => ({ ...hex, owner: effect.owner }));
  if (effect.type === 'modifier') state.hexes = patchHex(state.hexes, targetId, (hex) => addModifier(hex, effect.modifier));
  if (effect.type === 'hex') state.hexes = patchHex(state.hexes, targetId, (hex) => modifyHexStats(hex, effect.stats));
  if (effect.type === 'setTile') {
    state.hexes = patchHex(state.hexes, targetId, (hex) => ({
      ...modifyHexStats(hex, effect.stats ?? {}),
      tile: effect.tile,
      owner: effect.owner ?? hex.owner,
      age: effect.age ?? hex.age
    }));
  }
}

export function addValues(target, values = {}) {
  for (const [key, value] of Object.entries(values)) {
    target[key] = clamp((target[key] ?? 0) + value, -100, 999);
  }
}

export function drawCards(state, faction, count = 1) {
  const player = state.players[faction];
  for (let i = 0; i < count; i += 1) {
    if (player.deck.length === 0 && player.discard.length > 0) {
      player.deck = player.discard.splice(0);
    }
    const card = player.deck.shift();
    if (card) player.hand.push(card);
  }
}

function label(faction) {
  return faction === 'megaCorp' ? 'MegaCorp' : 'Commons';
}
