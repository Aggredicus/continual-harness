export function renderSidebar(state, root, handlers) {
  const commons = state.players.commons;
  const mega = state.players.megaCorp;
  const selectedHex = state.hexes.find((hex) => hex.id === state.selectedHexId);
  const selectedCard = commons.hand.find((card) => card.instanceId === state.selectedCardId);

  root.innerHTML = `
    <section class="panel">
      <h2>Turn ${state.turn}</h2>
      <p><strong>Season:</strong> ${state.season}</p>
      <p><strong>Phase:</strong> ${state.phase}</p>
      ${state.winner ? `<p class="winner"><strong>Winner:</strong> ${state.winner}</p>` : ''}
    </section>
    <section class="panel">
      <h2>Commons Resources</h2>
      ${list(commons.resources)}
    </section>
    <section class="panel">
      <h2>Ethics</h2>
      ${list(commons.ethics)}
    </section>
    <section class="panel">
      <h2>Watershed Risks</h2>
      ${list(state.global)}
    </section>
    <section class="panel">
      <h2>MegaCorp</h2>
      ${list({ ...mega.resources, corporateControl: mega.corporateControl, profit: mega.profit })}
    </section>
    <section class="panel inspector">
      <h2>Inspector</h2>
      ${selectedCard ? `<p><strong>Card:</strong> ${selectedCard.name}</p>` : '<p>No card selected.</p>'}
      ${selectedHex ? hexDetails(selectedHex) : '<p>No hex selected.</p>'}
      <button id="playCardBtn" ${selectedCard && selectedHex && !state.winner ? '' : 'disabled'}>Play Selected Card</button>
    </section>
  `;

  root.querySelector('#playCardBtn')?.addEventListener('click', handlers.onPlaySelected);
}

function list(obj) {
  return `<dl>${Object.entries(obj).map(([key, value]) => `<div><dt>${label(key)}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
}

function hexDetails(hex) {
  return `
    <p><strong>Hex:</strong> ${hex.id}</p>
    <p><strong>Tile:</strong> ${hex.tile}</p>
    <p><strong>Owner:</strong> ${hex.owner}</p>
    <p><strong>Terrain:</strong> ${hex.baseTerrain}</p>
    <p><strong>Stats:</strong> soil ${hex.soil}, water ${hex.water}, biodiversity ${hex.biodiversity}, heat ${hex.heat}</p>
    <p><strong>Risk:</strong> flood ${hex.floodRisk}, erosion ${hex.erosionRisk}, pollution ${hex.pollution}</p>
    <p><strong>Modifiers:</strong> ${hex.modifiers.join(', ') || 'none'}</p>
  `;
}

function label(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}
