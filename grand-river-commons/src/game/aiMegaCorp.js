import { isValidTarget, playCard } from './cards.js';

export function takeMegaCorpTurn(state) {
  const player = state.players.megaCorp;
  ensureHand(player);

  const candidates = [];
  for (const card of player.hand) {
    for (const hex of state.hexes) {
      if (isValidTarget(card, hex) && canMegaCorpUse(card, hex)) {
        candidates.push({ card, hex, score: scoreMove(card, hex, state) });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const chosen = candidates[0];
  if (!chosen) {
    state.eventLog.unshift(`[Turn ${state.turn}] MegaCorp found no legal move.`);
    return { ok: false, message: 'MegaCorp found no legal move.' };
  }

  return playCard(state, 'megaCorp', chosen.card.instanceId, chosen.hex.id);
}

function ensureHand(player) {
  while (player.hand.length < 3 && player.deck.length > 0) {
    player.hand.push(player.deck.shift());
  }
}

function canMegaCorpUse(card, hex) {
  if (card.id === 'land_grab') return hex.owner === 'neutral';
  if (card.id === 'pr_campaign' || card.id === 'lobbying') return true;
  if (card.id === 'clearcut') return hex.owner === 'megaCorp' || hex.tags.includes('forest') || hex.tile === 'mature_oak' || hex.tile === 'young_oak';
  return hex.owner === 'megaCorp' || hex.baseTerrain === 'industrial_edge' || hex.tile === 'degraded_lot';
}

function scoreMove(card, hex, state) {
  let score = card.profit ?? 1;
  if (card.id === 'land_grab') {
    if (hex.tags.includes('river') || hex.tags.includes('riparian')) score += 6;
    if (hex.tags.includes('road_access') || hex.baseTerrain === 'industrial_edge') score += 5;
    if (nearMegaCorp(hex, state.hexes)) score += 4;
  }
  if (card.id === 'clearcut' && (hex.tile === 'mature_oak' || hex.tags.includes('forest'))) score += 10;
  if ((card.id === 'warehouse' || card.id === 'pave') && ['degraded_lot','farm_field','bare_soil'].includes(hex.tile)) score += 7;
  if (card.id === 'monocrop' && hex.tile === 'farm_field') score += 6;
  if ((card.id === 'pr_campaign' || card.id === 'lobbying') && state.players.megaCorp.corporateControl < 30) score += 2;
  return score;
}

function nearMegaCorp(hex, hexes) {
  return hexes.some((other) => other.owner === 'megaCorp' && Math.abs(other.q - hex.q) <= 1 && Math.abs(other.r - hex.r) <= 1);
}
