export function renderLog(state, root) {
  root.innerHTML = `
    <h2>Event Log</h2>
    <ol>
      ${state.eventLog.map((entry) => `<li>${escapeHtml(entry)}</li>`).join('')}
    </ol>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
