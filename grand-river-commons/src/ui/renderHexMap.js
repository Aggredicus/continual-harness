export function renderHexMap(state, root, handlers) {
  root.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'hex-map';

  for (const hex of state.hexes) {
    const button = document.createElement('button');
    button.className = `hex tile-${hex.tile} owner-${hex.owner}`;
    button.style.gridColumn = String(hex.q + 1);
    button.style.gridRow = String(hex.r + 1);
    button.style.transform = `translateX(${hex.r % 2 ? 18 : 0}px)`;
    button.title = `${hex.id}\n${hex.tile}\nOwner: ${hex.owner}\nSoil ${hex.soil} Water ${hex.water} Biodiversity ${hex.biodiversity}`;
    button.textContent = shortLabel(hex.tile);
    if (state.selectedHexId === hex.id) button.classList.add('selected');
    button.addEventListener('click', () => handlers.onSelectHex(hex.id));
    grid.appendChild(button);
  }

  root.appendChild(grid);
}

function shortLabel(tile) {
  const labels = {
    river: '≈', wetland: 'W', mature_oak: 'O', young_oak: 'o', oak_sapling: 's', grassland: '·', farm_field: 'F', degraded_lot: 'x', bare_soil: 'b', pathway: 'P', compost_pile: 'C', finished_compost: '✓', garden_bed: 'G', pavement: '#', warehouse: 'M', monocrop: 'm', fallen_log: 'L'
  };
  return labels[tile] ?? tile.slice(0, 1).toUpperCase();
}
