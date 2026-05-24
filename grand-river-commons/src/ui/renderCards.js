export function renderCards(state, root, handlers) {
  const hand = state.players.commons.hand;
  root.innerHTML = '<h2>Commons Hand</h2>';
  const row = document.createElement('div');
  row.className = 'card-row';

  for (const card of hand) {
    const button = document.createElement('button');
    button.className = 'card';
    if (state.selectedCardId === card.instanceId) button.classList.add('selected');
    button.innerHTML = `
      <strong>${card.name}</strong>
      <small>${card.type}</small>
      <p>${card.text}</p>
      <em>Cost: ${formatCost(card.cost)}</em>
    `;
    button.addEventListener('click', () => handlers.onSelectCard(card.instanceId));
    row.appendChild(button);
  }

  root.appendChild(row);
}

function formatCost(cost = {}) {
  const entries = Object.entries(cost);
  if (!entries.length) return 'free';
  return entries.map(([key, value]) => `${value} ${key}`).join(', ');
}
